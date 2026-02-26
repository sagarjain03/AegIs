"""
Phase-4 – Anomaly Model Training Script
Generates realistic synthetic normal sessions (based on Phase-3 distributions)
and trains an Isolation Forest anomaly detector.

Run:
    cd ml_service
    python -m app.training.train_anomaly
"""

import os
import sys
import logging
import numpy as np

# Ensure app package is importable when running as script
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from app.preprocessing.feature_extractor import SESSION_FEATURE_NAMES, FEATURE_COUNT
from app.inference.anomaly_model import AnomalyDetector

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
logger = logging.getLogger("train_anomaly")


def generate_normal_sessions(n_sessions: int = 200) -> np.ndarray:
    """
    Generate realistic synthetic 'normal' session feature vectors.

    Distributions are based on expected real-world Phase-3 behavior:
    - Low injection scores (typical safe users)
    - Moderate prompt counts
    - Normal request frequencies
    - Low blocked ratios
    - Minimal tool violations

    Each session is a 10-feature vector matching SESSION_FEATURE_NAMES order.
    """
    rng = np.random.RandomState(42)

    sessions = []
    for _ in range(n_sessions):
        # total_prompts: 1–15 (most users ask 3–8 questions)
        total_prompts = rng.randint(1, 16)

        # avg_injection_score: low for normal users (0.01 – 0.25)
        avg_injection = rng.uniform(0.01, 0.25)

        # max_injection_score: slightly higher (avg + noise)
        max_injection = min(avg_injection + rng.uniform(0.0, 0.15), 0.45)

        # prompt_frequency: 0.3 – 3.0 prompts/min (normal pace)
        prompt_frequency = rng.uniform(0.3, 3.0)

        # blocked_ratio: very low for normal users (0 – 0.1)
        blocked_ratio = rng.uniform(0.0, 0.1)

        # tool_violation_count: 0 for most normal sessions
        tool_violations = float(rng.choice([0, 0, 0, 0, 1], p=[0.7, 0.1, 0.05, 0.05, 0.1]))

        # similarity_mean: low-to-moderate (diverse questions)
        similarity_mean = rng.uniform(0.1, 0.55)

        # time_gap_variance: moderate (humans have irregular pacing)
        time_gap_var = rng.uniform(0.5, 30.0)

        # severity_slope: near zero for normal sessions
        severity_slope = rng.uniform(-0.05, 0.1)

        # session_duration_minutes: 1–15 minutes
        session_duration = rng.uniform(1.0, 15.0)

        sessions.append([
            total_prompts,
            avg_injection,
            max_injection,
            prompt_frequency,
            blocked_ratio,
            tool_violations,
            similarity_mean,
            time_gap_var,
            severity_slope,
            session_duration,
        ])

    data = np.array(sessions, dtype=np.float64)
    logger.info(f"Generated {n_sessions} synthetic normal sessions, shape={data.shape}")
    return data


def main():
    print("=" * 60)
    print("AegisAI Phase-4 – Anomaly Model Training")
    print("=" * 60)

    # 1. Generate training data
    print("\n[1/3] Generating synthetic normal sessions...")
    training_data = generate_normal_sessions(n_sessions=200)

    print(f"\nFeature names ({FEATURE_COUNT}):")
    for i, name in enumerate(SESSION_FEATURE_NAMES):
        col = training_data[:, i]
        print(f"  {i}: {name:30s} | min={col.min():.4f} max={col.max():.4f} mean={col.mean():.4f}")

    # 2. Train model
    print("\n[2/3] Training Isolation Forest...")
    detector = AnomalyDetector()
    meta = detector.train(training_data)
    print(f"Training complete: {meta}")

    # 3. Save model
    model_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models"
    )
    model_path = os.path.join(model_dir, "anomaly_model.pkl")
    print(f"\n[3/3] Saving model to {model_path}...")
    detector.save_model(model_path)

    # 4. Validation
    print("\n" + "=" * 60)
    print("Validation – Testing with sample vectors")
    print("=" * 60)

    # Normal session
    normal = np.array([5.0, 0.1, 0.15, 1.5, 0.0, 0.0, 0.3, 5.0, 0.02, 5.0])
    score_normal = detector.predict(normal)
    print(f"\nNormal session  → anomaly_score = {score_normal:.4f}  (expected: LOW)")

    # Suspicious session (probing)
    probing = np.array([12.0, 0.65, 0.92, 8.0, 0.5, 2.0, 0.88, 0.5, 0.7, 3.0])
    score_probing = detector.predict(probing)
    print(f"Probing session → anomaly_score = {score_probing:.4f}  (expected: HIGH)")

    # Moderately suspicious
    moderate = np.array([7.0, 0.35, 0.55, 4.0, 0.2, 1.0, 0.6, 2.0, 0.25, 8.0])
    score_moderate = detector.predict(moderate)
    print(f"Moderate session → anomaly_score = {score_moderate:.4f}  (expected: MEDIUM)")

    print("\n✅ Anomaly model training complete.\n")


if __name__ == "__main__":
    main()
