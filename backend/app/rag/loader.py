import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import pandas as pd
import pypdf

from backend.app.schemas.chat import RawDocument
from backend.app.utils.logging import logger
from backend.app.utils.text import clean_text, compute_content_id


class DocumentLoader:
    """Loads municipal datasets across multiple formats (PDF, CSV, JSON, TXT)

    preserving granular provenance and metadata.
    """

    SUPPORTED_EXTENSIONS = {".pdf", ".csv", ".json", ".txt"}

    def __init__(self, sources_registry_path: Optional[Path] = None):
        self.sources_registry: Dict[str, Dict[str, str]] = {}
        if sources_registry_path and sources_registry_path.exists():
            try:
                with open(sources_registry_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for item in data:
                        filename = item.get("filename")
                        if filename:
                            self.sources_registry[filename.lower()] = item
            except Exception as e:
                logger.warning(f"Could not load sources registry: {e}")

    def load_directory(
        self, directory_path: Path
    ) -> Tuple[List[RawDocument], List[str]]:
        """Scan directory recursively, parse supported files, and return (docs, failed_files)."""
        documents: List[RawDocument] = []
        failed_files: List[str] = []

        if not directory_path.exists():
            logger.warning(f"Directory {directory_path} does not exist.")
            return documents, failed_files

        for file_path in directory_path.rglob("*"):
            if file_path.is_file():
                # Skip helper or doc files like README.md and .gitkeep
                if file_path.name.startswith(".") or file_path.name.lower() in {
                    "readme.md",
                    "sources.json",
                }:
                    continue

                if file_path.suffix.lower() in self.SUPPORTED_EXTENSIONS:
                    try:
                        docs = self.load_file(file_path)
                        documents.extend(docs)
                        logger.info(
                            f"Loaded {len(docs)} document units from {file_path.name}"
                        )
                    except Exception as e:
                        logger.error(f"Failed to parse file {file_path}: {e}")
                        failed_files.append(str(file_path))

        return documents, failed_files

    def load_file(self, file_path: Path) -> List[RawDocument]:
        """Detect file type and dispatch to appropriate loader."""
        ext = file_path.suffix.lower()
        if ext == ".pdf":
            return self._load_pdf(file_path)
        elif ext == ".csv":
            return self._load_csv(file_path)
        elif ext == ".json":
            return self._load_json(file_path)
        elif ext == ".txt":
            return self._load_txt(file_path)
        else:
            raise ValueError(f"Unsupported file format: {ext}")

    def _get_category(self, file_path: Path) -> str:
        """Infer document category from folder structure or registry."""
        filename = file_path.name.lower()
        if filename in self.sources_registry:
            cat = self.sources_registry[filename].get("category")
            if cat:
                return cat
        # Use parent folder name as category (e.g. data/raw/waste -> 'waste')
        parent_name = file_path.parent.name.lower()
        if parent_name not in {"raw", "data", "processed"}:
            return parent_name
        return "general"

    def _get_source_url(self, file_path: Path) -> str:
        """Retrieve source URL if registered in sources.json."""
        filename = file_path.name.lower()
        if filename in self.sources_registry:
            return self.sources_registry[filename].get("source_url", "unknown")
        return "unknown"

    def _load_pdf(self, file_path: Path) -> List[RawDocument]:
        """Extract text from PDF on a per-page basis to preserve page citations."""
        documents: List[RawDocument] = []
        category = self._get_category(file_path)
        source_url = self._get_source_url(file_path)

        reader = pypdf.PdfReader(str(file_path))
        for page_idx, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            cleaned = clean_text(text)
            if cleaned:
                doc_id = compute_content_id(
                    f"{file_path.name}_p{page_idx}_{cleaned[:50]}", prefix="pdf"
                )
                documents.append(
                    RawDocument(
                        document_id=doc_id,
                        source=file_path.name,
                        source_path=str(file_path),
                        source_url=source_url,
                        category=category,
                        content=cleaned,
                        metadata={"page": page_idx, "total_pages": len(reader.pages)},
                    )
                )
        return documents

    def _load_csv(self, file_path: Path) -> List[RawDocument]:
        """Parse CSV rows as structured, self-contained record representations."""
        documents: List[RawDocument] = []
        category = self._get_category(file_path)
        source_url = self._get_source_url(file_path)

        df = pd.read_csv(file_path, dtype=str)
        # Drop completely empty rows
        df = df.dropna(how="all")

        for row_idx, row in df.iterrows():
            # Format row as key-value lines
            fields = []
            for col_name, val in row.items():
                if pd.notna(val) and str(val).strip():
                    fields.append(f"{col_name}: {str(val).strip()}")

            if not fields:
                continue

            content = "\n".join(fields)
            cleaned = clean_text(content)
            doc_id = compute_content_id(
                f"{file_path.name}_r{row_idx}_{cleaned[:50]}", prefix="csv"
            )

            documents.append(
                RawDocument(
                    document_id=doc_id,
                    source=file_path.name,
                    source_path=str(file_path),
                    source_url=source_url,
                    category=category,
                    content=cleaned,
                    metadata={"row": int(row_idx) + 1},
                )
            )
        return documents

    def _load_json(self, file_path: Path) -> List[RawDocument]:
        """Parse JSON documents (either lists of objects or structured key-value maps)."""
        documents: List[RawDocument] = []
        category = self._get_category(file_path)
        source_url = self._get_source_url(file_path)

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        if isinstance(data, list):
            for idx, item in enumerate(data, start=1):
                if isinstance(item, dict):
                    # Check for FAQ format (question/answer) or generic key-value
                    lines = []
                    for k, v in item.items():
                        lines.append(f"{k}: {v}")
                    content = clean_text("\n".join(lines))
                else:
                    content = clean_text(str(item))

                if content:
                    doc_id = compute_content_id(
                        f"{file_path.name}_item{idx}_{content[:50]}", prefix="json"
                    )
                    documents.append(
                        RawDocument(
                            document_id=doc_id,
                            source=file_path.name,
                            source_path=str(file_path),
                            source_url=source_url,
                            category=category,
                            content=content,
                            metadata={"item_index": idx},
                        )
                    )
        elif isinstance(data, dict):
            # If root is dict, check if values are records or sections
            for key, val in data.items():
                if isinstance(val, (dict, list)):
                    content = clean_text(f"Section: {key}\n{json.dumps(val, indent=2)}")
                else:
                    content = clean_text(f"{key}: {val}")

                if content:
                    doc_id = compute_content_id(
                        f"{file_path.name}_{key}_{content[:50]}", prefix="json"
                    )
                    documents.append(
                        RawDocument(
                            document_id=doc_id,
                            source=file_path.name,
                            source_path=str(file_path),
                            source_url=source_url,
                            category=category,
                            content=content,
                            metadata={"section_key": str(key)},
                        )
                    )

        return documents

    def _load_txt(self, file_path: Path) -> List[RawDocument]:
        """Load and clean plain text files."""
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()

        cleaned = clean_text(content)
        if not cleaned:
            return []

        category = self._get_category(file_path)
        source_url = self._get_source_url(file_path)
        doc_id = compute_content_id(f"{file_path.name}_{cleaned[:50]}", prefix="txt")

        return [
            RawDocument(
                document_id=doc_id,
                source=file_path.name,
                source_path=str(file_path),
                source_url=source_url,
                category=category,
                content=cleaned,
                metadata={},
            )
        ]
