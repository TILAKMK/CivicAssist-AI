from fastapi import APIRouter
from backend.app.llm.gemini import get_gemini_client
from backend.app.rag.embeddings import get_embedding_model
from backend.app.rag.vector_store import get_vector_store
from backend.app.schemas.chat import HealthResponse

router = APIRouter(prefix="/api", tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health & Readiness Check",
    description="Reports system operational status, model configuration, and index metrics.",
)
async def check_health() -> HealthResponse:
    """Return component readiness status without exposing secret keys."""
    llm = get_gemini_client()
    vector_store = get_vector_store()
    embeddings = get_embedding_model()

    return HealthResponse(
        status="ok",
        gemini_configured=llm.is_configured,
        vector_store_loaded=vector_store.is_loaded,
        embedding_model_loaded=embeddings.is_loaded,
        total_indexed_chunks=vector_store.total_chunks,
    )
