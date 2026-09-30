from datetime import datetime, timezone
from typing import List, Optional
import re

from backend.app.schemas.chat import DocumentChunk, RawDocument
from backend.app.utils.logging import logger
from backend.app.utils.text import clean_text


class DocumentChunker:
    """Splits raw municipal documents into semantically coherent, metadata-preserving chunks.

    Maintains integrity of tabular records (CSV) and structured items (JSON).
    """

    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 150):
        if chunk_overlap >= chunk_size:
            raise ValueError("chunk_overlap must be strictly less than chunk_size")
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_documents(self, documents: List[RawDocument]) -> List[DocumentChunk]:
        """Split a list of raw documents into chunks preserving all metadata."""
        all_chunks: List[DocumentChunk] = []

        for doc in documents:
            try:
                chunks = self.chunk_single_document(doc)
                all_chunks.extend(chunks)
            except Exception as e:
                logger.error(
                    f"Failed to chunk document {doc.document_id} from {doc.source}: {e}"
                )

        logger.info(
            f"Chunked {len(documents)} raw document units into {len(all_chunks)} chunks"
        )
        return all_chunks

    def chunk_single_document(self, doc: RawDocument) -> List[DocumentChunk]:
        """Chunk a single raw document based on format and metadata."""
        content = doc.content.strip()
        if not content:
            return []

        now_iso = datetime.now(timezone.utc).isoformat()
        page: Optional[int] = doc.metadata.get("page")
        row: Optional[int] = doc.metadata.get("row")

        # Case 1: Structured CSV row or short JSON record -> preserve atomic unit
        is_structured_record = (row is not None) or (
            "item_index" in doc.metadata
        )
        if is_structured_record and len(content) <= (self.chunk_size * 1.5):
            chunk_id = f"{doc.document_id}_rec"
            return [
                DocumentChunk(
                    chunk_id=chunk_id,
                    document_id=doc.document_id,
                    source=doc.source,
                    source_path=doc.source_path,
                    source_url=doc.source_url,
                    category=doc.category,
                    content=content,
                    page=page,
                    row=row,
                    timestamp=now_iso,
                    metadata=doc.metadata,
                )
            ]

        # Case 2: Paragraph / narrative documents (PDF pages, TXT, long text)
        text_slices = self._split_text_with_overlap(content)
        chunks: List[DocumentChunk] = []

        for idx, text_slice in enumerate(text_slices):
            chunk_id = f"{doc.document_id}_chunk_{idx:02d}"
            chunks.append(
                DocumentChunk(
                    chunk_id=chunk_id,
                    document_id=doc.document_id,
                    source=doc.source,
                    source_path=doc.source_path,
                    source_url=doc.source_url,
                    category=doc.category,
                    content=text_slice,
                    page=page,
                    row=row,
                    timestamp=now_iso,
                    metadata={**doc.metadata, "chunk_index": idx},
                )
            )

        return chunks

    def _split_text_with_overlap(self, text: str) -> List[str]:
        """Split text cleanly using natural paragraph, line, and sentence boundaries with overlap."""
        if len(text) <= self.chunk_size:
            return [text]

        # Break text into atomic paragraph / sentence segments
        paragraphs = re.split(r"(\n\n+)", text)
        segments: List[str] = []
        for p in paragraphs:
            if not p:
                continue
            if len(p) <= self.chunk_size:
                segments.append(p)
            else:
                # Break long paragraph by single newlines or sentence boundaries
                sentences = re.split(r"(?<=[.!?])\s+", p)
                for s in sentences:
                    if len(s) <= self.chunk_size:
                        segments.append(s)
                    else:
                        # Fallback: slice by words
                        words = s.split(" ")
                        current_word_chunk: List[str] = []
                        current_len = 0
                        for w in words:
                            if current_len + len(w) + 1 > self.chunk_size:
                                segments.append(" ".join(current_word_chunk))
                                current_word_chunk = [w]
                                current_len = len(w)
                            else:
                                current_word_chunk.append(w)
                                current_len += len(w) + 1
                        if current_word_chunk:
                            segments.append(" ".join(current_word_chunk))

        # Re-pack segments into chunks of ~chunk_size with chunk_overlap
        chunks: List[str] = []
        current_chunk: List[str] = []
        current_length = 0

        for seg in segments:
            seg_len = len(seg)
            if current_length + seg_len > self.chunk_size and current_chunk:
                merged = clean_text("".join(current_chunk))
                if merged:
                    chunks.append(merged)

                # Keep overlapping tail
                overlap_chars = 0
                overlap_chunk: List[str] = []
                for prev_seg in reversed(current_chunk):
                    if overlap_chars + len(prev_seg) <= self.chunk_overlap:
                        overlap_chunk.insert(0, prev_seg)
                        overlap_chars += len(prev_seg)
                    else:
                        break

                current_chunk = overlap_chunk + [seg]
                current_length = sum(len(s) for s in current_chunk)
            else:
                current_chunk.append(seg)
                current_length += seg_len

        if current_chunk:
            final_text = clean_text("".join(current_chunk))
            if final_text and (not chunks or final_text != chunks[-1]):
                chunks.append(final_text)

        return chunks if chunks else [text]
