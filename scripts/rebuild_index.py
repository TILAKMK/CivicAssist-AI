"""Rebuild script: safely deletes existing index files and triggers full re-ingestion."""

import argparse
import sys
import shutil
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.config import get_settings
from scripts.ingest import run_ingestion


def rebuild_index(force: bool = False):
    settings = get_settings()
    index_file = settings.faiss_index_path
    meta_file = settings.metadata_path

    print("=" * 60)
    print("MUNICIPAL VECTOR STORE REBUILD")
    print(f"Index target   : {index_file}")
    print(f"Metadata target: {meta_file}")
    print("=" * 60)

    existing_files = [f for f in [index_file, meta_file] if f.exists()]

    if existing_files:
        print(f"\n[WARNING] Found {len(existing_files)} existing vector store artifact(s):")
        for f in existing_files:
            print(f"  - {f}")

        if not force:
            confirm = input(
                "\nAre you sure you want to delete and rebuild the vector store? [y/N]: "
            )
            if confirm.strip().lower() not in {"y", "yes"}:
                print("Operation aborted by user.")
                return

        # Create safety backup
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        backup_dir = settings.vector_store_dir / f"backup_{timestamp}"
        backup_dir.mkdir(parents=True, exist_ok=True)

        for f in existing_files:
            dest = backup_dir / f.name
            shutil.copy2(f, dest)
            f.unlink()
            print(f"Archived and removed: {f.name} -> {dest}")

        print(f"Backup preserved in: {backup_dir}")

    print("\nTriggering full ingestion from raw datasets...")
    run_ingestion()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Safely delete and rebuild the FAISS municipal vector store."
    )
    parser.add_argument(
        "--force",
        "-f",
        action="store_true",
        help="Bypass interactive confirmation prompt.",
    )
    args = parser.parse_args()
    rebuild_index(force=args.force)
