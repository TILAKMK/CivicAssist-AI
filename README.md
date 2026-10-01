# CivicAssist AI

CivicAssist AI is a grounded municipal-services assistant for Mysuru. Citizens can ask questions about public services, wards, property tax, trade licenses, waste management, emergency contacts, and other civic information.

The project includes:

- A React and Vite web interface
- A FastAPI backend
- Retrieval-Augmented Generation (RAG) over local municipal data
- FAISS vector search and source citations
- Groq and Gemini generation providers
- A safe fallback when the available sources do not support an answer

## Project Structure

```text
TCS-public-service-FAQ/
├── backend/       FastAPI application, RAG pipeline, and tests
├── data/raw/      Municipal source documents and datasets
├── evaluation/    Evaluation questions and results
├── scripts/       Ingestion, index rebuild, and evaluation scripts
├── src/           React frontend
├── vector_store/  Local FAISS index files
├── .env.example   Environment variable template
└── package.json   Frontend scripts and dependencies
```

## Requirements

- Python 3.10+
- Node.js 18+
- API key for Groq or Gemini if using cloud answer generation

## Setup

### Backend

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```


### Frontend

```powershell
npm install
```

The frontend uses `/api` by default. For local development, set the backend URL when Vite is not proxying requests:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Run Locally

Start the backend from the project root:

```powershell
python -m uvicorn backend.app.main:app --reload --port 8000
```

In a second terminal, start the frontend:

```powershell
npm run dev
```

Open the URL printed by Vite. The backend API documentation is available at `http://127.0.0.1:8000/docs`.

## Data and Indexing

Place trusted municipal documents in the relevant `data/raw/` category. Then build or rebuild the local retrieval index:

```powershell
python scripts/ingest.py
python scripts/rebuild_index.py
```

Generated processed data and vector index files are local artifacts and are ignored by Git. The application can start without an index, but retrieval requires a completed ingestion step.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check backend and index status |
| `GET` | `/api/sources` | List indexed source documents |
| `POST` | `/api/chat` | Ask a grounded municipal-services question |

Example request:

```powershell
Invoke-RestMethod `
  -Uri "http://127.0.0.1:8000/api/chat" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"question":"How do I pay property tax?"}'
```

## Configuration

The main settings are loaded from `.env`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `GROQ_API_KEY` | empty | Groq generation key |
| `GROQ_MODEL` | `qwen/qwen3.8-27b` | Groq model |
| `GEMINI_API_KEY` | empty | Gemini generation key |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Gemini model |
| `EMBEDDING_MODEL` | `thenlper/gte-large` | Embedding model |
| `TOP_K` | `5` | Number of retrieved chunks |
| `SIMILARITY_THRESHOLD` | `0.65` | Minimum relevance score |
| `HOST` | `0.0.0.0` | Backend host |
| `PORT` | `8000` | Backend port |

## Tests and Build

```powershell
python -m pytest -q
npm run build
```

## License and Sources

Use only trusted, permitted municipal sources in `data/raw/`. Review source provenance in `data/sources.json` before publishing answers or datasets.
