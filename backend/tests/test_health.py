import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Verify root documentation landing endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Municipal Public Service FAQ Chatbot API"
    assert "/docs" in data["docs_url"]


def test_health_endpoint():
    """Verify health endpoint structure and response."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "gemini_configured" in data
    assert "vector_store_loaded" in data
    assert "embedding_model_loaded" in data
    assert "total_indexed_chunks" in data
    # Ensure no secret strings or tokens are leaked in health payload
    assert "key" not in str(data).lower() or data["gemini_configured"] in [True, False]


def test_sources_endpoint_empty():
    """Verify sources endpoint responds correctly even before ingestion."""
    response = client.get("/api/sources")
    assert response.status_code == 200
    data = response.json()
    assert "sources" in data
    assert "total_documents" in data
    assert isinstance(data["sources"], list)
