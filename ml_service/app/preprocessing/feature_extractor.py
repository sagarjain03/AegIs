import re
import math
from collections import Counter

def calculate_entropy(text):
    if not text:
        return 0
    entropy = 0
    for x in range(256):
        p_x = float(text.count(chr(x))) / len(text)
        if p_x > 0:
            entropy += - p_x * math.log(p_x, 2)
    return entropy

def extract_features(prompt: str):
    """
    Extracts features from a prompt for anomaly detection.
    """
    features = {}
    
    # Basic features
    features['length'] = len(prompt)
    features['token_count'] = len(prompt.split())
    
    # Keyword analysis
    override_keywords = ["ignore", "system prompt", "developer", "reveal"]
    features['override_keyword_count'] = sum(1 for k in override_keywords if k in prompt.lower())
    
    # Special character analysis
    special_chars = re.sub(r'[a-zA-Z0-9\s]', '', prompt)
    features['special_char_ratio'] = len(special_chars) / len(prompt) if len(prompt) > 0 else 0
    
    # Entropy
    features['entropy'] = calculate_entropy(prompt)
    
    return features
