from functools import lru_cache
from pathlib import Path
from typing import Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment and .env file."""

    # Project paths (calculated relative to this file)
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent

    # LLM Settings
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "qwen/qwen3.8-27b"
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Embedding Settings
    EMBEDDING_MODEL: str = "thenlper/gte-large"

    # Storage Paths (resolved relative to BASE_DIR if not absolute)
    VECTOR_STORE_PATH: str = "vector_store"
    DATA_RAW_PATH: str = "data/raw"
    DATA_SOURCES_PATH: str = "data/sources.json"

    # Retrieval Configuration
    TOP_K: int = 5
    SIMILARITY_THRESHOLD: float = 0.65

    # Chunking Configuration
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 150

    # Application & Security Settings
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    MAX_QUESTION_LENGTH: int = 1000
    REQUEST_TIMEOUT_SECONDS: float = 20.0

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug_flag(cls, v):
        """Safely parse boolean DEBUG flag even if environment has values like 'release'."""
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.strip().lower() in {"1", "true", "yes", "debug", "on"}
        return False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def vector_store_dir(self) -> Path:
        """Resolve vector store directory path."""
        p = Path(self.VECTOR_STORE_PATH)
        return p if p.is_absolute() else self.BASE_DIR / p

    @property
    def raw_data_dir(self) -> Path:
        """Resolve raw data directory path."""
        p = Path(self.DATA_RAW_PATH)
        return p if p.is_absolute() else self.BASE_DIR / p

    @property
    def sources_json_path(self) -> Path:
        """Resolve sources.json path."""
        p = Path(self.DATA_SOURCES_PATH)
        return p if p.is_absolute() else self.BASE_DIR / p

    @property
    def faiss_index_path(self) -> Path:
        """Path to saved FAISS index file."""
        return self.vector_store_dir / "index.faiss"

    @property
    def metadata_path(self) -> Path:
        """Path to saved vector store metadata JSON file."""
        return self.vector_store_dir / "metadata.json"


@lru_cache()
def get_settings() -> Settings:
    """Return a cached Settings singleton."""
    return Settings()
