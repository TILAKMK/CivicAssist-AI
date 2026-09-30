import json
from pathlib import Path
from typing import List, Optional, Tuple
import faiss
import numpy as np

from backend.app.config import get_settings
from backend.app.schemas.chat import DocumentChunk
from backend.app.utils.logging import logger


class FAISSVectorStore:
    """FAISS-based vector database supporting IndexFlatIP (cosine similarity)

    synchronized with atomic chunk metadata.
    """

    def __init__(
        self,
        index_path: Optional[Path] = None,
        metadata_path: Optional[Path] = None,
    ):
        settings = get_settings()
        self.index_path = index_path or settings.faiss_index_path
        self.metadata_path = metadata_path or settings.metadata_path

        self.index: Optional[faiss.Index] = None
        self.chunks: List[DocumentChunk] = []

    @property
    def is_loaded(self) -> bool:
        """Check if both index and metadata are currently loaded in memory."""
        return self.index is not None and len(self.chunks) > 0

    @property
    def total_chunks(self) -> int:
        """Total number of indexed vectors."""
        return self.index.ntotal if self.index is not None else 0

    def create_index(self, dimension: int):
        """Initialize an empty FAISS IndexFlatIP (Inner Product) for cosine similarity."""
        logger.info(f"Creating new FAISS IndexFlatIP with dimension {dimension}")
        self.index = faiss.IndexFlatIP(dimension)
        self.chunks = []

    def add_chunks(
        self, embeddings: np.ndarray, chunks: List[DocumentChunk]
    ) -> None:
        """Add embedding vectors and their corresponding chunk metadata to the store."""
        if len(embeddings) != len(chunks):
            raise ValueError(
                f"Mismatch: {len(embeddings)} embeddings vs {len(chunks)} chunks"
            )

        if len(chunks) == 0:
            return

        dimension = embeddings.shape[1]
        if self.index is None:
            self.create_index(dimension)

        if self.index.d != dimension:
            raise ValueError(
                f"Vector dimension mismatch: expected {self.index.d}, got {dimension}"
            )

        # Ensure float32 dtype
        vectors = embeddings.astype(np.float32)

        # Normalize in-place to guarantee inner product corresponds to cosine similarity
        faiss.normalize_L2(vectors)

        self.index.add(vectors)
        self.chunks.extend(chunks)
        logger.info(
            f"Added {len(chunks)} chunks. Index now has {self.index.ntotal} total vectors."
        )

    def save(
        self,
        index_path: Optional[Path] = None,
        metadata_path: Optional[Path] = None,
    ) -> None:
        """Persist FAISS index binary and metadata JSON to disk."""
        target_index = index_path or self.index_path
        target_metadata = metadata_path or self.metadata_path

        if self.index is None or len(self.chunks) == 0:
            raise ValueError("Cannot save empty vector store.")

        # Ensure target directories exist
        target_index.parent.mkdir(parents=True, exist_ok=True)
        target_metadata.parent.mkdir(parents=True, exist_ok=True)

        logger.info(f"Saving FAISS index to {target_index}...")
        faiss.write_index(self.index, str(target_index))

        logger.info(f"Saving chunk metadata ({len(self.chunks)} items) to {target_metadata}...")
        metadata_payload = [chunk.model_dump() for chunk in self.chunks]
        with open(target_metadata, "w", encoding="utf-8") as f:
            json.dump(metadata_payload, f, indent=2, ensure_ascii=False)

        logger.info("Vector store successfully saved.")

    def load(
        self,
        index_path: Optional[Path] = None,
        metadata_path: Optional[Path] = None,
    ) -> None:
        """Load FAISS index and chunk metadata from disk."""
        target_index = index_path or self.index_path
        target_metadata = metadata_path or self.metadata_path

        if not target_index.exists() or not target_metadata.exists():
            raise FileNotFoundError(
                f"FAISS vector store files not found at '{target_index}' or '{target_metadata}'. "
                "Please run the document ingestion script first: python scripts/ingest.py"
            )

        logger.info(f"Loading FAISS index from {target_index}...")
        self.index = faiss.read_index(str(target_index))

        logger.info(f"Loading chunk metadata from {target_metadata}...")
        with open(target_metadata, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        self.chunks = [DocumentChunk(**item) for item in raw_data]

        if self.index.ntotal != len(self.chunks):
            raise ValueError(
                f"Corrupted index: FAISS ntotal ({self.index.ntotal}) != chunks count ({len(self.chunks)})"
            )

        logger.info(
            f"Successfully loaded vector store with {self.index.ntotal} indexed municipal chunks."
        )

    def search(
        self, query_embedding: np.ndarray, top_k: int = 5
    ) -> List[Tuple[DocumentChunk, float]]:
        """Search top_k nearest neighbors for query embedding.

        Returns list of (DocumentChunk, similarity_score) sorted by score descending.
        """
        if self.index is None or len(self.chunks) == 0:
            raise RuntimeError(
                "Vector store is not initialized or empty. Please ingest data first."
            )

        vec = query_embedding.astype(np.float32)
        if vec.ndim == 1:
            vec = np.expand_dims(vec, axis=0)

        # Normalize query vector for cosine similarity
        faiss.normalize_L2(vec)

        k = min(top_k, self.index.ntotal)
        scores, indices = self.index.search(vec, k)

        results: List[Tuple[DocumentChunk, float]] = []
        for idx, score in zip(indices[0], scores[0]):
            if idx >= 0 and idx < len(self.chunks):
                results.append((self.chunks[idx], float(score)))

        return results


# ---------------------------------------------------------------------------
# Global Vector Store Singleton
# ---------------------------------------------------------------------------

_VECTOR_STORE_INSTANCE: Optional[FAISSVectorStore] = None


def get_vector_store() -> FAISSVectorStore:
    """Return the shared FAISSVectorStore singleton."""
    global _VECTOR_STORE_INSTANCE
    if _VECTOR_STORE_INSTANCE is None:
        _VECTOR_STORE_INSTANCE = FAISSVectorStore()
    return _VECTOR_STORE_INSTANCE
