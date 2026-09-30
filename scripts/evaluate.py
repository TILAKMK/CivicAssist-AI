"""Evaluation script: runs benchmark questions from evaluation/questions.json

evaluates retrieval accuracy, source relevance, keyword hit rate, and latency,
and outputs evaluation/results.json.
"""

import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.config import get_settings
from backend.app.rag.pipeline import MunicipalRAGPipeline
from backend.app.rag.retriever import MunicipalRetriever
from backend.app.rag.vector_store import get_vector_store
from backend.app.utils.logging import logger


def run_evaluation():
    settings = get_settings()
    questions_path = settings.BASE_DIR / "evaluation" / "questions.json"
    results_path = settings.BASE_DIR / "evaluation" / "results.json"

    if not questions_path.exists():
        print(f"[ERROR] Questions file not found at {questions_path}")
        return

    vector_store = get_vector_store()
    if not settings.faiss_index_path.exists() or not settings.metadata_path.exists():
        print(
            f"\n[ERROR] FAISS index not found at {settings.faiss_index_path}.\n"
            "Please run the ingestion script first: python scripts/ingest.py"
        )
        return

    if not vector_store.is_loaded:
        vector_store.load()

    with open(questions_path, "r", encoding="utf-8") as f:
        questions: List[Dict[str, Any]] = json.load(f)

    print("=" * 70)
    print(f"STARTING BENCHMARK EVALUATION ({len(questions)} questions)")
    print(f"Indexed Chunks: {vector_store.total_chunks}")
    print("=" * 70)

    retriever = MunicipalRetriever()
    pipeline = MunicipalRAGPipeline(retriever=retriever)

    total_questions = len(questions)
    retrieval_successes = 0
    source_matches = 0
    keyword_successes = 0
    latencies: List[float] = []
    question_results: List[Dict[str, Any]] = []

    for item in questions:
        q_id = item.get("id", "unknown")
        q_text = item["question"]
        expected_src = item.get("expected_source")
        expected_kw = item.get("expected_keywords", [])
        should_reject = item.get("should_reject", False)

        t0 = time.perf_counter()
        retrieval = retriever.retrieve(q_text)
        latency = round((time.perf_counter() - t0) * 1000, 2)
        latencies.append(latency)

        retrieved_sources = [c.source.lower() for c in retrieval.chunks]
        all_retrieved_text = " ".join([c.content.lower() for c in retrieval.chunks])

        # 1. Retrieval success
        if should_reject:
            retrieval_ok = retrieval.status == "NO_RELEVANT_INFORMATION"
        else:
            retrieval_ok = (
                retrieval.status == "SUCCESS" and len(retrieval.chunks) > 0
            )

        if retrieval_ok:
            retrieval_successes += 1

        # 2. Source match
        source_ok = False
        if should_reject:
            source_ok = len(retrieved_sources) == 0
        elif expected_src:
            source_ok = any(expected_src.lower() in s for s in retrieved_sources)

        if source_ok:
            source_matches += 1

        # 3. Keyword hit check in retrieved context
        if should_reject:
            kw_ok = True
        elif expected_kw:
            hits = [kw for kw in expected_kw if kw.lower() in all_retrieved_text]
            # Consider success if at least 50% of expected keywords appear in retrieved context
            kw_ok = len(hits) >= max(1, len(expected_kw) // 2)
        else:
            kw_ok = True

        if kw_ok:
            keyword_successes += 1

        # Run pipeline answer if Gemini is configured, else note skipped
        answer = "LLM generation skipped (test mode or no API key)"
        if pipeline.llm.is_configured and retrieval_ok and not should_reject:
            try:
                resp = pipeline.run(q_text)
                answer = resp.answer
            except Exception as e:
                answer = f"Error: {e}"

        result_entry = {
            "id": q_id,
            "question": q_text,
            "category": item.get("category"),
            "retrieval_status": retrieval.status,
            "top_score": retrieval.top_score,
            "retrieved_sources": retrieved_sources,
            "expected_source": expected_src,
            "retrieval_ok": retrieval_ok,
            "source_ok": source_ok,
            "keyword_ok": kw_ok,
            "latency_ms": latency,
            "answer_preview": answer[:150] + ("..." if len(answer) > 150 else ""),
        }
        question_results.append(result_entry)

        status_flag = "PASS" if (retrieval_ok and source_ok and kw_ok) else "FAIL"
        print(f"[{status_flag}] {q_id} ({latency}ms) - Top Score: {retrieval.top_score:.4f}")

    # Compute actual calculated rates
    retrieval_rate = (
        round((retrieval_successes / total_questions) * 100, 2)
        if total_questions > 0
        else 0.0
    )
    source_rate = (
        round((source_matches / total_questions) * 100, 2)
        if total_questions > 0
        else 0.0
    )
    keyword_rate = (
        round((keyword_successes / total_questions) * 100, 2)
        if total_questions > 0
        else 0.0
    )
    avg_latency = (
        round(sum(latencies) / len(latencies), 2) if latencies else 0.0
    )

    # Composite correctness score
    overall_accuracy = round(
        (retrieval_rate * 0.4) + (source_rate * 0.3) + (keyword_rate * 0.3), 2
    )

    output_payload = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "total_questions": total_questions,
        "evaluated": total_questions,
        "retrieval_success_rate_percent": retrieval_rate,
        "source_match_rate_percent": source_rate,
        "keyword_match_rate_percent": keyword_rate,
        "overall_estimated_accuracy_percent": overall_accuracy,
        "target_accuracy_percent": 80.0,
        "target_met": overall_accuracy >= 80.0,
        "average_retrieval_latency_ms": avg_latency,
        "results": question_results,
    }

    with open(results_path, "w", encoding="utf-8") as f:
        json.dump(output_payload, f, indent=2)

    print("\n" + "=" * 70)
    print("EVALUATION SUMMARY REPORT")
    print("=" * 70)
    print(f"Total Questions Evaluated       : {total_questions}")
    print(f"Retrieval Success Rate          : {retrieval_rate}%")
    print(f"Source Match Rate               : {source_rate}%")
    print(f"Keyword Verification Rate       : {keyword_rate}%")
    print(f"Overall Accuracy                : {overall_accuracy}% (Target: >=80%)")
    print(f"Average Retrieval Latency       : {avg_latency} ms (Target: < 20000ms)")
    print(f"Target Met                      : {'YES' if overall_accuracy >= 80.0 else 'NO'}")
    print(f"Detailed results written to     : {results_path}")
    print("=" * 70)


if __name__ == "__main__":
    run_evaluation()
