"""
CHEMVERSE – AI Periodic Prediction (Python Verification Script)
Trains a Ridge Linear Regression model on 80% of IUPAC elements and evaluates
MAE, RMSE, and R^2 on the held-out 20% test set.
"""
import json
import math
import re
from pathlib import Path


def load_elements():
    src = Path(__file__).resolve().parent.parent / "data" / "elements.js"
    text = src.read_text(encoding="utf-8")
    m = re.search(r"window\.CHEMVERSE\.ELEMENTS\s*=\s*(\[.*\]);", text, re.S)
    if not m:
        raise RuntimeError("Could not parse ELEMENTS array from data/elements.js")
    return json.loads(m.group(1))


def evaluate(target="electronegativity"):
    elements = [e for e in load_elements() if isinstance(e.get(target), (int, float))]
    train, test = [], []
    for i, el in enumerate(elements):
        (test if i % 5 == 4 else train).append(el)

    def feat(e):
        shells = e.get("shells") or [1]
        return [1.0, float(e["period"]), float(e["group"]), float(len(shells)), float(e["number"]) / 118.0, float(shells[-1])]

    X_tr = [feat(e) for e in train]
    y_tr = [float(e[target]) for e in train]
    d = len(X_tr[0])
    A = [[0.0] * (d + 1) for _ in range(d)]
    for x, y in zip(X_tr, y_tr):
        for j in range(d):
            for k in range(d):
                A[j][k] += x[j] * x[k]
            A[j][d] += x[j] * y
    for j in range(1, d):
        A[j][j] += 0.1
    for col in range(d):
        piv = max(range(col, d), key=lambda r: abs(A[r][col]))
        A[col], A[piv] = A[piv], A[col]
        div = A[col][col] or 1e-9
        for k in range(col, d + 1):
            A[col][k] /= div
        for r in range(d):
            if r != col:
                f = A[r][col]
                for k in range(col, d + 1):
                    A[r][k] -= f * A[col][k]
    w = [row[d] for row in A]

    preds = [sum(wi * xi for wi, xi in zip(w, feat(e))) for e in test]
    actuals = [float(e[target]) for e in test]
    n = len(test)
    mae = sum(abs(p - a) for p, a in zip(preds, actuals)) / n
    rmse = math.sqrt(sum((p - a) ** 2 for p, a in zip(preds, actuals)) / n)
    mean_y = sum(actuals) / n
    ss_tot = sum((a - mean_y) ** 2 for a in actuals) or 1.0
    ss_res = sum((a - p) ** 2 for a, p in zip(actuals, preds))
    r2 = 1.0 - ss_res / ss_tot
    print(f"[{target}] Train={len(train)}, Test={n} | MAE={mae:.3f}, RMSE={rmse:.3f}, R2={r2:.3f}")


if __name__ == "__main__":
    for prop in ("electronegativity", "ionizationEnergy", "atomicRadius"):
        evaluate(prop)
