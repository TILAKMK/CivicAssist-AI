from unittest.mock import MagicMock, patch
import pytest
from fastapi.testclient import TestClient

from backend.app.llm.gemini import GeminiClient
from backend.app.main import app
from backend.app.rag.pipeline import MunicipalRAGPipeline
from backend.app.rag.prompt import GROUNDING_FALLBACK_ANSWER
from backend.app.rag.retriever import MunicipalRetriever, RetrievalResult
from backend.app.schemas.chat import RetrievedChunk

client = TestClient(app)


def test_chat_validation_empty():
    """Verify that empty questions are rejected with HTTP 400 or 422."""
    response = client.post("/api/chat", json={"question": ""})
    assert response.status_code in [400, 422]


def test_chat_validation_whitespace():
    """Verify that whitespace-only questions are rejected."""
    response = client.post("/api/chat", json={"question": "    "})
    assert response.status_code == 400


def test_chat_validation_overly_long():
    """Verify question length validation."""
    long_q = "municipal " * 200
    response = client.post("/api/chat", json={"question": long_q})
    # Length > 1000 characters triggers Pydantic 422 Unprocessable Entity
    assert response.status_code == 422


def test_gemini_client_missing_key():
    """Verify that unconfigured Gemini client raises descriptive error without leaking secrets."""
    client_no_key = GeminiClient(api_key="")
    assert not client_no_key.is_configured
    with pytest.raises(ValueError) as exc:
        client_no_key.generate_answer("question", "context")
    assert "GEMINI_API_KEY" in str(exc.value)


def test_pipeline_irrelevant_question_fallback():
    """Verify that irrelevant questions return grounding fallback without calling LLM."""
    mock_retriever = MagicMock(spec=MunicipalRetriever)
    mock_retriever.retrieve.return_value = RetrievalResult(
        status="NO_RELEVANT_INFORMATION",
        chunks=[],
        top_score=0.25,
        latency_ms=10.0,
    )

    mock_llm = MagicMock(spec=GeminiClient)
    pipeline = MunicipalRAGPipeline(retriever=mock_retriever, llm_client=mock_llm)

    response = pipeline.run("What is the recipe for chocolate brownies?")

    # Verify fallback message returned
    assert response.answer == GROUNDING_FALLBACK_ANSWER
    assert response.grounded is False
    assert len(response.sources) == 0
    # Crucial: verify LLM was NEVER called
    mock_llm.generate_answer.assert_not_called()


def test_pipeline_grounded_response_with_sources():
    """Verify pipeline returns accurate source metadata from retrieved chunks."""
    sample_chunk = RetrievedChunk(
        chunk_id="chk_01",
        document_id="doc_building_sop",
        source="building_license_sop.pdf",
        category="services",
        content="Building license requires sanctioned plan and property tax receipt.",
        score=0.92,
        page=4,
        row=None,
    )

    mock_retriever = MagicMock(spec=MunicipalRetriever)
    mock_retriever.retrieve.return_value = RetrievalResult(
        status="SUCCESS",
        chunks=[sample_chunk],
        top_score=0.92,
        latency_ms=15.0,
    )

    mock_llm = MagicMock(spec=GeminiClient)
    mock_llm.is_configured = True
    mock_llm.generate_answer.return_value = (
        "To obtain a building license, you must provide a sanctioned plan and tax receipt."
    )

    pipeline = MunicipalRAGPipeline(retriever=mock_retriever, llm_client=mock_llm)
    response = pipeline.run("What is needed for a building license?")

    assert "building license" in response.answer.lower()
    assert response.grounded is True
    assert len(response.sources) == 1
    assert response.sources[0].source == "building_license_sop.pdf"
    assert response.sources[0].page == 4
    assert response.sources[0].category == "services"
    assert response.latency_ms > 0

    # Ensure LLM was called with retrieved context
    mock_llm.generate_answer.assert_called_once()


def test_api_chat_endpoint_e2e_mocked():
    """Test full HTTP POST /api/chat execution with mocked pipeline."""
    sample_chunk = RetrievedChunk(
        chunk_id="chk_waste_01",
        document_id="doc_waste",
        source="waste_schedule.txt",
        category="waste",
        content="Wet waste is collected every morning between 7 AM and 10 AM.",
        score=0.89,
        page=None,
        row=None,
    )

    with patch("backend.app.api.chat.get_rag_pipeline") as mock_get_pipeline:
        mock_pipeline = MagicMock()
        mock_pipeline.run.return_value = {
            "answer": "Wet waste is collected between 7 AM and 10 AM.",
            "sources": [{"source": "waste_schedule.txt", "category": "waste"}],
            "retrieved_chunks": [],
            "latency_ms": 120.5,
            "grounded": True,
            "confidence": 0.89,
        }
        mock_get_pipeline.return_value = mock_pipeline

        response = client.post(
            "/api/chat",
            json={"question": "What time is wet waste collected?", "top_k": 3},
        )

        assert response.status_code == 200
        data = response.json()
        assert "7 AM and 10 AM" in data["answer"]
        assert len(data["sources"]) == 1
        assert data["sources"][0]["source"] == "waste_schedule.txt"
        assert data["latency_ms"] == 120.5
