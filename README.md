# Municipal Public Service FAQ Chatbot Backend

A production-style, modular, testable, and grounded Retrieval-Augmented Generation (RAG) backend engineered for municipal and civic public service inquiries.

---

## 1. Project Objective

The **Municipal Public Service FAQ Chatbot** enables citizens to ask natural-language questions about civic and municipal services and receive accurate, strictly grounded answers backed by verified municipal documents.

Key supported municipal domains include:
* **Waste Collection & Sanitation**: Door-to-door schedules, segregation norms (wet/dry/sanitary), bulk collection, penalty rules.
* **Citizen Services & Civil Registration**: Birth and death certificate registration SOPs, timelines, required certificates.
* **Ward Information**: Ward boundaries, ward committee meetings, corporator and jurisdictional office contacts.
* **Property Tax**: Self Assessment Scheme (SAS) calculations, early payment rebates, online payment, Khata transfer/amalgamation.
* **Building Permits & Plan Sanctions**: Required documents, NOC requirements, scrutiny fees, approval timelines.
* **Trade Licenses**: Commercial/health/industrial trade classifications, mandatory documents, renewal procedures, fees.
* **Water & UGD Connections**: Domestic water supply applications, underground drainage connection steps, meter tariffs.
* **Public Helplines & Disaster Desk**: 24x7 control room numbers, flood emergency, fallen tree clearance, pothole complaints.
* **Public Events**: Town halls, ward committee meetings, vaccination camps, grievance redressal hearings.

---

## 2. System Architecture

The chatbot relies strictly on a Grounded Retrieval-Augmented Generation (RAG) architecture. No foundational LLM is trained or fine-tuned. The cloud LLM (Google Gemini) receives only verified context retrieved from municipal datasets.

### ASCII Architecture Diagram

```
                              [ Citizen Question ]
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │   FastAPI /api/chat Endpoint  │
                       │   (Length / Input Validation) │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │  Embedding Model (GTE-large)  │
                       │   Auto Dimension Detection    │
                       └───────────────┬───────────────┘
                                       │ (1024-dim Query Vector)
                                       ▼
                       ┌───────────────────────────────┐
                       │      FAISS Vector Store       │
                       │       (IndexFlatIP)           │
                       └───────────────┬───────────────┘
                                       │ Top-K Neighbor Chunks
                                       ▼
                       ┌───────────────────────────────┐
                       │       Relevance Filter        │
                       │ (Cosine Similarity Threshold) │
                       └───────┬───────────────┬───────┘
                               │               │
       Score < Threshold       │               │ Score >= Threshold
       (No municipal data)     │               │ (Relevant context found)
                               ▼               ▼
                ┌──────────────────┐    ┌───────────────────────────────┐
                │ Grounded Default │    │    Grounded Context Builder   │
                │ Fallback Answer  │    │     + 13 Strict System Rules  │
                └─────────┬────────┘    └──────────────┬────────────────┘
                          │                            │
                          │                            ▼
                          │             ┌───────────────────────────────┐
                          │             │   Google Gemini API Client    │
                          │             │    (gemini-2.5-flash / SDK)   │
                          │             └──────────────┬────────────────┘
                          │                            │
                          └────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │   Verified JSON Response      │
                       │ (Answer + Sources + Metadata) │
                       └───────────────────────────────┘
```

---

## 3. RAG Explanation

Retrieval-Augmented Generation (RAG) ensures that the generative model generates facts derived exclusively from local datasets:
1. **Offline Ingestion**: Municipal documents (`.pdf`, `.csv`, `.json`, `.txt`) are loaded, normalized, chunked (preserving tabular and record structures), embedded with GTE-large, and indexed into FAISS.
2. **Online Query Embedding**: When a citizen asks a question, GTE-large encodes the question into a high-dimensional vector.
3. **Similarity Search**: FAISS calculates inner-product (cosine similarity) against all indexed chunks.
4. **Relevance Gating**: If the top similarity score is below `SIMILARITY_THRESHOLD` (default: 0.65), the pipeline rejects the question early and returns:
   > *"I couldn't find enough information in the available municipal sources to answer that reliably."*
   Gemini is never invoked for out-of-scope or irrelevant queries, completely preventing hallucinations.
5. **Grounded Synthesis**: If relevant municipal context is retrieved, Gemini synthesizes a plain-language answer adhering to 13 strict grounding rules, returning source provenance (source filename, page number, row number, category).

---

## 4. Folder Structure

```
municipal-faq-chatbot/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Application package declaration
│   │   ├── main.py              # FastAPI application, CORS, lifespan, routing
│   │   ├── config.py            # Pydantic Settings (.env configuration)
│   │   │
│   │   ├── api/                 # API Route Controllers
│   │   │   ├── __init__.py
│   │   │   ├── chat.py          # POST /api/chat endpoint
│   │   │   ├── health.py        # GET /api/health endpoint
│   │   │   └── sources.py       # GET /api/sources catalog
│   │   │
│   │   ├── rag/                 # RAG Core Components
│   │   │   ├── __init__.py
│   │   │   ├── loader.py        # PDF, CSV, JSON, TXT multi-format loader
│   │   │   ├── chunker.py       # Structural & narrative chunker
│   │   │   ├── embeddings.py    # GTE-large SentenceTransformer singleton
│   │   │   ├── vector_store.py  # FAISS IndexFlatIP & metadata persistence
│   │   │   ├── retriever.py     # Similarity search & threshold filtering
│   │   │   ├── prompt.py        # Grounding rules & context assembly
│   │   │   └── pipeline.py      # End-to-end RAG orchestrator
│   │   │
│   │   ├── llm/                 # Model Provider Integrations
│   │   │   ├── __init__.py
│   │   │   └── gemini.py        # Official google-genai SDK client
│   │   │
│   │   ├── schemas/             # Pydantic Data Contracts
│   │   │   ├── __init__.py
│   │   │   └── chat.py          # Request, response, chunk, source schemas
│   │   │
│   │   └── utils/               # Shared Utilities
│   │       ├── __init__.py
│   │       ├── logging.py       # Structured logger
│   │       └── text.py          # Text normalization & ID hashing
│   │
│   └── tests/                   # Pytest Test Suite
│       ├── test_health.py       # Health and sources endpoints
│       ├── test_retrieval.py    # Loaders, chunkers, FAISS, retriever
│       └── test_chat.py         # Pipeline, grounding fallback, mocked LLM
│
├── data/
│   ├── raw/                     # Original Municipal Datasets
│   │   ├── wards/               # Ward details (.csv, .json)
│   │   ├── services/            # SOPs, citizen charters (.pdf, .txt)
│   │   ├── waste/               # Solid waste schedules (.txt, .pdf)
│   │   ├── property/            # Property tax FAQs (.json, .csv)
│   │   ├── trade_license/       # Trade rules (.pdf, .txt)
│   │   ├── emergency/           # Helpline directory (.csv, .json)
│   │   └── events/              # Public events (.json, .csv)
│   │
│   ├── processed/               # Intermediate artifacts (git-ignored)
│   └── sources.json             # Dataset provenance & URL registry
│
├── vector_store/
│   ├── index.faiss              # FAISS vector binary
│   └── metadata.json            # Chunk metadata registry
│
├── scripts/
│   ├── ingest.py                # Batch ingestion & vector store builder
│   ├── rebuild_index.py         # Safe index wipe & re-indexing
│   └── evaluate.py              # Accuracy & latency benchmarking
│
├── evaluation/
│   ├── questions.json           # Curated municipal evaluation questions
│   └── results.json             # Benchmark outputs and calculated rates
│
├── .env                         # Active environment configuration (git-ignored)
├── .env.example                 # Configuration template
├── .gitignore                   # Git exclusion rules
├── requirements.txt             # Locked project dependencies
└── README.md                    # Project documentation
```

---

## 5. Python Setup & Installation

### Prerequisites
* Python 3.12 or 3.13
* Windows PowerShell, macOS terminal, or Linux bash

### Virtual Environment Setup

1. Open terminal and navigate to the project directory:
   ```bash
   cd municipal-faq-chatbot
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   * **Windows PowerShell**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   * **Windows Command Prompt (cmd)**:
     ```cmd
     venv\Scripts\activate.bat
     ```
   * **Linux / macOS**:
     ```bash
     source venv/bin/activate
     ```

4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## 6. Environment Variables

Create `.env` from `.env.example`:
```bash
cp .env.example .env
```

Configure the following variables in `.env`:

| Variable | Description | Default |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key from Google AI Studio | *(Required for generation)* |
| `GEMINI_MODEL` | Cloud Gemini model name | `gemini-2.5-flash` |
| `EMBEDDING_MODEL` | HuggingFace embedding model ID | `thenlper/gte-large` |
| `VECTOR_STORE_PATH` | Directory for FAISS index and metadata | `vector_store` |
| `DATA_RAW_PATH` | Directory containing raw datasets | `data/raw` |
| `TOP_K` | Number of municipal chunks to retrieve | `5` |
| `SIMILARITY_THRESHOLD` | Minimum cosine similarity threshold | `0.65` |
| `CHUNK_SIZE` | Target chunk size in characters | `1000` |
| `CHUNK_OVERLAP` | Overlap between adjacent chunks | `150` |
| `DEBUG` | Include chunk contents in API responses | `false` |
| `HOST` | HTTP binding host | `0.0.0.0` |
| `PORT` | HTTP port | `8000` |

---

## 7. Dataset Placement

Place official municipal documents in the appropriate category folders under `data/raw/`:
* `data/raw/wards/`: Ward numbers, boundaries, councilors (`.csv`, `.json`).
* `data/raw/services/`: Birth/death registration, building permits, water connections (`.pdf`, `.txt`).
* `data/raw/waste/`: Door-to-door collection schedules, waste segregation (`.txt`, `.pdf`).
* `data/raw/property/`: Property tax rates, rebate schedules, Khata transfer (`.json`, `.csv`).
* `data/raw/trade_license/`: Trade categories, application SOPs, fee lists (`.pdf`, `.csv`).
* `data/raw/emergency/`: Control room phone numbers, disaster desks (`.csv`, `.json`).
* `data/raw/events/`: Ward committee dates, grievance redressal camps (`.json`, `.csv`).

Document source URLs and collection dates in `data/sources.json`.

---

## 8. Running Document Ingestion

To scan `data/raw/`, chunk documents, generate GTE-large embeddings, and build the FAISS index:

```bash
python scripts/ingest.py
```

Expected terminal output:
```
============================================================
Starting Municipal FAQ Dataset Ingestion
Source Directory: data/raw
Embedding Model : thenlper/gte-large
Target Store    : vector_store
============================================================

--- INGESTION REPORT ---
Documents loaded: 25
Documents failed: 0
Chunks created: 842
Embeddings created: 842
Vector index size: 842
Index saved successfully.
Total Ingestion Time: 14.32s
============================================================
```

### Rebuilding the Index
If datasets are modified or added, safely wipe and re-index using:
```bash
python scripts/rebuild_index.py
```
*(Use `--force` to bypass interactive confirmation)*.

---

## 9. Starting the FastAPI Server

Start the backend with Uvicorn:

```bash
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

The interactive Swagger documentation is available at:
`http://localhost:8000/docs`

---

## 10. API Endpoints

### 1. `GET /api/health`
Health check and readiness status.
* **Response**:
  ```json
  {
    "status": "ok",
    "gemini_configured": true,
    "vector_store_loaded": true,
    "embedding_model_loaded": true,
    "total_indexed_chunks": 842
  }
  ```

### 2. `GET /api/sources`
Catalog of indexed municipal documents and categories.
* **Response**:
  ```json
  {
    "sources": [
      {
        "name": "application_procedures.pdf",
        "category": "services",
        "source_url": "unknown",
        "total_chunks": 14
      }
    ],
    "total_documents": 1
  }
  ```

### 3. `POST /api/chat`
Ask a municipal service question.
* **Request**:
  ```json
  {
    "question": "What documents are required for a building license application?",
    "top_k": 5
  }
  ```
* **Response**:
  ```json
  {
    "answer": "A building license application requires: 1. Title deed / ownership document, 2. Sanctioned architectural drawing plan, 3. Up-to-date property tax receipt, and 4. Structural stability certificate.",
    "sources": [
      {
        "source": "application_procedures.pdf",
        "page": 4,
        "row": null,
        "category": "services",
        "source_url": "unknown"
      }
    ],
    "retrieved_chunks": [],
    "latency_ms": 1140.25,
    "grounded": true,
    "confidence": 0.8872
  }
  ```

---

## 11. Example Requests

### Using `curl` (Linux / macOS / PowerShell)
```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What documents are required for a building license?"}'
```

### Using PowerShell `Invoke-RestMethod`
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/chat" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"question": "What documents are required for a building license?"}'
```

---

## 12. Running Tests

Run the full automated test suite using `pytest`:

```bash
python -m pytest backend/tests -v
```

The test suite covers:
* API health & schema validation
* Multi-format loaders (PDF, CSV, JSON, TXT)
* Structured vs narrative chunking
* FAISS vector search & disk lifecycle
* Missing vector store 503 error handling
* Missing Gemini API key handling
* Grounded pipeline execution with mocked LLM
* Low-confidence / irrelevant query rejection

---

## 13. Running Evaluation Benchmarks

Run the evaluation script against benchmark questions in `evaluation/questions.json`:

```bash
python scripts/evaluate.py
```

The script evaluates:
* Retrieval success rate
* Source citation match rate
* Keyword coverage rate
* Composite accuracy percentage
* Retrieval latency in milliseconds

Outputs are automatically saved to `evaluation/results.json`.

---

## 14. How Hallucination is Prevented

1. **Similarity Gate**: Questions scoring below `SIMILARITY_THRESHOLD` are rejected before contacting Gemini.
2. **Strict Grounding Rules**: The system prompt instructs Gemini never to invent procedures, fees, dates, or contact numbers.
3. **No General World Knowledge**: General assumptions about municipal processes are forbidden; only context chunks may be used.
4. **Exact Provenance**: Sources and page/row numbers are extracted directly from retrieved metadata.

---

## 15. Multilingual Preparation

The architecture supports queries in Kannada, Hindi, and English:
* The embedding model (`thenlper/gte-large` or multilingual alternatives) maps cross-lingual semantic intents into the shared embedding space.
* Gemini is instructed to respond in the citizen's query language while remaining strictly anchored to the municipal context.
