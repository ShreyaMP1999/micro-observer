# micro-observer 🛰️

LIVE LINK: https://micro-observer.vercel.app/dashboard

A mini **Datadog-style system monitor dashboard** built with **React + TypeScript + FastAPI + SQLite**.

It simulates a small fleet of microservices and visualizes:

- Live CPU & memory usage
- Request and error rates
- Service health and uptime
- Logs
- Alerts with acknowledge actions

Perfect for showcasing **DevOps awareness**, **backend + frontend skills**, and **observability concepts**.

---

## 🧱 Architecture

**Monorepo layout:**

- `backend/` – FastAPI service
- `frontend/` – React + TypeScript (Vite)

### Backend (FastAPI)

- `FastAPI` app with:
  - `/services` – list services & overall summary
  - `/metrics/{service_id}` – recent metric samples
  - `/logs/{service_id}` – recent logs
  - `/alerts`, `/alerts/recent` – alerts
  - `/alerts/{id}/acknowledge` – mark alert as acknowledged

- Background simulator:
  - Periodically generates synthetic metrics for services:
    - `auth-service`
    - `payments-service`
    - `notifications-service`
    - `analytics-service`
  - Inserts:
    - CPU / memory / request rate / error rate
    - Info / warn / error logs
    - Alerts when thresholds are breached

- Persistence:
  - `SQLite` via `SQLAlchemy` models:
    - `Service`
    - `MetricSample`
    - `Log`
    - `Alert`

> In a real-world system, this could evolve into a pipeline using Kafka, Prometheus, TimescaleDB, etc.

### Frontend (React + TS)

- Built with **Vite + React + TypeScript**
- Uses **Axios** for API calls
- Uses **Recharts** for CPU/memory timeline chart
- Uses **React Router** for navigation

**Pages:**

- **Dashboard**
  - Overview cards: total services, healthy, degraded, down, open alerts
  - Search + status filters
  - Service table (status, owner, uptime, last heartbeat)
  - Recent alerts sidebar

- **Service Detail**
  - Service header (status, owner, uptime, last heartbeat)
  - Current metrics: CPU, memory, req/sec, errors/min
  - CPU & memory chart over time (Recharts)
  - Recent logs

- **Alerts**
  - Filter: all vs open only
  - List of alerts with severity badges
  - **Acknowledge** button to resolve alerts

- **Settings**
  - Placeholder for configuring thresholds, notification channels, etc.

---

## 🚀 Getting Started

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload

Backend runs at: http://localhost:8000
Docs at: http://localhost:8000/docs

### 2. Frontend
cd frontend
npm install
npm install recharts
npm run dev
Frontend runs at: http://localhost:5173

