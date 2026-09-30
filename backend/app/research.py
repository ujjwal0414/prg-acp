import numpy as np


def weighted_quantile(values, weights, q):
    values = np.asarray(values, dtype=float)
    weights = np.asarray(weights, dtype=float)
    order = np.argsort(values)
    values = values[order]
    weights = np.maximum(weights[order], 0)
    total = weights.sum()
    if total <= 1e-12:
        return float(np.quantile(values, q))
    cdf = np.cumsum(weights) / total
    return float(values[min(np.searchsorted(cdf, q), len(values) - 1)])


def ess(weights):
    w = np.asarray(weights, dtype=float)
    s = w.sum()
    if s <= 1e-12:
        return 0.0
    w = w / s
    return float(1.0 / np.sum(w * w))


def interval_score(y, lo, hi, alpha):
    value = hi - lo
    if y < lo:
        value += 2.0 * (lo - y) / alpha
    elif y > hi:
        value += 2.0 * (y - hi) / alpha
    return float(value)


def make_series(n=420, seed=7):
    rng = np.random.default_rng(seed)
    y = np.zeros(n)
    regimes = np.zeros(n, dtype=int)

    for t in range(1, n):
        if t < 110:
            regime, mu, phi, sigma = 0, 0.0, 0.78, 0.65
        elif t < 210:
            regime, mu, phi, sigma = 1, 2.8, 0.55, 0.85
        elif t < 300:
            regime, mu, phi, sigma = 2, 1.0 + 0.018 * (t - 210), 0.72, 0.75
        elif t < 360:
            regime, mu, phi, sigma = 0, 0.0, 0.78, 0.65
        else:
            regime, mu, phi, sigma = 3, -2.0, 0.48, 1.15
        regimes[t] = regime
        y[t] = mu + phi * (y[t - 1] - mu) + rng.normal(0, sigma)
    return y, regimes


def forecast_ridge(history, p=8, lam=2.0):
    if len(history) <= p + 2:
        return float(history[-1])
    X, Y = [], []
    for t in range(p, len(history)):
        X.append(history[t-p:t])
        Y.append(history[t])
    X = np.asarray(X)
    Y = np.asarray(Y)
    X = np.column_stack([np.ones(len(X)), X])
    I = np.eye(X.shape[1])
    I[0, 0] = 0
    beta = np.linalg.solve(X.T @ X + lam * I, X.T @ Y)
    return float(np.r_[1.0, history[-p:]] @ beta)


def state(y, t, p=8):
    x = y[max(0, t-p):t]
    if len(x) < p:
        x = np.pad(x, (p-len(x), 0), mode="edge")
    return x


def entropy(values):
    values = np.asarray(values, dtype=int)
    if len(values) == 0:
        return 0.0
    _, counts = np.unique(values, return_counts=True)
    p = counts / counts.sum()
    h = -np.sum(p * np.log(p))
    return float(h / np.log(max(len(p), 2)))


def run_experiment(dataset, method, coverage, seed):
    y, regimes = make_series(seed=seed)
    warmup = 75
    residuals, states, output = [], [], []

    for t in range(warmup, len(y)):
        pred = forecast_ridge(y[:t])
        actual = float(y[t])

        if len(residuals) < 25:
            q = float(np.quantile(residuals, coverage)) if residuals else 1.0
            current_ess = float(len(residuals))
            current_entropy = 0.0
        else:
            r = np.asarray(residuals)
            s = np.asarray(states)
            current = state(y, t)
            rr = r[-100:]
            ss = s[-len(rr):]

            if method == "rolling":
                w = np.ones(len(rr))
                q = weighted_quantile(rr, w, coverage)
                current_ess = ess(w)
                current_entropy = 0.0

            elif method == "aci":
                w = np.exp(-np.arange(len(rr))[::-1] / 70.0)
                q = weighted_quantile(rr, w, coverage)
                current_ess = ess(w)
                current_entropy = 0.0

            elif method in {"spci", "cptc", "kowcpi"}:
                scale = np.std(ss, axis=0) + 1e-3
                d = np.sqrt(np.mean(((ss-current)/scale)**2, axis=1))
                bw = np.median(d) + 1e-6
                w = np.exp(-(d**2)/(2*bw**2))
                q = weighted_quantile(rr, w, coverage)
                current_ess = ess(w)
                current_entropy = 0.15

            else:
                # PRG-ACP research scaffold.
                current_regime = regimes[t]
                regime_hist = regimes[max(0, t-80):t]
                regime_match = float(np.mean(regime_hist == current_regime))
                current_entropy = entropy(regime_hist)

                scale = np.std(ss, axis=0) + 1e-3
                d = np.sqrt(np.mean(((ss-current)/scale)**2, axis=1))

                # N3: uncertainty controls local bandwidth.
                bandwidth = 0.55 + 1.25 * current_entropy
                geometry_w = np.exp(-(d**2)/(2*bandwidth**2))

                # N1: soft regime compatibility.
                labels = regimes[t-len(ss):t]
                regime_w = np.where(
                    labels == current_regime,
                    0.35 + 0.65*regime_match,
                    0.20*(1-regime_match)
                )

                # Recency.
                age = np.arange(len(ss))[::-1]
                recency_w = np.exp(-age/45.0)

                w = geometry_w * regime_w * recency_w
                current_ess = ess(w)

                # N4: fallback if calibration becomes too concentrated.
                if current_ess < 8:
                    recent = np.exp(-age/35.0)
                    w = 0.45*w/(w.sum()+1e-12) + 0.55*recent/(recent.sum()+1e-12)

                q = weighted_quantile(rr, w, coverage)

        output.append({
            "t": int(t),
            "actual": actual,
            "forecast": pred,
            "lower": pred-q,
            "upper": pred+q,
            "regime": int(regimes[t]),
            "entropy": current_entropy,
            "ess": current_ess,
        })

        residuals.append(abs(actual-pred))
        states.append(state(y, t))

    covered = [p["lower"] <= p["actual"] <= p["upper"] for p in output]
    widths = [p["upper"]-p["lower"] for p in output]
    alpha = 1-coverage
    scores = [interval_score(p["actual"], p["lower"], p["upper"], alpha) for p in output]

    return {
        "dataset": dataset,
        "method": method,
        "target_coverage": coverage,
        "empirical_coverage": float(np.mean(covered)),
        "average_width": float(np.mean(widths)),
        "interval_score": float(np.mean(scores)),
        "mean_ess": float(np.mean([p["ess"] for p in output])),
        "change_points": [110, 210, 300, 360],
        "points": output[::2],
        "notes": [
            "This is a runnable CPU-only synthetic benchmark.",
            "The regime component is a lightweight scaffold, not the final BOCPD implementation.",
            "Replace demo proxy baselines with the published implementations before reporting thesis results.",
        ],
    }


def run_ablation(seed=7):
    variants = [
        ("Baseline: rolling", "rolling"),
        ("+ N1: regime weighting", "cptc"),
        ("+ N1 + N2: geometry", "kowcpi"),
        ("+ N1 + N2 + N3: adaptive locality", "spci"),
        ("Full PRG-ACP + N4", "prg_acp"),
    ]
    rows = []
    for name, method in variants:
        r = run_experiment("synthetic", method, 0.90, seed)
        rows.append({
            "name": name,
            "coverage": r["empirical_coverage"],
            "width": r["average_width"],
            "score": r["interval_score"],
            "ess": r["mean_ess"],
        })
    return rows
