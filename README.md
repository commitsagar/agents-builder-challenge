<div align="center">

# 🛍️ FlamGo — Agentic Retail & OmniCommerce Platform
### Built for the Google Cloud Agents Builder Challenge

[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Cloud%20Run%20%7C%20Firestore%20%7C%20BigQuery-4285F4?logo=google-cloud&logoColor=white)](https://cloud.google.com)
[![Google ADK](https://img.shields.io/badge/Google%20ADK-Agent%20Development%20Kit-34A853?logo=google&logoColor=white)](https://adk.dev)
[![Gemini](https://img.shields.io/badge/AI%20Model-Gemini%20Flash-EA4335?logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python%203.11-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<p align="center">
  <strong>An autonomous, multi-agent conversational commerce and reverse-logistics ecosystem transforming static retail catalogs and manual back-offices into intelligent, proactive agentic experiences.</strong>
</p>

[Live Demo](#live-demo) • [Key Capabilities](#key-capabilities) • [System Architecture](#system-architecture) • [Agent Hierarchy](#multi-agent-orchestration-google-adk) • [Getting Started](#getting-started) • [Deployment](#deployment-to-google-cloud)

</div>

---

## 📌 Executive Summary

Modern retail suffers from fragmented customer journeys: cart abandonment rates exceed 70%, returns processing costs up to $14/item with weeks of lag, and B2B RFQs take days of back-and-forth email negotiation.

**FlamGo** solves this by uniting **Gemini**, **Google Agent Development Kit (ADK)**, and **Google Cloud Serverless Architecture** into an end-to-end agentic retail platform. Whether it is an individual consumer shopping through conversational intent or a corporate enterprise procurement officer negotiating bulk contract pricing, FlamGo autonomously analyzes intent, inspects returns with Computer Vision, audits phantom inventory, and generates quotes in seconds.

---

## 🌟 Key Capabilities & Personas

FlamGo delivers purpose-built workflows tailored to both **B2C Consumer** and **B2B Enterprise** personas:

### 👤 B2C Persona: Alex Rivera (Everyday Shopper)
* **💬 Use Case 01 — Guided Selling & AI Shopping Concierge:**
  * Translates natural language and vague shopper desires (e.g., *"I need an ergonomic setup for hybrid work under $500"*) into curated product bundles with real-time reasoning traces.
* **📦 Use Case 02 — Automated Order Management, WISMO & Returns:**
  * Post-purchase resolution connecting Distributed Order Management Systems (DOMS) with Gemini Multimodal Vision AI for automated defect triage and instant label dispatch.
* **⚡ Use Case 03 — High-Converting Cart Recovery & Abandonment Nudges:**
  * Proactive outbound conversational recovery addressing specific purchase objections (pricing, sizing, warranty) rather than generic discount spam.
* **📍 Live GPS Tracking & Interactive Store Locator:**
  * Real-time package location tracking with courier speed, vehicle battery, route waypoints, and localized store stock lookup.
* **📹 Vision AI Live Optical Returns:**
  * Multimodal return inspection analyzing product condition, packaging damage, and serial numbers directly via uploaded imagery or device camera feeds.

---

### 🏢 B2B Persona: Elena Rostova (Procurement Director)
* **📑 Use Case 05 — B2B Procurement & Conversational RFQ Automation:**
  * Autonomous CPQ (Configure, Price, Quote) turning messy, unstructured RFQ emails and spreadsheets into binding quotes with dynamic tiered matrix pricing.
* **📊 BigQuery & Looker Embedded Analytics:**
  * Enterprise analytics dashboard monitoring order velocity, return rates by supplier, regional fulfillment heatmaps, and basket affinity.
* **📡 Inventory Radar & Phantom Stock Detection:**
  * Real-time anomaly detection identifying discrepant stock (on-shelf vs. system inventory) by cross-referencing Point-of-Sale velocities and shelf sensor telemetry.
* **📐 Planogram Compliance Vision:**
  * Computer vision compliance scanning verifying retail shelf placement against target planograms.

---

## 🏗️ System Architecture

```
                                  ┌─────────────────────────────┐
                                  │      Client Layer           │
                                  │  React 19 + TypeScript      │
                                  │  Vite + Glassmorphism UI    │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │  Google Cloud Run Gateway   │
                                  │  FastAPI REST Microservice  │
                                  └──────┬───────────────┬──────┘
                                         │               │
                 ┌───────────────────────┴──────┐        └───────────────────────┐
                 ▼                              ▼                                ▼
┌─────────────────────────────────┐ ┌───────────────────────┐ ┌──────────────────────────────────┐
│ Google ADK Orchestrator         │ │ Google Cloud Storage  │ │ Google BigQuery Analytics        │
│ Gemini Multi-Agent Core         │ │ Media, Optical Assets │ │ Temporal Fusion Transformer (TFT)│
│ • shopper_discovery_agent       │ │ Return Inspections    │ │ Looker Embedded BI Dashboards    │
│ • reverse_logistics_agent       │ └───────────────────────┘ └──────────────────────────────────┘
│ • demand_forecasting_agent      │
│ • inventory_radar_agent         │ ┌────────────────────────────────────────────────────────────┐
│ • b2b_rfq_copilot               │ │ Google Cloud Firestore (Firebase Native Mode)              │
└─────────────────────────────────┘ │ Operational State, Orders, Cart, Catalog, Customer Profiles│
                                    └────────────────────────────────────────────────────────────┘
```

---

## 🤖 Multi-Agent Orchestration (Google ADK)

FlamGo implements the **Google Agent Development Kit (ADK)** multi-agent routing pattern (`adk_agents/`):

| Agent Name | Primary Tool / Model | Responsibility |
| :--- | :--- | :--- |
| **`shopper_discovery_agent`** | Hybrid ScaNN Vector Search + BM25 | Semantic intent parsing, bundle generation, and inventory matching. |
| **`reverse_logistics_agent`** | Gemini Multimodal Vision Optical Inspector | Optical defect analysis, fraud prevention, and return RMA generation. |
| **`demand_forecasting_agent`** | BigQuery ML TFT (Temporal Fusion Transformer) | 14-day demand forecasting accounting for promotions and weather. |
| **`inventory_radar_agent`** | POS Velocity Anomaly Detector | Detecting shrink and phantom out-of-stocks across retail stores. |
| **`b2b_rfq_copilot`** | Conversational CPQ Dynamic Pricing Engine | Contract terms evaluation, volume discounting, and RFQ generation. |

```python
# Sample Google ADK Routing Pattern (adk_agents/agent.py)
from google.adk.agents import Agent
from tools import search_catalog_tool, inspect_return_optical_tool

def route_agent_intent(input_text: str):
    if "return" in input_text.lower():
        return reverse_logistics_agent.run(input_text)
    elif "forecast" in input_text.lower():
        return demand_forecasting_agent.run(input_text)
    else:
        return shopper_discovery_agent.run(input_text)
```

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 19 (Functional Components & Hooks)
- **Tooling:** Vite, TypeScript
- **Styling:** Modern Glassmorphism, CSS Custom Properties, Responsive Mobile/Desktop Grid
- **Icons & Visuals:** `lucide-react`, `canvas-confetti`
- **AI Client:** `@google/genai` (Gemini SDK)

### Backend & Cloud Services
- **Runtime:** Python 3.11, FastAPI, Uvicorn
- **Agent Framework:** Google Agent Development Kit (ADK)
- **Database:** Google Cloud Firestore (Native Mode)
- **Data Warehouse & ML:** Google BigQuery, BigQuery AI/ML
- **Search & Embeddings:** Vertex AI Search
- **Deployment:** Google Cloud Run (Containerized Microservice)
- **IaC & Tooling:** Docker, Terraform

---

## 📁 Repository Structure

```
agents-builder-challenge/
├── adk_agents/                # Google ADK Multi-Agent Architecture
│   ├── agent.py               # Root ADK Agent & Sub-Agent Orchestrator
│   ├── run_agent.py           # CLI runner & interactive ADK testbed
│   └── tools.py               # ADK Tool definitions (Vector search, Vision, TFT)
├── backend/                   # FastAPI Backend Microservices
│   └── main.py                # REST endpoints, Firestore hooks & Cloud Run router
├── database/                  # Schema specifications and data seeding
├── gcp/                       # Google Cloud SDK Integrations
│   ├── bigquery_analytics.py  # BigQuery dataset & forecasting queries
│   ├── firestore_db.py        # Cloud Firestore connection & collection seeding
│   ├── looker_embed.py        # Looker Embedded Dashboard tokens
│   └── vertex_search.py       # Vertex AI Search & Vector store interface
├── public/                    # Static assets, branding & icons
├── src/                       # React 19 Single Page Application
│   ├── components/            # UI Components & Modular Views
│   │   ├── ADKOrchestrator/   # Real-time multi-agent reasoning trace viewer
│   │   ├── AuthGateway/       # Persona switch gateway (Alex Rivera / Elena Rostova)
│   │   ├── BackOffice/        # Merchant operational control center
│   │   ├── ConversationalCommerce/ # Chat concierge, Cart Recovery & RFQ Copilot
│   │   ├── GpsLiveTracker/    # Live shipment GPS tracker & route maps
│   │   ├── LiveVideoReturn/   # Gemini Optical Vision Return Inspector
│   │   ├── LookerAnalytics/   # Embedded retail intelligence dashboard
│   │   ├── MerchantHub/       # Inventory, velocity, and stock management
│   │   ├── Navbar.tsx         # Responsive header & use-case navigation
│   │   └── Storefront/        # Interactive consumer shopping portal
│   ├── data/                  # Mock scenarios, initial catalogs & store locations
│   ├── services/              # Gemini API client & intent parsing services
│   ├── types/                 # TypeScript interfaces and domain schemas
│   ├── App.tsx                # Main application orchestrator
│   └── main.tsx               # Application bootstrap
├── Dockerfile                 # Multi-stage production container for Cloud Run
├── requirements.txt           # Python backend dependencies
├── package.json               # Frontend dependencies & NPM scripts
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **Python**: v3.11 or higher
* **Google Cloud SDK**: (`gcloud` CLI logged in) or a **Gemini API Key**

---

### 1. Clone the Repository
```bash
git clone https://github.com/commitsagar/agents-builder-challenge.git
cd agents-builder-challenge
```

---

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start the local Vite development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

### 3. Backend & ADK Setup
```bash
# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn backend.main:app --reload --port 8080
```

---

### 4. Running ADK Agents Locally
Test the multi-agent system directly via terminal:
```bash
python3 adk_agents/run_agent.py
```
Or start the ADK development web playground:
```bash
npm run adk:web
```

---

## ☁️ Deployment to Google Cloud

### Deploying to Google Cloud Run
This project includes a production-ready `Dockerfile` configured to serve the compiled React SPA alongside the FastAPI backend:

```bash
# Build the frontend
npm run build

# Build and deploy container to Cloud Run
gcloud builds submit --tag gcr.io/[PROJECT_ID]/flamgo-commerce:latest

gcloud run deploy flamgo-commerce \
  --image gcr.io/[PROJECT_ID]/flamgo-commerce:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GCP_PROJECT=[PROJECT_ID]
```

---

## 🛡️ Security & Privacy
* **Zero Hardcoded Secrets:** All API keys and credentials are fed via environment variables or Google Secret Manager.
* **Role-Based Access Control:** Distinct isolation between consumer B2C permissions and merchant B2B procurement controls.
* **CORS Protection:** Configured API gateway middleware ensuring verified origin routing.

---

## 🏆 Challenge Verification Checklist
- [x] **Conversational AI:** Real-time intent extraction with Gemini.
- [x] **Multi-Agent Orchestration:** Google ADK architecture with specialized task sub-agents.
- [x] **Multimodal Vision:** Live video/photo optical defect analysis for reverse logistics.
- [x] **Enterprise B2B CPQ:** Automated RFQ processing and volume pricing matrix generation.
- [x] **Google Cloud Native:** Firestore, BigQuery, Vertex AI, and Cloud Run integration.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.