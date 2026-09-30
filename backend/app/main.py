from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.api.chat import router as chat_router
from backend.app.api.health import router as health_router
from backend.app.api.sources import router as sources_router
from backend.app.config import get_settings
from backend.app.rag.vector_store import get_vector_store
from backend.app.utils.logging import logger, setup_logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for pre-warming vector index and models."""
    settings = get_settings()
    setup_logger(level="DEBUG" if settings.DEBUG else "INFO")
    logger.info("Initializing Municipal Public Service FAQ Chatbot Backend...")

    # Attempt to load vector store if index files exist
    vector_store = get_vector_store()
    if settings.faiss_index_path.exists() and settings.metadata_path.exists():
        try:
            logger.info("Pre-loading existing vector store into memory...")
            vector_store.load()
        except Exception as e:
            logger.warning(
                f"Failed to load existing vector store on startup: {e}. "
                "You can re-ingest data using: python scripts/ingest.py"
            )
    else:
        logger.info(
            f"No FAISS index found at {settings.faiss_index_path}. "
            "Server is ready, but document retrieval requires running: python scripts/ingest.py"
        )

    yield

    logger.info("Shutting down Municipal FAQ Chatbot Backend.")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title="Municipal Public Service FAQ Chatbot API",
        description="Grounded GenAI RAG backend for municipal and civic inquiries.",
        version="1.0.0",
        lifespan=lifespan,
    )

    # Configure CORS for future web and mobile frontends
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Global Exception Handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled error on {request.method} {request.url.path}: {exc}")
        return JSONResponse(
            status_code=500,
            content={"detail": "An internal server error occurred. Please try again."},
        )

    # Register API Routers
    app.include_router(health_router)
    app.include_router(chat_router)
    app.include_router(sources_router)

    @app.get("/", tags=["Root"])
    async def root():
        return {
            "name": "Municipal Public Service FAQ Chatbot API",
            "version": "1.0.0",
            "docs_url": "/docs",
            "health_url": "/api/health",
        }

    return app


app = create_app()
