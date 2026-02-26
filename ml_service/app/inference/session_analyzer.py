"""
Phase-4 – Session Analyzer
Central orchestrator that combines feature extraction, embedding similarity,
anomaly detection, and risk scoring into a unified behavioral assessment.
"""

import time
import logging
from typing import Dict, List, Any, Optional

import numpy as np

from app.preprocessing.feature_extractor import SessionFeatureExtractor
from app.inference.embedding_engine import get_embedding_engine
from app.inference.anomaly_model import get_anomaly_detector
from app.inference.risk_engine import compute_risk_score
from app.inference.threshold_config import MIN_PROMPTS_FOR_BEHAVIOR

logger = logging.getLogger("ml_service.session_analyzer")


class SessionAnalyzer:
    """
    Combines all Phase-4 behavioral analysis components:
        1. Feature extraction  (SessionFeatureExtractor)
        2. Embedding similarity (EmbeddingEngine)
        3. Anomaly detection    (AnomalyDetector)
        4. Risk scoring         (RiskEngine)

    Produces a structured JSON behavioral assessment per session.
    """

    def __init__(self):
        self._feature_extractor = SessionFeatureExtractor()

    def analyze(
        self,
        session_id: str,
        prompt_logs: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Perform full behavioral analysis on a session.

        Args:
            session_id: Unique session identifier
            prompt_logs: List of prompt log dicts, each containing:
                - prompt: str
                - injection_score: float
                - blocked: bool
                - timestamp: float (unix epoch)
                - tool_violations: int (optional)

        Returns:
            Structured JSON with anomaly_score, probing_detected,
            behavior_flags, risk_score, risk_level, and timing info.
        """
        start_time = time.time()

        # ── Guard: empty session ────────────────────────────────────
        if not prompt_logs:
            logger.warning(f"Session {session_id}: empty prompt logs.")
            return self._empty_response(session_id)

        # ── Step 1: Embedding similarity ────────────────────────────
        embedding_start = time.time()
        prompts = [p.get("prompt", "") for p in prompt_logs]
        engine = get_embedding_engine()
        similarity_result = engine.compute_session_similarity(prompts)
        similarity_mean = similarity_result["similarity_mean"]
        probing_detected = similarity_result["probing_detected"]
        embedding_ms = round((time.time() - embedding_start) * 1000, 2)

        # ── Step 2: Feature extraction ──────────────────────────────
        feature_start = time.time()
        feature_vector = self._feature_extractor.extract(
            prompt_logs, similarity_mean=similarity_mean
        )
        feature_ms = round((time.time() - feature_start) * 1000, 2)

        # ── Step 3: Anomaly detection ───────────────────────────────
        anomaly_start = time.time()
        detector = get_anomaly_detector()
        anomaly_score = detector.predict(feature_vector)
        anomaly_ms = round((time.time() - anomaly_start) * 1000, 2)

        # ── Step 4: Risk scoring ────────────────────────────────────
        injection_scores = [
            float(p.get("injection_score", 0.0)) for p in prompt_logs
        ]
        max_injection = max(injection_scores) if injection_scores else 0.0

        tool_violations = sum(
            int(p.get("tool_violations", 0)) for p in prompt_logs
        )
        # Normalize tool violations to 0-1 (cap at 5 for normalization)
        tool_violation_score = min(tool_violations / 5.0, 1.0)

        risk_result = compute_risk_score(
            max_injection_score=max_injection,
            anomaly_score=anomaly_score,
            tool_violation_score=tool_violation_score,
        )

        # ── Step 5: Behavior flags ──────────────────────────────────
        behavior_flags = self._compute_flags(
            prompt_logs=prompt_logs,
            anomaly_score=anomaly_score,
            probing_detected=probing_detected,
            feature_vector=feature_vector,
        )

        total_ms = round((time.time() - start_time) * 1000, 2)

        # ── Structured logging for future debugging ─────────────────
        logger.info(
            f"Session {session_id}: "
            f"prompts={len(prompt_logs)}, "
            f"anomaly={anomaly_score:.4f}, "
            f"probing={'YES' if probing_detected else 'no'}, "
            f"risk={risk_result['risk_score']:.4f} ({risk_result['risk_level']}), "
            f"flags={behavior_flags}, "
            f"timing=[emb={embedding_ms}ms feat={feature_ms}ms "
            f"anom={anomaly_ms}ms total={total_ms}ms]"
        )

        return {
            "session_id": session_id,
            "anomaly_score": anomaly_score,
            "probing_detected": probing_detected,
            "behavior_flags": behavior_flags,
            "risk_score": risk_result["risk_score"],
            "risk_level": risk_result["risk_level"],
            "risk_components": risk_result["components"],
            "similarity_mean": similarity_mean,
            "high_similarity_count": similarity_result["high_similarity_count"],
            "total_prompts": len(prompt_logs),
            "feature_vector_length": len(feature_vector),
            "inference_time_ms": total_ms,
        }

    # ─── Behavior flag logic ────────────────────────────────────────
    def _compute_flags(
        self,
        prompt_logs: List[Dict[str, Any]],
        anomaly_score: float,
        probing_detected: bool,
        feature_vector: np.ndarray,
    ) -> List[str]:
        """Generate human-readable behavior flags based on features."""
        flags = []
        n = len(prompt_logs)

        # High frequency
        if n >= MIN_PROMPTS_FOR_BEHAVIOR:
            prompt_frequency = feature_vector[3]  # index 3 = prompt_frequency
            if prompt_frequency > 5.0:
                flags.append("high_frequency")

        # Semantic probing
        if probing_detected:
            flags.append("semantic_probing")

        # Escalating severity
        severity_slope = feature_vector[8]  # index 8 = severity_slope
        if severity_slope > 0.3:
            flags.append("escalating_severity")

        # High block ratio
        blocked_ratio = feature_vector[4]  # index 4 = blocked_ratio
        if blocked_ratio > 0.5:
            flags.append("high_block_rate")

        # Tool abuse
        tool_violations = feature_vector[5]  # index 5 = tool_violation_count
        if tool_violations >= 2:
            flags.append("tool_abuse")

        # Anomalous behavior
        if anomaly_score > 0.7:
            flags.append("anomalous_behavior")

        # Long session (low & slow)
        session_duration = feature_vector[9]  # index 9 = session_duration_minutes
        if session_duration > 20.0 and anomaly_score > 0.5:
            flags.append("prolonged_suspicious_session")

        return flags

    # ─── Empty response helper ──────────────────────────────────────
    def _empty_response(self, session_id: str) -> Dict[str, Any]:
        return {
            "session_id": session_id,
            "anomaly_score": 0.0,
            "probing_detected": False,
            "behavior_flags": [],
            "risk_score": 0.0,
            "risk_level": "low",
            "risk_components": {
                "injection": 0.0,
                "anomaly": 0.0,
                "tool_violation": 0.0,
            },
            "similarity_mean": 0.0,
            "high_similarity_count": 0,
            "total_prompts": 0,
            "feature_vector_length": 0,
            "inference_time_ms": 0.0,
        }


# ─── Global singleton ──────────────────────────────────────────────
_session_analyzer: Optional[SessionAnalyzer] = None


def get_session_analyzer() -> SessionAnalyzer:
    """Get or create the global SessionAnalyzer singleton."""
    global _session_analyzer
    if _session_analyzer is None:
        _session_analyzer = SessionAnalyzer()
    return _session_analyzer
