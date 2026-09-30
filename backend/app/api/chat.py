from fastapi import APIRouter, HTTPException, status
from backend.app.rag.pipeline import get_rag_pipeline
from backend.app.schemas.chat import ChatRequest, ChatResponse
from backend.app.utils.logging import logger

router = APIRouter(prefix="/api", tags=["Chat"])


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Ask a Municipal Question",
    description="Processes citizen question through the grounded municipal RAG pipeline and returns verified answers with source citations.",
)
async def ask_question(request: ChatRequest) -> ChatResponse:
    """Handle incoming citizen query."""
    question = request.question.strip()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty or whitespace.",
        )

    pipeline = get_rag_pipeline()
    try:
        response = pipeline.run(
            question=question,
            top_k=request.top_k,
        )
        return response
    except FileNotFoundError as e:
        logger.error(f"Vector store not found: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Unexpected error in /chat: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing the request: {e}",
        )
