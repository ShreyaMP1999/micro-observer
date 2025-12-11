import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import services, metrics, logs, alerts
from .simulators.generator import metrics_generator_loop

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Micro Observer API", version="0.1.0")

# CORS so frontend (Vite on 5173) can call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(services.router, prefix="/services", tags=["services"])
app.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
app.include_router(logs.router, prefix="/logs", tags=["logs"])
app.include_router(alerts.router, prefix="/alerts", tags=["alerts"])


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.on_event("startup")
async def startup_event():
    # Start background metrics generator
    asyncio.create_task(metrics_generator_loop())
