import json
from collections import defaultdict
from fastapi import APIRouter
from backend.app.config import get_settings
from backend.app.rag.vector_store import get_vector_store
from backend.app.schemas.chat import SourceMetadata, SourcesResponse

router = APIRouter(prefix="/api", tags=["Sources"])


@router.get(
    "/sources",
    response_model=SourcesResponse,
    summary="List Municipal Sources",
    description="Returns all registered municipal documents, categories, and chunk counts.",
)
async def list_sources() -> SourcesResponse:
    """Return catalog of available municipal data sources."""
    settings = get_settings()
    vector_store = get_vector_store()

    # Load URL mappings from data/sources.json if present
    url_map = {}
    if settings.sources_json_path.exists():
        try:
            with open(settings.sources_json_path, "r", encoding="utf-8") as f:
                registry = json.load(f)
                for item in registry:
                    if "filename" in item:
                        url_map[item["filename"].lower()] = item.get(
                            "source_url", "unknown"
                        )
        except Exception:
            pass

    # Aggregate counts from currently loaded vector store
    sources_summary = defaultdict(lambda: {"category": "general", "count": 0})
    if vector_store.is_loaded:
        for chunk in vector_store.chunks:
            s_name = chunk.source
            sources_summary[s_name]["category"] = chunk.category
            sources_summary[s_name]["count"] += 1

    source_items = []
    for name, data in sources_summary.items():
        source_items.append(
            SourceMetadata(
                name=name,
                category=data["category"],
                source_url=url_map.get(name.lower(), "unknown"),
                total_chunks=data["count"],
            )
        )

    # Sort alphabetically by source name
    source_items.sort(key=lambda s: s.name)

    return SourcesResponse(
        sources=source_items,
        total_documents=len(source_items),
    )
