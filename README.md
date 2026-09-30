# PRG-ACP Thesis Web App

Professor-first research website for:
Probabilistic Regime- and Geometry-Aware Adaptive Conformal Prediction for Non-Stationary Time-Series Forecasting.

Stack:
- React + Vite
- Tailwind CSS
- FastAPI + Python
- NumPy
- Recharts
- CPU-only

## Run backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Run frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

Backend API docs: http://localhost:8000/docs

## Important research note

The included backend is a runnable research scaffold/demo. It uses a controlled synthetic benchmark and a lightweight proxy for regime probabilities so the website works immediately.

Before presenting scientific results, replace the demo components with the validated implementations from your experiments and report actual results.

The four proposed contributions represented in the UI are:
1. probabilistic regime weighting;
2. regime-conditioned local geometry;
3. entropy-controlled locality;
4. effective-sample-size reliability control.
