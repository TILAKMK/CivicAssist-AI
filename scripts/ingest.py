"""Ingestion script: processes raw municipal datasets from data/raw/

and creates the FAISS vector index and metadata file.
"""

import sys
import time
from pathlib import Path

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.config import get_settings
from backend.app.rag.chunker import DocumentChunker
from backend.app.rag.embeddings import get_embedding_model
from backend.app.rag.loader import DocumentLoader
from backend.app.rag.vector_store import get_vector_store
from backend.app.utils.logging import logger


def run_ingestion():
    settings = get_settings()
    raw_dir = settings.raw_data_dir
    sources_json = settings.sources_json_path

    logger.info("=" * 60)
    logger.info("Starting Municipal FAQ Dataset Ingestion")
    logger.info(f"Source Directory: {raw_dir}")
    logger.info(f"Embedding Model : {settings.EMBEDDING_MODEL}")
    logger.info(f"Target Store    : {settings.vector_store_dir}")
    logger.info("=" * 60)

    start_time = time.perf_counter()

    # Step 1: Load documents
    loader = DocumentLoader(sources_registry_path=sources_json)
    documents, failed_files = loader.load_directory(raw_dir)

    print("\n--- INGESTION REPORT ---")
    print(f"Documents loaded: {len(documents)}")
    print(f"Documents failed: {len(failed_files)}")
    if failed_files:
        print("\nFailed files:")
        for f in failed_files:
            print(f"  - {f}")

    if not documents:
        print(
            "\n[WARNING] No valid documents were found in data/raw/. "
            "Please place municipal files (.pdf, .csv, .json, .txt) into data/raw/ subdirectories."
        )
        return

    # Step 2: Chunk documents
    chunker = DocumentChunker(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
    )
    chunks = chunker.chunk_documents(documents)
    print(f"Chunks created: {len(chunks)}")

    if not chunks:
        print("[WARNING] Zero chunks produced from loaded documents.")
        return

    # Step 3: Embed chunks using GTE-large (SentenceTransformer)
    embedding_model = get_embedding_model(settings.EMBEDDING_MODEL)
    chunk_texts = [c.content for c in chunks]

    logger.info(f"Generating embeddings for {len(chunk_texts)} chunks...")
    embeddings = embedding_model.embed_documents(chunk_texts)
    print(f"Embeddings created: {len(embeddings)}")

    # Step 4: Build FAISS index and persist
    vector_store = get_vector_store()
    vector_store.create_index(dimension=embedding_model.dimension)
    vector_store.add_chunks(embeddings=embeddings, chunks=chunks)
    vector_store.save()

    print(f"Vector index size: {vector_store.total_chunks}")
    print("Index saved successfully.")

    total_time = round(time.perf_counter() - start_time, 2)
    print(f"Total Ingestion Time: {total_time}s")
    print("=" * 60)


if __name__ == "__main__":
    run_ingestion()
