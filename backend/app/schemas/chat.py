from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Internal Data / Chunk Models
# ---------------------------------------------------------------------------

class RawDocument(BaseModel):
    """Represents an ingested raw document before chunking."""
    document_id: str
    source: str
    source_path: str
    source_url: Optional[str] = "unknown"
    category: str
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class DocumentChunk(BaseModel):
    """Represents a chunk of text with rich traceable municipal metadata."""
    chunk_id: str
    document_id: str
    source: str
    source_path: str
    source_url: Optional[str] = "unknown"
    category: str
    content: str
    page: Optional[int] = None
    row: Optional[int] = None
    timestamp: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# API Request & Response Models
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    """Citizen query request payload."""
    question: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="The citizen's natural-language municipal inquiry",
        examples=["What documents are required for a building license application?"],
    )
    top_k: Optional[int] = Field(
        default=None,
        ge=1,
        le=20,
        description="Number of municipal chunks to retrieve (defaults to server config)",
    )


class SourceItem(BaseModel):
    """Traceable municipal source reference."""
    source: str
    document_id: Optional[str] = None
    chunk_id: Optional[str] = None
    page: Optional[int] = None
    row: Optional[int] = None
    category: Optional[str] = None
    source_url: Optional[str] = None


class RetrievedChunk(BaseModel):
    """Retrieved chunk details for debug/inspection."""
    chunk_id: str
    document_id: str
    source: str
    category: str
    content: str
    score: float
    page: Optional[int] = None
    row: Optional[int] = None
    source_url: Optional[str] = None


class ChatResponse(BaseModel):
    """Grounded chatbot response with citations and latency."""
    answer: str
    sources: List[SourceItem] = Field(default_factory=list)
    retrieved_chunks: List[RetrievedChunk] = Field(default_factory=list)
    latency_ms: float
    grounded: bool = True
    confidence: Optional[float] = None


class HealthResponse(BaseModel):
    """System health check response."""
    status: str
    gemini_configured: bool
    vector_store_loaded: bool
    embedding_model_loaded: bool
    total_indexed_chunks: int = 0


class SourceMetadata(BaseModel):
    """Description of an indexed source file."""
    name: str
    category: str
    source_url: Optional[str] = "unknown"
    total_chunks: int = 0


class SourcesResponse(BaseModel):
    """Available municipal sources response."""
    sources: List[SourceMetadata] = Field(default_factory=list)
    total_documents: int = 0
