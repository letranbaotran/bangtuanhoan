"""
CHEMVERSE 3.0 – FastAPI Scientific Research Backend
Run locally:
    uvicorn backend.main:app --reload --port 8000
OpenAPI docs:
    http://localhost:8000/docs
"""
from datetime import datetime, timezone
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ml.periodic_ml import cross_validate_5fold, extract_features, fit_ridge_pure, load_elements, predict_ridge_pure

app = FastAPI(
    title="CHEMVERSE 3.0 Scientific API",
    version="3.0.0",
    description="Backend API for IUPAC elements, quantum orbitals, molecules, ML prediction, anomaly detection & research experiments.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ELEMENTS = load_elements()
EXPERIMENTS_STORE: List[Dict] = []


class PredictRequest(BaseModel):
    target: str = Field("electronegativity", pattern="^(electronegativity|ionizationEnergy|atomicRadius)$")
    period: int = Field(..., ge=1, le=7)
    group: int = Field(..., ge=1, le=18)
    num_shells: int = Field(..., ge=1, le=7)
    number: int = Field(..., ge=1, le=118)
    valence_e: int = Field(..., ge=1, le=32)


class TrainRequest(BaseModel):
    target: str = Field("electronegativity", pattern="^(electronegativity|ionizationEnergy|atomicRadius)$")
    ridge_lambda: float = Field(0.1, ge=0.0, le=100.0)


class ExperimentRecord(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    hypothesis: str = Field(..., min_length=3)
    target: str
    algorithm: str
    metrics: Dict[str, float]
    notes: Optional[str] = ""


@app.get("/api/elements")
def get_elements(period: Optional[int] = None, category: Optional[str] = None):
    res = ELEMENTS
    if period is not None:
        res = [e for e in res if e["period"] == period]
    if category is not None:
        res = [e for e in res if e["category"] == category]
    return {"count": len(res), "elements": res}


@app.get("/api/orbitals")
def get_orbitals(n: int = 1, l: int = 0, m_l: int = 0):
    if n < 1 or n > 7 or l < 0 or l >= n or abs(m_l) > l:
        raise HTTPException(status_code=400, detail="Invalid quantum numbers: require n>=1, 0<=l<n, -l<=m_l<=l")
    letters = ["s", "p", "d", "f", "g", "h", "i"]
    return {
        "n": n, "l": l, "m_l": m_l,
        "subshell": f"{n}{letters[l]}",
        "energy_hydrogen_eV": round(-13.6 / (n * n), 4),
        "scientific_note": "Visual probability density |psi|^2; not a fixed classical orbit.",
    }


@app.get("/api/molecules")
def get_molecules():
    return {
        "molecules": [
            {"formula": "H2O", "geometry": "Bent", "bond_angle_deg": 104.5, "bond_length_pm": 95.8},
            {"formula": "CH4", "geometry": "Tetrahedral", "bond_angle_deg": 109.5, "bond_length_pm": 108.7},
            {"formula": "CO2", "geometry": "Linear", "bond_angle_deg": 180.0, "bond_length_pm": 116.3},
            {"formula": "BF3", "geometry": "Trigonal planar", "bond_angle_deg": 120.0, "bond_length_pm": 131.3},
            {"formula": "NH3", "geometry": "Trigonal pyramidal", "bond_angle_deg": 107.0, "bond_length_pm": 101.7},
        ]
    }


@app.post("/api/predict")
def predict_property(req: PredictRequest):
    valid = [e for e in ELEMENTS if isinstance(e.get(req.target), (int, float))]
    X = [extract_features(e) for e in valid]
    y = [float(e[req.target]) for e in valid]
    w = fit_ridge_pure(X, y, lam=0.1)
    feat = [float(req.period), float(req.group), float(req.num_shells), float(req.number) / 118.0, float(req.valence_e)]
    pred = predict_ridge_pure(w, [feat])[0]
    return {"target": req.target, "predicted_value": round(pred, 4), "model": "ridge_regression_v3"}


@app.post("/api/train")
@app.post("/api/analyze")
def train_and_analyze(req: TrainRequest):
    valid = [e for e in ELEMENTS if isinstance(e.get(req.target), (int, float))]
    return cross_validate_5fold(valid, req.target, lam=req.ridge_lambda)


@app.post("/api/anomaly")
def detect_anomalies(req: TrainRequest):
    valid = [e for e in ELEMENTS if isinstance(e.get(req.target), (int, float))]
    res = cross_validate_5fold(valid, req.target, lam=req.ridge_lambda)
    return {"target": req.target, "top_anomalies": res["top_anomalies"], "limitations": res["limitations"]}


@app.post("/api/experiment")
def save_experiment(exp: ExperimentRecord):
    rec = exp.model_dump()
    rec["id"] = f"exp-{len(EXPERIMENTS_STORE) + 1}"
    rec["timestamp"] = datetime.now(timezone.utc).isoformat()
    EXPERIMENTS_STORE.append(rec)
    return {"saved": True, "experiment": rec}


@app.get("/api/model-metrics")
def get_model_metrics():
    valid = [e for e in ELEMENTS if isinstance(e.get("electronegativity"), (int, float))]
    return {"electronegativity": cross_validate_5fold(valid, "electronegativity"), "experiments_count": len(EXPERIMENTS_STORE)}
