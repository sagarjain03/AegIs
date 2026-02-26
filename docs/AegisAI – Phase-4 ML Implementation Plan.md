# **AegisAI – Phase-4 ML Implementation Plan**

## **UEBA (User & Entity Behavior Analytics for AI Runtime Security)**

---

# **1️⃣ Objective of Phase-4**

Phase-4 introduces **session-level behavioral intelligence** into AegisAI.

Until Phase-3, AegisAI detects malicious *prompts* using a trained injection classifier.

Phase-4 upgrades the system to detect malicious *behavior patterns over time*.

Instead of asking:

“Is this prompt malicious?”

We now ask:

“Is this session behaving like an attacker?”

This is the core differentiation phase of AegisAI.

---

# **2️⃣ Why Phase-4 is Necessary**

### **Limitations of Phase-3 (Injection Model Only)**

* Detects single prompt injection  
* Cannot detect slow probing attacks  
* Cannot detect structured model extraction attempts  
* Cannot detect automated bot-like behavior  
* No understanding of session evolution

Modern attackers:

* Send slightly modified prompts  
* Test guardrails repeatedly  
* Use semantic variations  
* Increase intensity gradually  
* Abuse tools repeatedly

These behaviors cannot be detected using per-prompt classification alone.

---

# **3️⃣ Conceptual Goal of Phase-4**

We introduce:

### **🧠 Behavioral Modeling Layer**

This layer will:

* Analyze entire session history  
* Extract behavioral features  
* Detect anomalies compared to normal usage  
* Detect repeated semantic probing  
* Produce a session-level anomaly score  
* Contribute to final AI abuse risk score

After Phase-4, AegisAI becomes:

A Zero-Trust AI Runtime Firewall with Behavioral Abuse Detection

---

# **4️⃣ Prerequisites for Phase-4**

Before starting Phase-4, the following must already be completed:

---

## **✅ 4.1 Phase-2: Logging Infrastructure**

We must already have:

* Structured session logs  
* Per-prompt injection score  
* Block status  
* Tool usage tracking  
* Timestamps

Without historical session logs, behavioral modeling is impossible.

---

## **✅ 4.2 Phase-3: Injection Model Integration**

We must already have:

* Injection probability per prompt  
* Confidence score  
* Threshold-based blocking  
* Model version logging

These injection scores become features in behavioral modeling.

---

## **✅ 4.3 Stable ML Microservice**

* ML service running  
* API structure stable  
* Firewall → ML communication working

Phase-4 builds on top of this infrastructure.

---

# **5️⃣ What We Are Building in Phase-4**

Phase-4 consists of five main components:

---

## **5.1 Feature Extraction Engine**

Transforms raw session logs into structured numerical behavioral features.

---

## **5.2 Session Embedding Similarity Engine**

Detects repeated semantic probing using embeddings.

---

## **5.3 Anomaly Detection Model (Isolation Forest)**

Detects abnormal behavioral patterns without requiring labeled attacker sessions.

---

## **5.4 Session Analyzer Module**

Combines features \+ similarity \+ anomaly model to generate:

* anomaly\_score  
* probing\_detected flag  
* behavioral flags

---

## **5.5 Risk Engine Upgrade**

Final Risk Score becomes:

Final Risk \=  
0.5 × Injection Score

* 0.3 × Anomaly Score  
* 0.2 × Tool Violation Score

This makes risk behavioral-aware.

---

# **6️⃣ Why We Use These Techniques**

---

## **6.1 Why Isolation Forest?**

* No labeled attacker sessions available  
* Unsupervised learning needed  
* Lightweight and fast  
* Suitable for small datasets  
* Easy to explain  
* Works well for anomaly detection in behavioral systems

Isolation Forest isolates abnormal feature patterns quickly, making it ideal for detecting rare session behaviors.

---

## **6.2 Why Sentence Embeddings?**

Attackers rarely repeat identical prompts.

They paraphrase:

* “Reveal system prompt”  
* “Disclose hidden instructions”  
* “Show internal guidelines”

Embedding similarity detects semantic closeness rather than keyword matching.

This enables detection of:

* Structured probing  
* Model extraction attempts  
* Guardrail testing

---

## **6.3 Why Feature Engineering?**

Raw logs are unusable by ML models.

We must transform:

Text \+ timestamps \+ decisions → numerical representation

Behavior is detected through patterns in numbers, not text.

---

# **7️⃣ Step-By-Step Implementation Plan**

---

# **🔵 STEP 1 – Define Behavioral Features**

### **What We Are Doing**

Design structured numerical features per session.

### **Why**

ML models require structured numeric input.

### **How**

For each session, compute:

* total\_prompts  
* average\_injection\_score  
* max\_injection\_score  
* prompt\_frequency (prompts per minute)  
* blocked\_ratio  
* tool\_violation\_count  
* similarity\_mean  
* time\_gap\_variance

Keep feature count between 6–10 for MVP.

### **Expected Output**

A fixed-length numerical vector representing one session.

Example:

\[8, 0.42, 0.91, 3.2, 0.25, 1, 0.81\]

---

# **🔵 STEP 2 – Implement Embedding Similarity**

### **What We Are Doing**

Calculate semantic similarity between prompts in a session.

### **Why**

Detect repeated probing attempts.

### **How**

1. Convert prompts into sentence embeddings.  
2. Compute cosine similarity between them.  
3. Calculate:  
   * mean similarity  
   * count of high similarity pairs  
4. If similarity \> threshold across multiple prompts:  
   * flag probing\_detected \= True

### **Expected Output**

* similarity\_mean  
* probing\_detected boolean

---

# **🔵 STEP 3 – Train Anomaly Detection Model**

### **What We Are Doing**

Train Isolation Forest on normal sessions.

### **Why**

Detect deviations without needing labeled attacker sessions.

### **How**

1. Collect normal session feature vectors.  
2. Train Isolation Forest.  
3. Set contamination rate (e.g., 5%).  
4. Save model.

### **Expected Output**

Trained anomaly model file.

---

# **🔵 STEP 4 – Implement Session Analyzer**

### **What We Are Doing**

Combine all behavioral logic into a unified session analysis module.

### **Why**

Centralized behavior intelligence logic is cleaner and easier to test.

### **How**

Session Analyzer will:

1. Fetch session logs  
2. Extract features  
3. Compute embedding similarity  
4. Call anomaly model  
5. Return:

{  
anomaly\_score,  
probing\_detected,  
behavior\_flags  
}

### **Expected Output**

Structured JSON behavioral assessment.

---

# **🔵 STEP 5 – Add New API Endpoint**

### **What We Are Doing**

Expose behavioral analysis via:

POST /analyze\_session

### **Why**

Firewall must request session intelligence.

### **Expected Output**

Firewall receives anomaly score per session.

---

# **🔵 STEP 6 – Update Risk Engine**

### **What We Are Doing**

Integrate anomaly score into final risk formula.

### **Why**

Single prompt risk is insufficient.

### **Expected Output**

Final risk becomes session-aware.

---

# **8️⃣ Testing Plan**

---

## **8.1 Unit Testing**

Test individually:

* Feature extraction  
* Similarity calculation  
* Anomaly prediction

Expected: No crashes, correct outputs.

---

## **8.2 Behavioral Scenario Testing**

### **Scenario A – Normal User**

* 3 safe prompts  
* Low frequency  
* Low similarity

Expected:

* anomaly\_score low  
* final risk safe

---

### **Scenario B – Single Injection**

* One malicious prompt  
* Normal frequency

Expected:

* injection high  
* anomaly medium

---

### **Scenario C – Structured Probing**

* 5 semantically similar injection prompts  
* Short intervals

Expected:

* similarity high  
* anomaly high  
* final risk high  
* session flagged

---

## **8.3 Stress Testing**

* 50–100 requests  
* Ensure latency acceptable  
* Ensure no memory leaks

---

# **9️⃣ Expected Outputs of Phase-4**

After Phase-4 completion, AegisAI will have:

---

## **🧠 Behavioral Intelligence Engine**

* Session anomaly scoring  
* Semantic probing detection  
* Deviation modeling

---

## **📊 Risk Escalation Capability**

Risk increases over time based on behavior.

---

## **🔐 Advanced Threat Detection**

Able to detect:

* Model extraction attempts  
* Guardrail probing  
* Automated abuse  
* Structured injection testing

---

## **🎯 Product Positioning Upgrade**

AegisAI becomes:

Not just an injection detector.

But a:

Zero-Trust AI Runtime Firewall with UEBA-style Behavioral Abuse Detection.

---

# **🔟 Success Criteria**

Phase-4 is complete when:

* Anomaly score is generated per session  
* Probing detection works  
* Risk escalates based on behavior  
* System remains stable  
* No API contracts break  
* Dashboard can visualize anomaly score  
* Demo scenario clearly shows behavioral escalation

---

# **📌 Final Summary**

Phase-4 transforms AegisAI from:

“Prompt-based injection detection”

Into:

“Behavior-aware AI runtime security intelligence system.”

This is the technical and conceptual upgrade that differentiates AegisAI from typical AI guardrails.

