import math
import re
from collections import Counter
from typing import Dict, List, Tuple

import numpy as np

from backend.app.config import get_settings
from backend.app.rag.chunker import DocumentChunker
from backend.app.rag.loader import DocumentLoader
from backend.app.schemas.chat import DocumentChunk
from backend.app.utils.logging import logger


_TOKEN_PATTERN = re.compile(r"[a-z0-9]+")


class TfidfRetriever:
    """Small local lexical index used only when the embedding path is unavailable."""

    def __init__(self) -> None:
        settings = get_settings()
        loader = DocumentLoader(settings.sources_json_path)
        documents, failed_files = loader.load_directory(settings.raw_data_dir)
        if failed_files:
            logger.warning("TF-IDF fallback skipped files: %s", failed_files)

        self.chunks: List[DocumentChunk] = DocumentChunker(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
        ).chunk_documents(documents)
        self.document_frequency: Counter[str] = Counter()
        self.term_frequencies: List[Counter[str]] = []
        self.inverse_document_frequency: Dict[str, float] = {}
        self.vectors: List[Dict[str, float]] = []
        self._build_index()
        logger.info("TF-IDF fallback indexed %d chunks", len(self.chunks))

    @staticmethod
    def _tokens(text: str) -> List[str]:
        return _TOKEN_PATTERN.findall(text.lower())

    def _build_index(self) -> None:
        for chunk in self.chunks:
            term_frequency = Counter(self._tokens(chunk.content))
            self.term_frequencies.append(term_frequency)
            self.document_frequency.update(term_frequency.keys())

        document_count = len(self.chunks)
        self.inverse_document_frequency = {
            term: math.log((1 + document_count) / (1 + frequency)) + 1.0
            for term, frequency in self.document_frequency.items()
        }

        for term_frequency in self.term_frequencies:
            vector = {
                term: (1.0 + math.log(count)) * self.inverse_document_frequency[term]
                for term, count in term_frequency.items()
            }
            self.vectors.append(vector)

    def search(self, query: str, top_k: int) -> List[Tuple[DocumentChunk, float]]:
        query_terms = Counter(self._tokens(query))
        if not query_terms or not self.chunks:
            return []

        query_vector = {
            term: (1.0 + math.log(count)) * self.inverse_document_frequency[term]
            for term, count in query_terms.items()
            if term in self.inverse_document_frequency
        }
        query_norm = math.sqrt(sum(value * value for value in query_vector.values()))
        if query_norm == 0:
            return []

        scored: List[Tuple[int, float]] = []
        for index, document_vector in enumerate(self.vectors):
            dot_product = sum(
                query_value * document_vector.get(term, 0.0)
                for term, query_value in query_vector.items()
            )
            document_norm = math.sqrt(
                sum(value * value for value in document_vector.values())
            )
            score = dot_product / (query_norm * document_norm) if document_norm else 0.0
            if score > 0:
                scored.append((index, score))

        scored.sort(key=lambda item: item[1], reverse=True)
        return [(self.chunks[index], float(score)) for index, score in scored[:top_k]]
