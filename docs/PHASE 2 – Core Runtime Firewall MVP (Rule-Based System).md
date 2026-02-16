# **PHASE 2 – Core Runtime Firewall MVP (Rule-Based System)**

This is the phase where AegisAI becomes **functional**, even without ML.

---

# **🎯 What is Phase-2?**

Phase-2 is about building a **working Zero-Trust Runtime Firewall Layer** with:

* Prompt interception  
* Rule-based injection detection  
* Tool policy enforcement  
* Session logging  
* Risk scoring engine  
* API responses usable by dashboard

⚠ No ML intelligence yet.  
This phase ensures the **system works end-to-end** before intelligence is added.

---

# **🎯 Why This Phase Is Important**

If you skip this:

* ML integration becomes messy  
* Debugging becomes impossible  
* Dashboard has nothing real to show  
* Risk scoring logic becomes unstable

This phase ensures:

* Stable system core  
* Clear data pipeline  
* Controlled execution flow  
* Smooth future ML integration

Think of it as building the **skeleton before the brain**.

---

# **🎯 What Needs To Be Built**

### **1️⃣ Firewall Runtime Engine (FastAPI)**

* `/chat` endpoint  
* Intercept prompt  
* Validate request  
* Generate session context  
* Call rule-based injection logic  
* Apply tool policy check  
* Compute risk  
* Log everything  
* Return structured response

---

### **2️⃣ Rule-Based Injection Detector**

Simple but strong:

Detect patterns like:

* “ignore previous instructions”  
* “reveal system prompt”  
* “act as developer”  
* “bypass”  
* “system prompt”

Return:

{  
  injection\_score: 0.7,  
  label: "suspicious"  
}

No ML yet.

---

### **3️⃣ Tool Policy Engine**

Implement:

tool\_policy.json

Example:

{  
  "database\_query": \["admin"\],  
  "file\_access": \["admin"\]  
}

If LLM tries unauthorized tool call → Block.

---

### **4️⃣ Risk Engine (Static Formula)**

Use frozen formula:

final\_risk \=  
0.6 \* injection\_score \+  
0.4 \* tool\_score

(Anomaly\_score \= 0 for now)

Define thresholds:

* ≥ 0.75 → Block  
* 0.5–0.75 → Flag  
* \< 0.5 → Safe

---

### **5️⃣ Logging Layer**

Store:

* user\_id  
* session\_id  
* prompt  
* injection\_score  
* tool\_score  
* final\_risk  
* blocked  
* timestamp

This data will power Phase-4 anomaly modeling.

---

# **🎯 How To Build It (Implementation Strategy)**

Now we divide work independently.

---

# **👨‍💻 Absar – Cybersecurity Lead**

### **Independent Work:**

1. Define injection rule taxonomy  
2. Create pattern-based detector  
3. Define risk thresholds  
4. Create tool policy logic  
5. Write attack simulation prompts

Deliverables:

* `risk_engine.py`  
* `policy_engine.py`  
* `rule_based_detector.py`  
* `attack_simulation.json`

No dependency on ML.  
Minimal dependency on frontend.

---

# **🌐 Sagar – Full Stack (Firewall \+ API)**

### **Independent Work:**

1. Build FastAPI app  
2. Create `/chat` endpoint  
3. Integrate rule-based detector  
4. Integrate risk engine  
5. Create DB schema  
6. Log every event  
7. Return structured risk object  
8. Connect to NextJS dashboard via API

Deliverables:

* Working firewall server  
* DB logging  
* Risk JSON response  
* WebSocket (optional basic version)

He can use mock tool calls.  
No ML dependency.

---

# **🤖 Yogesh – ML Engineer (Phase-2 Role)**

Even though ML isn’t integrated yet, he should NOT be idle.

### **Independent Work:**

1. Prepare injection dataset collection  
2. Build labeling pipeline  
3. Create preprocessing scripts  
4. Design ML API skeleton:  
   * `/analyze_prompt`  
   * `/analyze_session`  
5. Create dummy static ML responses

Deliverables:

* ML service skeleton running on separate port  
* Dataset ready for Phase-3 training  
* API structure matching contract

He works completely independently.

---

# **🔄 Integration Strategy at End of Phase-2**

Once all are done:

1. Connect rule-based detector into firewall  
2. Connect dashboard to firewall API  
3. Run attack simulation prompts  
4. Validate:  
   * Risk increases properly  
   * Block works  
   * Logging works  
   * Tool policy blocks correctly

Run 3 test cases:

* Injection prompt  
* Safe prompt  
* Unauthorized tool invocation

If all pass → Phase-2 complete.

---

# **🎯 Expected End Result of Phase-2**

At the end of this phase, you will have:

✅ Working Zero-Trust Runtime Firewall  
✅ Rule-based injection detection  
✅ Tool misuse blocking  
✅ Risk scoring engine  
✅ Session logging system  
✅ NextJS dashboard receiving live risk data  
✅ Attack simulation demo working

Even without ML, you now have:

A functional AI security middleware.

---

# **📌 What Phase-2 Does NOT Include**

❌ No trained ML model  
❌ No anomaly detection  
❌ No embedding similarity  
❌ No behavioral intelligence

That comes in Phase-3 & 4\.

---

# **🧠 Phase-2 Success Criteria**

If you can demo:

1. User sends injection prompt  
2. Risk score increases  
3. Block triggered  
4. Logged in DB  
5. Dashboard shows event

Then Phase-2 is successfully complete.

