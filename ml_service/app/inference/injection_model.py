import os
import joblib
import numpy as np
import logging
import re

# Setup Logging
logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
logger = logging.getLogger("ml_service")

# Global variables
model = None
vectorizer = None
INJECTION_THRESHOLD = 0.65

def load_model():
    """
    Loads the model and vectorizer from disk.
    """
    global model, vectorizer
    if model is None or vectorizer is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, "models", "injection_model.pkl")
        vectorizer_path = os.path.join(base_dir, "models", "tfidf_vectorizer.pkl")
        
        try:
            logger.info(f"Loading model from {model_path}...")
            model = joblib.load(model_path)
            logger.info(f"Loading vectorizer from {vectorizer_path}...")
            vectorizer = joblib.load(vectorizer_path)
            logger.info("Model and vectorizer loaded successfully.")
        except Exception as e:
            logger.error(f"Error loading model/vectorizer: {e}")
            model = None
            vectorizer = None

# Load model at startup
load_model()

def clean_input(prompt: str) -> str:
    """
    Cleans the input prompt: lowercase, strip, remove excessive whitespace.
    """
    if not prompt:
        return ""
    # Lowercase and strip
    prompt = prompt.lower().strip()
    # Remove excessive internal whitespace
    prompt = re.sub(r'\s+', ' ', prompt)
    return prompt

def get_explainability(prompt, transform_vector):
    """
    Extracts top contributing keywords for the 'injection' class.
    Assumes Linear Model (Logistic Regression/SVM) with .coef_ attribute.
    """
    global model, vectorizer
    keywords = []
    
    try:
        # Check if model has coefficients (Linear Models)
        if not hasattr(model, 'coef_'):
            return ["Model does not support coefficient extraction"]

        # Get feature names
        feature_names = vectorizer.get_feature_names_out()
        
        # Get coefficients for the positive class (Injection)
        # Binary classification: coef_[0] corresponds to class 1 (Injection)
        coefs = model.coef_[0]
        
        # Get indices of words present in the input
        # transform_vector is a sparse matrix (1, n_features)
        _, col_indices = transform_vector.nonzero()
        
        # Calculate contribution: tfidf_score * coefficient
        # We only care about words that positively contribute to "Injection" class
        # i.e., coefficient > 0
        contributions = []
        for idx in col_indices:
            tfidf_val = transform_vector[0, idx]
            weight = coefs[idx]
            contribution = tfidf_val * weight
            
            # If weight is positive, it pushes towards "Injection"
            if weight > 0:
                contributions.append((contribution, feature_names[idx]))
        
        # Sort by contribution descending
        contributions.sort(key=lambda x: x[0], reverse=True)
        
        # Get top 5
        keywords = [word for score, word in contributions[:5]]
        
    except Exception as e:
        logger.warning(f"Explainability failed: {e}")
        keywords = ["Error generating explanation"]
        
    return keywords

def analyze_injection(prompt: str, session_id: str = "unknown"):
    """
    Analyzes the prompt using the loaded model.
    Returns structured output with confidence and explainability.
    """
    global model, vectorizer
    
    # 1. Input Cleaning & Validation
    if not prompt:
        logger.warning(f"Session: {session_id} | Empty prompt received.")
        return {
            "label": "safe",
            "confidence": 1.0,
            "injection_score": 0.0,
            "explanation": "Empty prompt received.",
            "keywords_triggered": []
        }

    cleaned_prompt = clean_input(prompt)
    
    # Ensure model is loaded
    if model is None or vectorizer is None:
        load_model()
        if model is None or vectorizer is None:
             logger.error("Model not loaded during inference request.")
             return {
                "label": "error",
                "confidence": 0.0,
                "injection_score": 0.0,
                "explanation": "Model not loaded.",
                "keywords_triggered": []
            }
        
    try:
        # 2. Transform Input
        features = vectorizer.transform([cleaned_prompt])
        
        # 3. Predict Probability
        # Assuming binary classification: [safe, injection]
        # We take index 1 for injection score (check your model classes order if different)
        # To be safe, let's find the index of "injection" or 1 if possible, otherwise assume 1
        injection_index = 1
        if hasattr(model, 'classes_'):
            # Heuristic to find the 'bad' class index
            if 'injection' in model.classes_:
                injection_index = list(model.classes_).index('injection')
            elif 1 in model.classes_:
                 injection_index = list(model.classes_).index(1)
        
        probabilities = model.predict_proba(features)[0]
        injection_score = float(probabilities[injection_index])
        
        # 4. Apply Custom Threshold
        if injection_score > INJECTION_THRESHOLD:
            label = "injection"
            confidence = injection_score
        else:
            label = "safe"
            confidence = 1.0 - injection_score # Confidence in being safe
            
        # 5. Explainability (Triggered Keywords)
        keywords_triggered = []
        if label == "injection":
            keywords_triggered = get_explainability(cleaned_prompt, features)
            explanation = f"Flagged as injection due to keywords: {', '.join(keywords_triggered)}"
        else:
            explanation = f"Classified as safe. Score: {injection_score:.4f}"

        # 6. Structured Logging
        logger.info(f"Session: {session_id} | Length: {len(prompt)} | Prediction: {label} ({injection_score:.4f})")
        
        return {
            "label": label,
            "confidence": round(confidence, 4),
            "injection_score": round(injection_score, 4),
            "explanation": explanation,
            "keywords_triggered": keywords_triggered
        }
        
    except Exception as e:
        logger.error(f"Error during inference: {e}")
        return {
            "label": "error",
            "confidence": 0.0,
            "injection_score": 0.0,
            "explanation": f"Inference Error: {str(e)}",
            "keywords_triggered": []
        }
