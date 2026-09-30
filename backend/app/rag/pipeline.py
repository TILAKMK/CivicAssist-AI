import time
from typing import Dict, List, Optional, Tuple

from backend.app.config import get_settings
from backend.app.llm.gemini import GeminiClient, get_gemini_client
from backend.app.rag.prompt import GROUNDING_FALLBACK_ANSWER, format_context
from backend.app.rag.retriever import MunicipalRetriever
from backend.app.schemas.chat import ChatResponse, SourceItem
from backend.app.utils.logging import logger


class MunicipalRAGPipeline:
    """End-to-end grounded RAG execution pipeline for municipal citizen inquiries."""

    def __init__(
        self,
        retriever: Optional[MunicipalRetriever] = None,
        llm_client: Optional[GeminiClient] = None,
    ):
        self.retriever = retriever or MunicipalRetriever()
        self.llm = llm_client or get_gemini_client()
        self.settings = get_settings()

    def run(self, question: str, top_k: Optional[int] = None) -> ChatResponse:
        """Execute grounded pipeline:

        question -> retrieve -> check relevance -> generate with Gemini -> return citations.
        """
        start_time = time.perf_counter()

        sanitized_question = question.strip()
        if not sanitized_question:
            return ChatResponse(
                answer="Please provide a valid question regarding municipal services.",
                sources=[],
                retrieved_chunks=[],
                latency_ms=0.0,
                grounded=False,
                confidence=0.0,
            )

        if len(sanitized_question) > self.settings.MAX_QUESTION_LENGTH:
            return ChatResponse(
                answer=f"Question exceeds maximum allowed length of {self.settings.MAX_QUESTION_LENGTH} characters.",
                sources=[],
                retrieved_chunks=[],
                latency_ms=0.0,
                grounded=False,
                confidence=0.0,
            )

        logger.info(f"Processing citizen query: '{sanitized_question[:60]}...'")

        # Step 1: Vector search and similarity filtering
        retrieval_res = self.retriever.retrieve(
            query=sanitized_question,
            top_k=top_k,
        )

        # Step 2: Guard against irrelevant or low-confidence queries
        if retrieval_res.status == "NO_RELEVANT_INFORMATION" or not retrieval_res.chunks:
            total_latency = round((time.perf_counter() - start_time) * 1000, 2)
            logger.info(
                f"No relevant municipal context found (top score: {retrieval_res.top_score:.4f}). "
                "Returning grounded fallback without invoking LLM."
            )
            return ChatResponse(
                answer=GROUNDING_FALLBACK_ANSWER,
                sources=[],
                retrieved_chunks=retrieval_res.chunks if self.settings.DEBUG else [],
                latency_ms=total_latency,
                grounded=False,
                confidence=retrieval_res.top_score,
            )

        # Step 3: Extract structured sources from retrieved chunks
        sources_map: Dict[Tuple[str, Optional[int], Optional[int]], SourceItem] = {}
        for chunk in retrieval_res.chunks:
            key = (chunk.source, chunk.page, chunk.row)
            if key not in sources_map:
                sources_map[key] = SourceItem(
                    source=chunk.source,
                    page=chunk.page,
                    row=chunk.row,
                    category=chunk.category,
                )
        sources = list(sources_map.values())

        # Step 4: Build grounded prompt context
        context_str = format_context(retrieval_res.chunks)

        # Step 5: Generate answer via Gemini
        try:
            answer = self.llm.generate_answer(
                question=sanitized_question,
                context=context_str,
            )
        except Exception as e:
            total_latency = round((time.perf_counter() - start_time) * 1000, 2)
            logger.error(f"Error during Gemini generation: {e}")
            return ChatResponse(
                answer=f"An error occurred while generating the answer: {e}",
                sources=sources,
                retrieved_chunks=retrieval_res.chunks if self.settings.DEBUG else [],
                latency_ms=total_latency,
                grounded=False,
                confidence=retrieval_res.top_score,
            )

        total_latency = round((time.perf_counter() - start_time) * 1000, 2)
        logger.info(f"RAG request completed in {total_latency}ms")

        # In production, chunks are omitted unless DEBUG=true
        chunks_to_return = retrieval_res.chunks if self.settings.DEBUG else []

        return ChatResponse(
            answer=answer,
            sources=sources,
            retrieved_chunks=chunks_to_return,
            latency_ms=total_latency,
            grounded=True,
            confidence=retrieval_res.top_score,
        )


# ---------------------------------------------------------------------------
# Global Pipeline Singleton
# ---------------------------------------------------------------------------

_PIPELINE_INSTANCE: Optional[MunicipalRAGPipeline] = None


def get_rag_pipeline() -> MunicipalRAGPipeline:
    """Return the shared MunicipalRAGPipeline singleton."""
    global _PIPELINE_INSTANCE
    if _PIPELINE_INSTANCE is None:
        _PIPELINE_INSTANCE = MunicipalRAGPipeline()
    return _PIPELINE_INSTANCE


# Alias for convenience
RAGPipeline = MunicipalRAGPipeline
