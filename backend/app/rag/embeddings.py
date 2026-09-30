from typing import List, Optional
import numpy as np

from backend.app.config import get_settings
from backend.app.utils.logging import logger


class EmbeddingModel:
    """Wrapper around SentenceTransformer with automatic dimension detection

    and lazy singleton management.
    """

    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name or get_settings().EMBEDDING_MODEL
        self._model = None
        self._dimension: Optional[int] = None

    def _ensure_loaded(self):
        """Lazy load the sentence transformer model once."""
        if self._model is None:
            logger.info(f"Loading embedding model: {self.model_name}...")
            try:
                from sentence_transformers import SentenceTransformer

                self._model = SentenceTransformer(self.model_name)
                # Automatically detect dimension from loaded model
                self._dimension = self._model.get_sentence_embedding_dimension()
                logger.info(
                    f"Successfully loaded {self.model_name} (dimension: {self._dimension})"
                )
            except Exception as e:
                logger.error(f"Failed to load embedding model {self.model_name}: {e}")
                raise RuntimeError(
                    f"Could not load embedding model '{self.model_name}'. Details: {e}"
                ) from e

    @property
    def dimension(self) -> int:
        """Get the embedding vector dimension."""
        self._ensure_loaded()
        return self._dimension  # type: ignore

    @property
    def is_loaded(self) -> bool:
        """Check if model is currently loaded in memory."""
        return self._model is not None

    def embed_documents(
        self, texts: List[str], batch_size: int = 32, normalize: bool = True
    ) -> np.ndarray:
        """Generate normalized embeddings for a list of document strings."""
        self._ensure_loaded()
        if not texts:
            return np.empty((0, self.dimension), dtype=np.float32)

        # Replace empty strings with a single space to avoid errors
        sanitized_texts = [t if t.strip() else " " for t in texts]

        embeddings = self._model.encode(
            sanitized_texts,
            batch_size=batch_size,
            show_progress_bar=len(texts) > 50,
            normalize_embeddings=normalize,
            convert_to_numpy=True,
        )
        return embeddings.astype(np.float32)

    def embed_query(self, query: str, normalize: bool = True) -> np.ndarray:
        """Generate normalized embedding for a single citizen query string."""
        self._ensure_loaded()
        query_text = query.strip() or " "
        embedding = self._model.encode(
            query_text,
            normalize_embeddings=normalize,
            convert_to_numpy=True,
        )
        # Ensure 2D shape (1, dimension) for FAISS search
        if embedding.ndim == 1:
            embedding = np.expand_dims(embedding, axis=0)
        return embedding.astype(np.float32)


# ---------------------------------------------------------------------------
# Global Singleton Accessor
# ---------------------------------------------------------------------------

_EMBEDDING_INSTANCE: Optional[EmbeddingModel] = None


def get_embedding_model(model_name: Optional[str] = None) -> EmbeddingModel:
    """Return the shared EmbeddingModel singleton."""
    global _EMBEDDING_INSTANCE
    if _EMBEDDING_INSTANCE is None:
        _EMBEDDING_INSTANCE = EmbeddingModel(model_name)
    return _EMBEDDING_INSTANCE
