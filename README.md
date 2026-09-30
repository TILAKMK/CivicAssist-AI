# 🏛 CivicAssist AI

> **"Your city. Your questions. One intelligent assistant."**  
> AI-Powered Mysuru Municipal Public Service Information Assistant for Mysuru City Corporation (MCC).

---

## 🌟 Overview

**CivicAssist AI** allows citizens to ask natural-language questions about Mysuru City Corporation (MCC) services and receive concise, context-aware, source-backed answers.

### 🏛 Actual Knowledge Domains Covered
1. **MCC Wards & Demographics**: 65 municipal wards, 9 administrative zonal offices, street listings, population, corporator contact structures, and interactive Leaflet GIS boundaries.
2. **Municipal Services**: Building plan licenses, commercial trade licenses, property registration, mutation (Khata transfer), property amalgamation, vital statistics (birth & death modifications), potable water tap connections, and underground drainage (UGD) connections under Karnataka Sakala guaranteed timelines.
3. **Property Tax (SAS)**: Self-Assessment Scheme guidelines, 15-digit PID structure, public assessment search concepts, and online payment procedures without exposing private records.
4. **Trade Licenses**: Commercial establishment schedules, trade classification (Green/Orange/Red), inspection norms, and statutory NOCs (Fire, Pollution, Health).
5. **Solid Waste Management**: 3-bin source segregation (Green/Blue/Red), door-to-door auto-tipper collection protocols, Zero Waste Management (ZWM) plants, and clean city bylaws.
6. **24/7 Helplines & Emergency**: Police (100/112), Fire (101), Ambulance (108), Women Helpline (1091), Childline (1098), DC Office (1077), MCC Central Control Room (0821-2418800), CESC (1912), and Vani Vilas Water Works.

---

## 🏗 System Architecture

```
Citizen
   ↓
Natural Language Query
   ↓
Conversation Context & Multi-Turn Retention
   ↓
Query Understanding
   ↓
RAG Retrieval (Mysuru Municipal Knowledge Base)
   ↓
Relevant Statutory Source Documents
   ↓
Gemini API / Grounded LLM
   ↓
Structured Answer + Exact Source Attribution
   ↓
Citizen
```

---

## ✨ Key Features

- **Multi-Turn Context Retention**: Detects conversational continuations (e.g. asking *"What about the fees?"* after a building license query displays `↳ Continuing from: Building License`).
- **Deterministic RAG Grounding**: Responses are grounded in official MCC citizen charters and user manuals with transparent `[ View Source ]` inspection.
- **Safe Fallback**: Out-of-scope or unverified queries trigger a clean fallback rather than hallucinating government policies.
- **Interactive Ward GIS Map**: Visual exploration of Mysuru's 65 wards with coordinate markers and localized civic contact cards.
- **Civic Design System**: Polished civic blue / deep navy / teal visual identity with full responsive support across desktop and mobile.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📄 License
MIT License • Built for Mysuru City Corporation Civic Public Service
