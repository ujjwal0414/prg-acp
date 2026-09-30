from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np

from app.research import run_experiment, run_ablation
import os
from dotenv import load_dotenv

# Loads a local .env file only during development
load_dotenv() 
 
app = FastAPI(
    title="PRG-ACP Thesis API",
    description="CPU-friendly research/demo API for adaptive conformal prediction.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExperimentRequest(BaseModel):
    dataset: str = "synthetic"
    method: str = "prg_acp"
    coverage: float = Field(0.90, ge=0.80, le=0.99)
    seed: int = 7


@app.get("/")
def root():
    return {"project": "PRG-ACP", "status": "running"}


@app.get("/api/health")
def health():
    return {"status": "ok", "compute": "CPU"}


@app.get("/api/datasets")
def datasets():
    return [
        {
            "id": "synthetic",
            "name": "Synthetic non-stationary benchmark",
            "description": "Abrupt shifts, gradual drift, recurring regimes and changing variance.",
        },
        {
            "id": "electricity",
            "name": "UCI ElectricityLoadDiagrams",
            "description": "Real electricity demand dataset to connect during the experiment phase.",
        },
        {
            "id": "m4",
            "name": "M4",
            "description": "Forecasting benchmark; use a small reproducible subset for CPU experiments.",
        },
    ]


@app.get("/api/methods")
def methods():
    return [
        {"id": "rolling", "name": "Rolling conformal"},
        {"id": "aci", "name": "Adaptive Conformal Inference"},
        {"id": "spci", "name": "SPCI-style baseline"},
        {"id": "cptc", "name": "CPTC-style change-aware baseline"},
        {"id": "kowcpi", "name": "KOWCPI-style weighting baseline"},
        {"id": "prg_acp", "name": "Proposed PRG-ACP"},
    ]


@app.post("/api/experiment")
def experiment(req: ExperimentRequest):
    return run_experiment(req.dataset, req.method, req.coverage, req.seed)


@app.get("/api/ablation")
def ablation(seed: int = 7):
    return run_ablation(seed)


@app.get("/api/literature")
def literature():
    return [
        {
            "title": "Adaptive Conformal Inference Under Distribution Shift",
            "authors": "Gibbs & Candès",
            "year": 2021,
            "venue": "NeurIPS / arXiv",
            "tag": "Foundation",
            "url": "https://arxiv.org/abs/2106.00170",
            "why": "Foundation for online adaptation of conformal miscoverage under distribution shift.",
        },
        {
            "title": "Ensemble Batch Prediction Intervals for Time Series",
            "authors": "Xu & Xie",
            "year": 2021,
            "venue": "ICML",
            "tag": "Baseline",
            "url": "https://proceedings.mlr.press/v139/xu21h.html",
            "why": "Important conformal-style baseline for temporal data.",
        },
        {
            "title": "Adaptive Conformal Predictions for Time Series",
            "authors": "Zaffran et al.",
            "year": 2022,
            "venue": "ICML",
            "tag": "Time series",
            "url": "https://proceedings.mlr.press/v162/zaffran22a.html",
            "why": "Core paper for adaptive conformal prediction in time series; introduces AgACI.",
        },
        {
            "title": "Conformal Prediction Interval for Dynamic Time Series",
            "authors": "Xu & Xie",
            "year": 2023,
            "venue": "ICML",
            "tag": "Baseline",
            "url": "https://proceedings.mlr.press/v202/xu23r.html",
            "why": "SPCI is a major non-exchangeable time-series baseline.",
        },
        {
            "title": "Conformal Inference for Online Prediction with Arbitrary Distribution Shifts",
            "authors": "Gibbs & Candès",
            "year": 2024,
            "venue": "JMLR",
            "tag": "Theory",
            "url": "https://jmlr.org/beta/papers/v25/22-1218.html",
            "why": "Develops online conformal adaptation under broad distribution shifts.",
        },
        {
            "title": "Conformal Prediction for Time-series Forecasting with Change Points",
            "authors": "Sun & Yu",
            "year": 2025,
            "venue": "NeurIPS",
            "tag": "Closest baseline",
            "url": "https://proceedings.neurips.cc/paper_files/paper/2025/hash/12271b64c483ad8f6192eb6aaa102044-Abstract-Conference.html",
            "why": "Directly addresses change-point-aware conformal forecasting; essential baseline.",
        },
        {
            "title": "Kernel-based Optimal Weighting for Conformal Prediction Intervals",
            "authors": "Lee, Xu & Xie",
            "year": 2025,
            "venue": "ICLR",
            "tag": "Closest baseline",
            "url": "https://proceedings.iclr.cc/paper_files/paper/2025/hash/058983528186511a74968e88a6d0ad63-Abstract-Conference.html",
            "why": "Shows that similarity/kernel weighting is already an active area.",
        },
        {
            "title": "Backtesting Conformal Prediction in Non-Stationary Time Series",
            "authors": "Retzlaff et al.",
            "year": 2025,
            "venue": "PMLR",
            "tag": "Evaluation",
            "url": "https://proceedings.mlr.press/v266/retzlaff25a.html",
            "why": "Useful for evaluating coverage behavior rather than relying only on average coverage.",
        },
        {
            "title": "ResCP",
            "authors": "ICLR 2026 authors",
            "year": 2026,
            "venue": "ICLR",
            "tag": "Recent",
            "url": "https://proceedings.iclr.cc/paper_files/paper/2026/hash/b0a978efeb20d33c15e31a5beee9f6df-Abstract-Conference.html",
            "why": "Uses similarity-weighted residuals; useful when positioning an interpretable geometric alternative.",
        },
        {
            "title": "Rolling-Origin Conformal Prediction for Time Series",
            "authors": "2026 authors",
            "year": 2026,
            "venue": "arXiv",
            "tag": "Recent",
            "url": "https://arxiv.org/abs/2605.08422",
            "why": "Studies recent-window calibration and theory under local stationarity.",
        },
        {
            "title": "Drift-Aware Spectral Conformal Prediction",
            "authors": "2026 authors",
            "year": 2026,
            "venue": "arXiv",
            "tag": "Recent",
            "url": "https://arxiv.org/abs/2606.15953",
            "why": "Important recent work combining drift, spectral similarity and adaptive calibration.",
        },
        {
            "title": "Bayesian Online Changepoint Detection",
            "authors": "Adams & MacKay",
            "year": 2007,
            "venue": "Technical report / arXiv",
            "tag": "Change point",
            "url": "https://arxiv.org/abs/0710.3742",
            "why": "Foundational probabilistic regime/change-point framework.",
        },
    ]
