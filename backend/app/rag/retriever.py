import time
from typing import List, Optional
from pydantic import BaseModel, Field

from backend.app.config import get_settings
from backend.app.rag.embeddings import EmbeddingModel, get_embedding_model
from backend.app.rag.lightweight_retriever import TfidfRetriever
from backend.app.rag.vector_store import FAISSVectorStore, get_vector_store
from backend.app.schemas.chat import RetrievedChunk
from backend.app.utils.logging import logger


class RetrievalResult(BaseModel):
    """Result of searching the municipal vector store."""

    status: str  # "SUCCESS" or "NO_RELEVANT_INFORMATION"
    chunks: List[RetrievedChunk] = Field(default_factory=list)
    top_score: float = 0.0
    latency_ms: float = 0.0


class MunicipalRetriever:
    """Retrieves top-K grounded municipal chunks with confidence threshold filtering."""

    def __init__(
        self,
        vector_store: Optional[FAISSVectorStore] = None,
        embedding_model: Optional[EmbeddingModel] = None,
        default_top_k: Optional[int] = None,
        default_threshold: Optional[float] = None,
    ):
        settings = get_settings()
        self.vector_store = vector_store or get_vector_store()
        self.embedding_model = embedding_model or get_embedding_model()
        self.default_top_k = default_top_k or settings.TOP_K
        self.default_threshold = default_threshold or settings.SIMILARITY_THRESHOLD
        self._tfidf_retriever: Optional[TfidfRetriever] = None

    def _retrieve_with_tfidf(
        self, query: str, top_k: int, threshold: float, start_time: float
    ) -> RetrievalResult:
        """Use local lexical retrieval only when FAISS/GTE is unavailable."""
        if self._tfidf_retriever is None:
            self._tfidf_retriever = TfidfRetriever()

        # Lexical cosine scores have a different scale from embedding cosine scores.
        lexical_threshold = min(0.65, max(0.05, threshold * 0.25))
        raw_results = self._tfidf_retriever.search(query, top_k=top_k)
        top_score = raw_results[0][1] if raw_results else 0.0
        # Keep only candidates close to the best lexical match. This prevents a
        # weakly overlapping document from entering the grounded LLM context.
        relevance_floor = max(lexical_threshold, top_score * 0.8)
        filtered_chunks = [
            RetrievedChunk(
                chunk_id=chunk.chunk_id,
                document_id=chunk.document_id,
                source=chunk.source,
                category=chunk.category,
                content=chunk.content,
                score=round(float(score), 4),
                page=chunk.page,
                row=chunk.row,
                source_url=chunk.source_url,
            )
            for chunk, score in raw_results
            if score >= relevance_floor
        ]

        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        logger.info(
            "TF-IDF fallback retrieval complete in %sms: retrieved %s/%s chunks "
            "(top_score: %.4f, threshold: %.4f)",
            latency_ms,
            len(filtered_chunks),
            len(raw_results),
            top_score,
            relevance_floor,
        )
        return RetrievalResult(
            status="SUCCESS" if filtered_chunks else "NO_RELEVANT_INFORMATION",
            chunks=filtered_chunks,
            top_score=top_score,
            latency_ms=latency_ms,
        )

    def retrieve(
        self,
        query: str,
        top_k: Optional[int] = None,
        threshold: Optional[float] = None,
    ) -> RetrievalResult:
        """Embed citizen query, search FAISS index, and apply relevance filtering."""
        start_time = time.perf_counter()
        k = top_k or self.default_top_k
        min_threshold = threshold if threshold is not None else self.default_threshold

        clean_query = query.strip()
        if not clean_query:
            return RetrievalResult(
                status="NO_RELEVANT_INFORMATION",
                chunks=[],
                top_score=0.0,
                latency_ms=(time.perf_counter() - start_time) * 1000,
            )

        try:
            # Keep the existing FAISS/GTE path as the preferred retrieval method.
            if not self.vector_store.is_loaded:
                self.vector_store.load()
            query_embedding = self.embedding_model.embed_query(clean_query)
            raw_results = self.vector_store.search(query_embedding, top_k=k)
        except (FileNotFoundError, RuntimeError, OSError, ValueError) as exc:
            logger.warning("FAISS/GTE retrieval unavailable; using TF-IDF fallback: %s", exc)
            return self._retrieve_with_tfidf(
                clean_query, top_k=k, threshold=min_threshold, start_time=start_time
            )

        # Filter by minimum similarity threshold
        filtered_chunks: List[RetrievedChunk] = []
        top_score = 0.0

        for chunk, score in raw_results:
            if score > top_score:
                top_score = score

            if score >= min_threshold:
                filtered_chunks.append(
                    RetrievedChunk(
                        chunk_id=chunk.chunk_id,
                        document_id=chunk.document_id,
                        source=chunk.source,
                        category=chunk.category,
                        content=chunk.content,
                        score=round(float(score), 4),
                        page=chunk.page,
                        row=chunk.row,
                        source_url=chunk.source_url,
                    )
                )

        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        logger.info(
            f"Retrieval complete in {latency_ms}ms: retrieved {len(filtered_chunks)}/{len(raw_results)} chunks "
            f"(top_score: {top_score:.4f}, threshold: {min_threshold:.2f})"
        )

        if not filtered_chunks:
            return RetrievalResult(
                status="NO_RELEVANT_INFORMATION",
                chunks=[],
                top_score=top_score,
                latency_ms=latency_ms,
            )

        return RetrievalResult(
            status="SUCCESS",
            chunks=filtered_chunks,
            top_score=top_score,
            latency_ms=latency_ms,
        )
