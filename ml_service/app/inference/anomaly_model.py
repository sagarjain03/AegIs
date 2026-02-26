"""
Phase-4 – Anomaly Detector (Isolation Forest)
Unsupervised anomaly detection on session behavioral feature vectors.
Includes StandardScaler normalization bundled with the model.
"""

import os
import logging
from typing import Optional

import numpy as np
import joblib
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

from app.inference.threshold_config import (
    ANOMALY_CONTAMINATION_RATE,
    ANOMALY_N_ESTIMATORS,
    ANOMALY_DECISION_THRESHOLD,
)

logger = logging.getLogger("ml_service.anomaly_model")

# Default model path
_DEFAULT_MODEL_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models"
)
_DEFAULT_MODEL_PATH = os.path.join(_DEFAULT_MODEL_DIR, "anomaly_model.pkl")


class AnomalyDetector:
    """
    Isolation Forest–based anomaly detector for session feature vectors.

    Bundles a StandardScaler (fit during training) to normalize features
    before feeding into the Isolation Forest, preventing magnitude imbalance.
    """

    def __init__(self):
        self._model: Optional[IsolationForest] = None
        self._scaler: Optional[StandardScaler] = None
        self._is_trained = False

    @property
    def is_loaded(self) -> bool:
        return self._is_trained and self._model is not None

    # ─── Training ───────────────────────────────────────────────
    def train(self, feature_vectors: np.ndarray) -> dict:
        """
        Train Isolation Forest on normal session feature vectors.

        Args:
            feature_vectors: np.ndarray of shape (n_sessions, n_features)

        Returns:
            dict with training metadata
        """
        if feature_vectors.ndim != 2 or feature_vectors.shape[0] < 5:
            raise ValueError(
                f"Need at least 5 sessions with 2D array. "
                f"Got shape: {feature_vectors.shape}"
            )

        # Fit StandardScaler first
        self._scaler = StandardScaler()
        scaled = self._scaler.fit_transform(feature_vectors)

        # Train Isolation Forest
        self._model = IsolationForest(
            contamination=ANOMALY_CONTAMINATION_RATE,
            n_estimators=ANOMALY_N_ESTIMATORS,
            random_state=42,
            n_jobs=-1,
        )
        self._model.fit(scaled)
        self._is_trained = True

        logger.info(
            f"AnomalyDetector trained | samples={feature_vectors.shape[0]}, "
            f"features={feature_vectors.shape[1]}, "
            f"contamination={ANOMALY_CONTAMINATION_RATE}, "
            f"estimators={ANOMALY_N_ESTIMATORS}"
        )

        return {
            "samples": feature_vectors.shape[0],
            "features": feature_vectors.shape[1],
            "contamination": ANOMALY_CONTAMINATION_RATE,
        }

    # ─── Prediction ─────────────────────────────────────────────
    def predict(self, feature_vector: np.ndarray) -> float:
        """
        Predict anomaly score for a single session feature vector.

        Uses the raw decision function score with configurable threshold
        for calibrated anomaly detection.

        Returns:
            float in [0.0, 1.0] where 1.0 = highly anomalous
        """
        if not self.is_loaded:
            logger.warning(
                "AnomalyDetector not trained/loaded. Returning 0.5 (uncertain)."
            )
            return 0.5

        try:
            # Reshape for single sample
            if feature_vector.ndim == 1:
                feature_vector = feature_vector.reshape(1, -1)

            # Scale using the same scaler from training
            scaled = self._scaler.transform(feature_vector)

            # Raw decision score (lower = more anomalous)
            raw_score = float(self._model.decision_function(scaled)[0])

            # Convert to 0-1 anomaly score with calibrated threshold
            # decision_function returns negative for anomalies
            # We use a sigmoid-like mapping centered on the threshold
            offset = raw_score - ANOMALY_DECISION_THRESHOLD
            anomaly_score = 1.0 / (1.0 + np.exp(3.0 * offset))
            anomaly_score = float(np.clip(anomaly_score, 0.0, 1.0))

            logger.debug(
                f"Anomaly prediction: raw={raw_score:.4f}, "
                f"threshold={ANOMALY_DECISION_THRESHOLD}, "
                f"score={anomaly_score:.4f}"
            )

            return round(anomaly_score, 4)

        except Exception as e:
            logger.error(f"Anomaly prediction error: {e}")
            return 0.5

    # ─── Persistence ────────────────────────────────────────────
    def save_model(self, path: str = _DEFAULT_MODEL_PATH):
        """Save trained model + scaler to disk."""
        if not self.is_loaded:
            raise RuntimeError("Cannot save — model not trained.")

        os.makedirs(os.path.dirname(path), exist_ok=True)
        bundle = {
            "model": self._model,
            "scaler": self._scaler,
            "contamination": ANOMALY_CONTAMINATION_RATE,
            "n_estimators": ANOMALY_N_ESTIMATORS,
        }
        joblib.dump(bundle, path)
        logger.info(f"AnomalyDetector saved to {path}")

    def load_model(self, path: str = _DEFAULT_MODEL_PATH) -> bool:
        """Load trained model + scaler from disk. Returns True on success."""
        if not os.path.exists(path):
            logger.warning(
                f"Anomaly model file not found: {path}. "
                "Run `python -m app.training.train_anomaly` first."
            )
            return False

        try:
            bundle = joblib.load(path)
            self._model = bundle["model"]
            self._scaler = bundle["scaler"]
            self._is_trained = True
            logger.info(
                f"[STARTUP] AnomalyDetector loaded | "
                f"contamination={bundle.get('contamination', '?')}, "
                f"estimators={bundle.get('n_estimators', '?')}"
            )
            return True
        except Exception as e:
            logger.error(f"Failed to load anomaly model: {e}")
            return False


# ─── Global singleton ──────────────────────────────────────────────
_anomaly_detector: Optional[AnomalyDetector] = None


def get_anomaly_detector() -> AnomalyDetector:
    """Get or create the global AnomalyDetector singleton."""
    global _anomaly_detector
    if _anomaly_detector is None:
        _anomaly_detector = AnomalyDetector()
    return _anomaly_detector


def load_anomaly_model() -> bool:
    """Explicitly load the anomaly model from disk (startup)."""
    detector = get_anomaly_detector()
    return detector.load_model()
