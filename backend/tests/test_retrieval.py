import json
from pathlib import Path
import numpy as np
import pytest

from backend.app.rag.chunker import DocumentChunker
from backend.app.rag.embeddings import EmbeddingModel
from backend.app.rag.loader import DocumentLoader
from backend.app.rag.retriever import MunicipalRetriever
from backend.app.rag.vector_store import FAISSVectorStore
from backend.app.schemas.chat import DocumentChunk, RawDocument


def test_loader_text_file(tmp_path: Path):
    """Test loading plain text municipal files."""
    txt_file = tmp_path / "waste_rules.txt"
    txt_file.write_text("Wet waste collection is daily. Dry waste on Tuesday and Friday.", encoding="utf-8")

    loader = DocumentLoader()
    docs = loader.load_file(txt_file)

    assert len(docs) == 1
    assert "daily" in docs[0].content
    assert docs[0].source == "waste_rules.txt"
    assert docs[0].document_id.startswith("txt_")


def test_loader_csv_structured(tmp_path: Path):
    """Test loading CSV preserving tabular row integrity."""
    csv_file = tmp_path / "ward_info.csv"
    csv_content = "Ward_No,Ward_Name,Zone\n101,Koramangala,South\n102,Indiranagar,East\n"
    csv_file.write_text(csv_content, encoding="utf-8")

    loader = DocumentLoader()
    docs = loader.load_file(csv_file)

    assert len(docs) == 2
    assert docs[0].metadata["row"] == 1
    assert "Ward_No: 101" in docs[0].content
    assert "Zone: South" in docs[0].content


def test_loader_json_format(tmp_path: Path):
    """Test loading JSON FAQs and records."""
    json_file = tmp_path / "faq.json"
    faq_data = [
        {"question": "How to pay tax?", "answer": "Visit municipal portal online."},
        {"question": "Where is ward office?", "answer": "Sector 3, Main Road."}
    ]
    json_file.write_text(json.dumps(faq_data), encoding="utf-8")

    loader = DocumentLoader()
    docs = loader.load_file(json_file)

    assert len(docs) == 2
    assert "Visit municipal portal" in docs[0].content


def test_chunker_structured_and_narrative():
    """Test chunker behavior on structured records vs long text."""
    chunker = DocumentChunker(chunk_size=100, chunk_overlap=20)

    # 1. Structured record: should not be fragmented
    rec_doc = RawDocument(
        document_id="csv_row1",
        source="wards.csv",
        source_path="/path/to/wards.csv",
        category="wards",
        content="Ward: 12\nZone: North",
        metadata={"row": 1},
    )
    rec_chunks = chunker.chunk_documents([rec_doc])
    assert len(rec_chunks) == 1
    assert rec_chunks[0].row == 1

    # 2. Long narrative text: should split with overlap
    long_text = "This is sentence one about building permits. " * 10
    narrative_doc = RawDocument(
        document_id="doc_long",
        source="permits.txt",
        source_path="/path/to/permits.txt",
        category="services",
        content=long_text,
        metadata={},
    )
    narrative_chunks = chunker.chunk_documents([narrative_doc])
    assert len(narrative_chunks) > 1
    for c in narrative_chunks:
        assert c.source == "permits.txt"
        assert c.chunk_id.startswith("doc_long_chunk_")


def test_vector_store_lifecycle(tmp_path: Path):
    """Test FAISS store creation, vector addition, persistence, and querying."""
    index_file = tmp_path / "test_index.faiss"
    meta_file = tmp_path / "test_metadata.json"

    store = FAISSVectorStore(index_path=index_file, metadata_path=meta_file)
    store.create_index(dimension=4)

    # Fake normalized 4-dimensional embeddings
    vectors = np.array([
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.7071, 0.7071, 0.0, 0.0],
    ], dtype=np.float32)

    chunks = [
        DocumentChunk(
            chunk_id=f"chk_{i}",
            document_id=f"doc_{i}",
            source=f"source_{i}.txt",
            source_path="/test",
            category="test",
            content=f"Sample text content {i}",
        )
        for i in range(3)
    ]

    store.add_chunks(vectors, chunks)
    assert store.total_chunks == 3

    # Save and reload
    store.save()
    assert index_file.exists()
    assert meta_file.exists()

    new_store = FAISSVectorStore(index_path=index_file, metadata_path=meta_file)
    new_store.load()
    assert new_store.total_chunks == 3

    # Query with [1.0, 0.0, 0.0, 0.0] -> should return chk_0 first with score ~1.0
    query_vec = np.array([[1.0, 0.0, 0.0, 0.0]], dtype=np.float32)
    results = new_store.search(query_vec, top_k=2)
    assert len(results) == 2
    best_chunk, best_score = results[0]
    assert best_chunk.chunk_id == "chk_0"
    assert pytest.approx(best_score, 0.01) == 1.0


def test_missing_vector_store_error(tmp_path: Path):
    """Test that loading a non-existent index raises a clear FileNotFoundError."""
    store = FAISSVectorStore(
        index_path=tmp_path / "missing.faiss",
        metadata_path=tmp_path / "missing.json",
    )
    with pytest.raises(FileNotFoundError) as exc_info:
        store.load()
    assert "run the document ingestion script" in str(exc_info.value).lower()


def test_retriever_threshold_filtering(tmp_path: Path):
    """Test that retriever filters out results below the similarity threshold."""
    index_file = tmp_path / "filter_index.faiss"
    meta_file = tmp_path / "filter_meta.json"

    store = FAISSVectorStore(index_path=index_file, metadata_path=meta_file)
    store.create_index(dimension=2)

    # Vectors
    vectors = np.array([[1.0, 0.0], [0.0, 1.0]], dtype=np.float32)
    chunks = [
        DocumentChunk(
            chunk_id="chk_x",
            document_id="doc_x",
            source="x.txt",
            source_path="/x",
            category="test",
            content="Property tax rules",
        ),
        DocumentChunk(
            chunk_id="chk_y",
            document_id="doc_y",
            source="y.txt",
            source_path="/y",
            category="test",
            content="Trade licenses",
        ),
    ]
    store.add_chunks(vectors, chunks)

    # Mock embedding model
    class MockEmbedding:
        def embed_query(self, query: str):
            # Query pointing along X axis: [1.0, 0.0]
            return np.array([[1.0, 0.0]], dtype=np.float32)

    retriever = MunicipalRetriever(
        vector_store=store,
        embedding_model=MockEmbedding(),
        default_top_k=2,
        default_threshold=0.8,
    )

    # Top score is 1.0 for chk_x, while chk_y has dot product 0.0 (< 0.8)
    res = retriever.retrieve("property tax")
    assert res.status == "SUCCESS"
    assert len(res.chunks) == 1
    assert res.chunks[0].chunk_id == "chk_x"

    # Query with strict threshold 0.99 where no chunk qualifies
    class MockNoMatchEmbedding:
        def embed_query(self, query: str):
            return np.array([[0.5, 0.5]], dtype=np.float32)

    unrelated_retriever = MunicipalRetriever(
        vector_store=store,
        embedding_model=MockNoMatchEmbedding(),
        default_top_k=2,
        default_threshold=0.95,
    )
    res_none = unrelated_retriever.retrieve("cake recipe")
    assert res_none.status == "NO_RELEVANT_INFORMATION"
    assert len(res_none.chunks) == 0
