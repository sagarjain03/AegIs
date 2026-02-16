# **PHASE-2 – ML ENGINEER (YOGESH)**

Even though ML is NOT integrated in Phase-2, your work here is **critical for Phase-3 success**.

If you do this properly now, Phase-3 becomes plug-and-play.

If you skip this, Phase-3 becomes chaos.

---

# **🎯 CORE MISSION IN PHASE-2**

Prepare the **ML infrastructure, data pipeline, and service skeleton** so that:

* Firewall can later connect without refactoring  
* Models can be trained smoothly  
* Dataset is clean and structured  
* API contract is already production-ready

You are building the **brain container**, not the brain yet.

---

# **🔷 WHAT PHASE-2 FOR ML IS NOT**

❌ No heavy model training  
❌ No hyperparameter tuning  
❌ No optimization yet  
❌ No GPU heavy compute  
❌ No anomaly model yet

This phase is about:

Structure → Dataset → API → Validation → Dummy inference

---

# **🧱 1️⃣ Setup ML Microservice (Independent)**

### **📁 Folder**

`ml_service/`

### **🎯 Goal**

Standalone FastAPI ML service running on port 9000\.

---

## **You Must Create:**

### **Endpoints:**

POST /analyze\_prompt  
POST /analyze\_session  
GET  /health

---

## **Expected Output Format (STRICT)**

### **For `/analyze_prompt`**

{  
  "label": "safe",  
  "confidence": 0.5,  
  "injection\_score": 0.5,  
  "explanation": "Dummy model response"  
}

Even if dummy.

---

## **Why This Is Critical**

Firewall team must integrate NOW using this contract.  
No future format changes allowed.

---

## **Testing**

* Run service independently  
* Send 20 mock prompts  
* Confirm consistent JSON response  
* Confirm no crash on invalid input

---

# **🧱 2️⃣ Injection Dataset Collection Pipeline**

This is your most important task in Phase-2.

---

## **🎯 Goal**

Build structured injection dataset.

Create:

dataset/  
   injection\_prompts.csv  
   safe\_prompts.csv

---

## **Sources to Collect From**

* Public jailbreak prompts (GitHub repos)  
* Red-team papers  
* Open prompt injection datasets  
* Self-generated adversarial prompts

---

## **Dataset Format**

CSV format:

| prompt | label |
| ----- | ----- |
| ignore previous instructions | injection |
| what is AI? | safe |

---

## **Requirements**

* Minimum 1000 injection prompts  
* Minimum 1000 safe prompts  
* Balanced dataset  
* No duplicates  
* Lowercase normalized

---

## **Preprocessing Script**

Create:

`preprocessing/clean_dataset.py`

Must:

* Remove duplicates  
* Normalize text  
* Strip whitespace  
* Basic token cleaning  
* Remove empty rows

---

## **Testing**

* Check class distribution  
* Check average token length  
* Confirm no NaN values  
* Print dataset summary

---

# **🧱 3️⃣ Feature Engineering Preparation**

Even before training:

Create feature extraction pipeline.

File:

`preprocessing/feature_extractor.py`

Must support:

* Token count  
* Prompt length  
* Presence of override keywords  
* Special character ratio  
* Entropy approximation (optional basic)

This will later help:

* Hybrid model  
* Behavioral modeling  
* Quick scoring

---

# **🧱 4️⃣ Dummy Injection Model Wrapper**

Create:

`inference/injection_model.py`

Even if model not trained:

Wrap dummy logic like:

* If prompt contains "ignore" → injection\_score \= 0.7  
* Else injection\_score \= 0.2

This simulates ML model behavior.

Return structured object.

---

## **Why?**

So firewall integration can happen now.

Later, only replace internal logic.  
No API changes.

---

# **🧱 5️⃣ Model Training Skeleton (No Heavy Training Yet)**

Create:

`training/train_injection.py`

Structure:

* Load dataset  
* Tokenize  
* Split train/test  
* Placeholder for DistilBERT  
* Print mock metrics

Even if training not executed.

This prepares pipeline.

---

# **🧱 6️⃣ Evaluation Framework**

Create:

`training/evaluate_model.py`

Should calculate:

* Accuracy  
* Precision  
* Recall  
* F1 score  
* Confusion matrix

Use sklearn metrics.

Even with dummy predictions.

---

# **🧪 PHASE-2 ML TESTING PLAN**

You must independently test:

---

## **Test 1 – API Stability**

* Send valid prompt  
* Send empty prompt  
* Send very long prompt (1000+ words)  
* Send malformed JSON

Service must never crash.

---

## **Test 2 – Dataset Integrity**

* Confirm balanced classes  
* Confirm cleaned properly  
* Confirm file readable  
* Confirm no encoding errors

---

## **Test 3 – Latency**

* Measure API response time  
* Should be \< 50ms (dummy model)

---

## **Test 4 – Integration Simulation**

Simulate firewall call:

requests.post("localhost:9000/analyze\_prompt", json=payload)

Ensure output exactly matches contract.

---

# **🧱 7️⃣ Prepare Behavioral Model Structure (Skeleton Only)**

Create:

`inference/anomaly_model.py`

Dummy response:

{  
  "anomaly\_score": 0.1,  
  "reason": "Placeholder anomaly model"  
}

No training yet.

But API must exist.

---

# **🎯 EXPECTED END RESULT OF ML PHASE-2**

By the end of Phase-2, you must have:

✅ Independent ML microservice running  
✅ API contract stable and frozen  
✅ Clean structured injection dataset  
✅ Preprocessing pipeline  
✅ Feature extraction module  
✅ Dummy injection inference logic  
✅ Training script skeleton  
✅ Evaluation framework  
✅ Behavioral model skeleton

Even without training, system is:

Ready for ML integration in Phase-3.

---

# **🧠 WHY THIS STRUCTURE IS POWERFUL**

Because in Phase-3:

You only replace:

dummy\_injection\_logic()

With:

trained\_transformer\_model()

Firewall remains untouched.

---

# **⚠️ Common ML Mistakes To Avoid**

❌ Changing API response format later  
❌ Training before dataset is clean  
❌ Ignoring preprocessing  
❌ Overcomplicating anomaly model early  
❌ Mixing ML logic with firewall

---

# **🔥 Phase-2 ML Success Criteria**

If:

* Firewall can call ML service  
* Dataset is clean  
* API is stable  
* No crashes  
* Structure ready for training

Then ML Phase-2 is complete.

