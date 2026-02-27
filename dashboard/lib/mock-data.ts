// AegisAI Mock Data

export const kpiData = {
  totalInteractions: 256_219,
  activeThreats: 28_219,
  injectionAttempts: 4_871,
  sessionRiskScore: 73.4,
  lastIncident: "2026-02-12",
  lastScan: "2026-02-08",
}

export type Threat = {
  id: string
  type: "Injection" | "Jailbreak" | "Extraction" | "Probing" | "Bot Abuse" | "Data Harvesting"
  severity: "Critical" | "High" | "Medium" | "Low"
  status: "Active" | "Mitigated" | "Under Investigation" | "Resolved"
  timestamp: string
  sourceIP: string
  geoLocation: string
  affectedAsset: string
  description: string
}

export const threats: Threat[] = [
  { id: "THR-2026-0891", type: "Injection", severity: "Critical", status: "Active", timestamp: "2026-02-12T14:32:00Z", sourceIP: "185.221.xxx", geoLocation: "Eastern Europe", affectedAsset: "App Server #3", description: "Context override attempt targeting system prompt extraction via nested instruction injection." },
  { id: "THR-2026-0890", type: "Jailbreak", severity: "High", status: "Under Investigation", timestamp: "2026-02-12T13:15:00Z", sourceIP: "103.45.xxx", geoLocation: "Southeast Asia", affectedAsset: "Chat Interface", description: "Repeated roleplay-based jailbreak attempts to bypass content safety guardrails." },
  { id: "THR-2026-0889", type: "Extraction", severity: "High", status: "Mitigated", timestamp: "2026-02-12T11:02:00Z", sourceIP: "45.134.xxx", geoLocation: "South America", affectedAsset: "RAG Pipeline", description: "Structured probing with sequential query variations designed to extract training data patterns." },
  { id: "THR-2026-0888", type: "Probing", severity: "Medium", status: "Resolved", timestamp: "2026-02-11T22:48:00Z", sourceIP: "91.207.xxx", geoLocation: "Central Asia", affectedAsset: "API Gateway", description: "Automated enumeration of tool invocation endpoints via crafted prompt sequences." },
  { id: "THR-2026-0887", type: "Bot Abuse", severity: "Medium", status: "Active", timestamp: "2026-02-11T19:30:00Z", sourceIP: "198.51.xxx", geoLocation: "North America", affectedAsset: "Code Assistant", description: "High-frequency automated queries exceeding behavioral baseline by 340%." },
  { id: "THR-2026-0886", type: "Injection", severity: "Critical", status: "Mitigated", timestamp: "2026-02-11T16:12:00Z", sourceIP: "162.158.xxx", geoLocation: "Western Europe", affectedAsset: "Customer Bot", description: "Multi-layered prompt injection using base64 encoded payload to bypass input filters." },
  { id: "THR-2026-0885", type: "Data Harvesting", severity: "High", status: "Under Investigation", timestamp: "2026-02-11T12:45:00Z", sourceIP: "77.88.xxx", geoLocation: "Eastern Europe", affectedAsset: "Doc Assistant", description: "Systematic extraction of internal document summaries through iterative refinement queries." },
  { id: "THR-2026-0884", type: "Jailbreak", severity: "Low", status: "Resolved", timestamp: "2026-02-10T20:18:00Z", sourceIP: "203.0.xxx", geoLocation: "East Asia", affectedAsset: "Chat Interface", description: "Single-attempt DAN-style jailbreak using outdated prompt template." },
  { id: "THR-2026-0883", type: "Extraction", severity: "Medium", status: "Resolved", timestamp: "2026-02-10T15:33:00Z", sourceIP: "178.62.xxx", geoLocation: "Northern Europe", affectedAsset: "API Gateway", description: "Embedding similarity probing to map model knowledge boundaries." },
  { id: "THR-2026-0882", type: "Probing", severity: "High", status: "Active", timestamp: "2026-02-10T09:05:00Z", sourceIP: "51.79.xxx", geoLocation: "Southern Africa", affectedAsset: "App Server #1", description: "Coordinated multi-session probing across different user identities from same ASN." },
]

export type Session = {
  id: string
  userId: string
  entity: string
  promptCount: number
  anomalyScore: number
  riskLevel: "Critical" | "High" | "Medium" | "Low"
  startTime: string
  duration: string
  tokenUsage: number
}

export const sessions: Session[] = [
  { id: "SES-40291", userId: "usr-8821", entity: "External API", promptCount: 147, anomalyScore: 92, riskLevel: "Critical", startTime: "2026-02-12T14:00:00Z", duration: "2h 15m", tokenUsage: 284_000 },
  { id: "SES-40290", userId: "usr-3344", entity: "Web Client", promptCount: 89, anomalyScore: 78, riskLevel: "High", startTime: "2026-02-12T13:00:00Z", duration: "1h 42m", tokenUsage: 156_000 },
  { id: "SES-40289", userId: "usr-1102", entity: "Mobile App", promptCount: 34, anomalyScore: 45, riskLevel: "Medium", startTime: "2026-02-12T12:30:00Z", duration: "45m", tokenUsage: 67_200 },
  { id: "SES-40288", userId: "usr-7719", entity: "Admin Panel", promptCount: 12, anomalyScore: 15, riskLevel: "Low", startTime: "2026-02-12T11:00:00Z", duration: "22m", tokenUsage: 18_400 },
  { id: "SES-40287", userId: "usr-5503", entity: "External API", promptCount: 211, anomalyScore: 96, riskLevel: "Critical", startTime: "2026-02-12T10:15:00Z", duration: "3h 08m", tokenUsage: 412_000 },
  { id: "SES-40286", userId: "usr-2298", entity: "Web Client", promptCount: 56, anomalyScore: 62, riskLevel: "Medium", startTime: "2026-02-12T09:45:00Z", duration: "1h 10m", tokenUsage: 98_000 },
  { id: "SES-40285", userId: "usr-9014", entity: "Code IDE", promptCount: 78, anomalyScore: 81, riskLevel: "High", startTime: "2026-02-12T08:30:00Z", duration: "2h 01m", tokenUsage: 195_000 },
  { id: "SES-40284", userId: "usr-4467", entity: "Slack Bot", promptCount: 23, anomalyScore: 28, riskLevel: "Low", startTime: "2026-02-11T22:00:00Z", duration: "35m", tokenUsage: 32_000 },
]

export const threatTrend = [
  { date: "Jan 14", threats: 120, blocked: 115, incidents: 5 },
  { date: "Jan 21", threats: 145, blocked: 138, incidents: 7 },
  { date: "Jan 28", threats: 189, blocked: 180, incidents: 9 },
  { date: "Feb 04", threats: 210, blocked: 198, incidents: 12 },
  { date: "Feb 08", threats: 278, blocked: 265, incidents: 13 },
  { date: "Feb 12", threats: 312, blocked: 294, incidents: 18 },
]

export const behaviorData = {
  anomalyDistribution: [
    { range: "0-20", count: 1240, label: "Normal" },
    { range: "20-40", count: 890, label: "Low Risk" },
    { range: "40-60", count: 456, label: "Medium Risk" },
    { range: "60-80", count: 234, label: "High Risk" },
    { range: "80-100", count: 89, label: "Critical" },
  ],
  promptFrequency: [
    { hour: "00:00", count: 45 },
    { hour: "02:00", count: 22 },
    { hour: "04:00", count: 18 },
    { hour: "06:00", count: 34 },
    { hour: "08:00", count: 156 },
    { hour: "10:00", count: 289 },
    { hour: "12:00", count: 312 },
    { hour: "14:00", count: 445 },
    { hour: "16:00", count: 378 },
    { hour: "18:00", count: 234 },
    { hour: "20:00", count: 167 },
    { hour: "22:00", count: 89 },
  ],
  tokenUsageTrend: [
    { date: "Feb 06", tokens: 1_200_000 },
    { date: "Feb 07", tokens: 1_350_000 },
    { date: "Feb 08", tokens: 1_180_000 },
    { date: "Feb 09", tokens: 1_540_000 },
    { date: "Feb 10", tokens: 2_100_000 },
    { date: "Feb 11", tokens: 1_890_000 },
    { date: "Feb 12", tokens: 2_340_000 },
  ],
  clusterData: [
    { x: 12, y: 45, size: 20, cluster: "Normal", risk: 15 },
    { x: 25, y: 62, size: 15, cluster: "Normal", risk: 22 },
    { x: 34, y: 38, size: 18, cluster: "Normal", risk: 18 },
    { x: 55, y: 72, size: 25, cluster: "Suspicious", risk: 58 },
    { x: 62, y: 80, size: 30, cluster: "Suspicious", risk: 65 },
    { x: 78, y: 88, size: 35, cluster: "Malicious", risk: 85 },
    { x: 85, y: 92, size: 40, cluster: "Malicious", risk: 92 },
    { x: 90, y: 95, size: 45, cluster: "Malicious", risk: 97 },
    { x: 42, y: 55, size: 22, cluster: "Suspicious", risk: 48 },
    { x: 18, y: 30, size: 12, cluster: "Normal", risk: 10 },
  ],
}

export type Policy = {
  id: string
  name: string
  category: "Injection" | "Rate Limiting" | "Tool Access" | "Data Protection" | "Session"
  enabled: boolean
  severity: "Block" | "Warn" | "Log"
  description: string
  lastModified: string
}

export const policies: Policy[] = [
  { id: "POL-001", name: "Prompt Injection Blocking", category: "Injection", enabled: true, severity: "Block", description: "Blocks detected prompt injection attempts using ML classifier with >0.85 confidence.", lastModified: "2026-02-10" },
  { id: "POL-002", name: "Jailbreak Pattern Detection", category: "Injection", enabled: true, severity: "Block", description: "Identifies and blocks known jailbreak prompt patterns including DAN, roleplay, and encoding-based attacks.", lastModified: "2026-02-09" },
  { id: "POL-003", name: "Rate Limiting - Standard", category: "Rate Limiting", enabled: true, severity: "Warn", description: "Limits API requests to 100/min per user session. Triggers warning at 80% threshold.", lastModified: "2026-02-08" },
  { id: "POL-004", name: "Database Query Restriction", category: "Tool Access", enabled: true, severity: "Block", description: "Restricts LLM tool invocations to pre-approved database query templates only.", lastModified: "2026-02-07" },
  { id: "POL-005", name: "File Access Control", category: "Tool Access", enabled: true, severity: "Block", description: "Enforces zero-trust file system access with explicit per-path permissions.", lastModified: "2026-02-06" },
  { id: "POL-006", name: "PII Redaction", category: "Data Protection", enabled: true, severity: "Block", description: "Automatically redacts personally identifiable information from LLM outputs.", lastModified: "2026-02-05" },
  { id: "POL-007", name: "Session Anomaly Threshold", category: "Session", enabled: true, severity: "Warn", description: "Flags sessions with anomaly score exceeding 70 for manual review.", lastModified: "2026-02-04" },
  { id: "POL-008", name: "Token Budget Enforcement", category: "Rate Limiting", enabled: false, severity: "Log", description: "Enforces per-session token usage budgets. Currently in monitoring mode.", lastModified: "2026-02-03" },
]

export type ToolPermission = {
  name: string
  status: "Allowed" | "Restricted" | "Blocked"
  scope: string
  lastUsed: string
  invocations: number
}

export const toolPermissions: ToolPermission[] = [
  { name: "database_query", status: "Allowed", scope: "Read-only, approved templates", lastUsed: "2026-02-12T14:22:00Z", invocations: 12_480 },
  { name: "file_read", status: "Restricted", scope: "/docs, /public only", lastUsed: "2026-02-12T13:45:00Z", invocations: 8_930 },
  { name: "file_write", status: "Blocked", scope: "N/A", lastUsed: "Never", invocations: 0 },
  { name: "web_search", status: "Allowed", scope: "Approved domains only", lastUsed: "2026-02-12T14:30:00Z", invocations: 15_200 },
  { name: "code_execution", status: "Restricted", scope: "Sandboxed environment", lastUsed: "2026-02-12T12:10:00Z", invocations: 3_450 },
  { name: "email_send", status: "Blocked", scope: "N/A", lastUsed: "Never", invocations: 0 },
  { name: "api_call", status: "Restricted", scope: "Internal APIs only", lastUsed: "2026-02-12T14:28:00Z", invocations: 22_100 },
  { name: "shell_exec", status: "Blocked", scope: "N/A", lastUsed: "Never", invocations: 0 },
]

export type Integration = {
  id: string
  name: string
  type: "SIEM" | "Logging" | "Webhook" | "Monitoring" | "Identity"
  status: "Connected" | "Disconnected" | "Error"
  lastSync: string
  description: string
}

export const integrations: Integration[] = [
  { id: "INT-001", name: "Splunk Enterprise", type: "SIEM", status: "Connected", lastSync: "2026-02-12T14:30:00Z", description: "Security event forwarding and correlation with enterprise SIEM." },
  { id: "INT-002", name: "Elastic SIEM", type: "SIEM", status: "Disconnected", lastSync: "2026-02-10T08:00:00Z", description: "Log aggregation and threat hunting via Elasticsearch." },
  { id: "INT-003", name: "Datadog APM", type: "Monitoring", status: "Connected", lastSync: "2026-02-12T14:29:00Z", description: "Application performance monitoring and real-time metrics." },
  { id: "INT-004", name: "PagerDuty", type: "Webhook", status: "Connected", lastSync: "2026-02-12T14:25:00Z", description: "Incident alerting and on-call escalation management." },
  { id: "INT-005", name: "AWS CloudWatch", type: "Logging", status: "Connected", lastSync: "2026-02-12T14:28:00Z", description: "Cloud infrastructure logging and metric collection." },
  { id: "INT-006", name: "Okta SSO", type: "Identity", status: "Error", lastSync: "2026-02-11T16:00:00Z", description: "Single sign-on and identity management integration." },
  { id: "INT-007", name: "Slack Alerts", type: "Webhook", status: "Connected", lastSync: "2026-02-12T14:31:00Z", description: "Real-time security alert notifications to Slack channels." },
  { id: "INT-008", name: "Grafana", type: "Monitoring", status: "Disconnected", lastSync: "2026-02-09T12:00:00Z", description: "Custom dashboarding and metric visualization." },
]

export const connectedAssets = [
  { name: "App Server", host: "srv-app-03.internal", status: "Active" as const },
  { name: "Database", host: "db-prod-eu-01", status: "Active" as const },
  { name: "API Gateway", host: "api-gw-main", status: "Active" as const },
  { name: "RAG Pipeline", host: "rag-prod-01", status: "Warning" as const },
  { name: "Chat Service", host: "chat-svc-02", status: "Active" as const },
]

export const recentIncidents = [
  { id: "INC-0412", type: "Suspicious Login", severity: "High" as const, time: "14:32", asset: "App Server #3", sourceIP: "185.221.xxx", geo: "Eastern Europe", status: "Under Investigation" as const },
  { id: "INC-0411", type: "Injection Detected", severity: "Critical" as const, time: "13:15", asset: "Chat Interface", sourceIP: "103.45.xxx", geo: "Southeast Asia", status: "Active" as const },
  { id: "INC-0410", type: "Data Extraction", severity: "High" as const, time: "11:02", asset: "RAG Pipeline", sourceIP: "45.134.xxx", geo: "South America", status: "Mitigated" as const },
  { id: "INC-0409", type: "Rate Limit Exceeded", severity: "Medium" as const, time: "09:48", asset: "API Gateway", sourceIP: "91.207.xxx", geo: "Central Asia", status: "Resolved" as const },
]

export const settingsData = {
  models: [
    { name: "Injection Classifier v3.2", status: "Active" as const, accuracy: 97.2, latency: 12, lastUpdated: "2026-02-10" },
    { name: "Behavioral Anomaly Detector", status: "Active" as const, accuracy: 94.8, latency: 18, lastUpdated: "2026-02-09" },
    { name: "Semantic Similarity Engine", status: "Active" as const, accuracy: 96.1, latency: 8, lastUpdated: "2026-02-08" },
    { name: "Jailbreak Pattern Matcher", status: "Degraded" as const, accuracy: 91.3, latency: 24, lastUpdated: "2026-02-06" },
  ],
  thresholds: {
    injectionConfidence: 0.85,
    anomalyScoreAlert: 70,
    rateLimitPerMin: 100,
    maxTokensPerSession: 500_000,
    sessionTimeout: 30,
  },
  performance: [
    { time: "00:00", requests: 1200, latency: 11, cpu: 34, memory: 62 },
    { time: "04:00", requests: 800, latency: 9, cpu: 22, memory: 58 },
    { time: "08:00", requests: 3400, latency: 14, cpu: 56, memory: 71 },
    { time: "12:00", requests: 5200, latency: 18, cpu: 72, memory: 78 },
    { time: "16:00", requests: 4800, latency: 16, cpu: 68, memory: 76 },
    { time: "20:00", requests: 2600, latency: 12, cpu: 45, memory: 66 },
  ],
}

export const sessionTimeline = [
  { time: "08:00", sessions: 12, anomalies: 1 },
  { time: "09:00", sessions: 28, anomalies: 3 },
  { time: "10:00", sessions: 45, anomalies: 5 },
  { time: "11:00", sessions: 52, anomalies: 4 },
  { time: "12:00", sessions: 61, anomalies: 8 },
  { time: "13:00", sessions: 48, anomalies: 6 },
  { time: "14:00", sessions: 67, anomalies: 12 },
  { time: "15:00", sessions: 54, anomalies: 7 },
  { time: "16:00", sessions: 42, anomalies: 5 },
]

export const incidentDetails: Record<string, {
  id: string
  type: string
  severity: "Critical" | "High" | "Medium" | "Low"
  status: "Active" | "Mitigated" | "Under Investigation" | "Resolved"
  timestamp: string
  sourceIP: string
  geoLocation: string
  affectedAsset: string
  description: string
  narrative: string
  affectedComponents: string[]
  timeline: { time: string; action: string; actor: string }[]
  recommendations: string[]
}> = {
  "THR-2026-0891": {
    id: "THR-2026-0891",
    type: "Prompt Injection",
    severity: "Critical",
    status: "Active",
    timestamp: "2026-02-12T14:32:00Z",
    sourceIP: "185.221.xxx",
    geoLocation: "Eastern Europe",
    affectedAsset: "App Server #3",
    description: "Context override attempt targeting system prompt extraction via nested instruction injection.",
    narrative: "An adversary operating from Eastern Europe initiated a sophisticated multi-layered prompt injection attack targeting App Server #3. The attacker used nested instruction encoding to bypass input sanitization, attempting to extract the system prompt and underlying model configuration. The injection payload contained base64-encoded override instructions hidden within seemingly benign user queries. Initial detection was triggered by the Injection Classifier v3.2 at 14:32 UTC with a confidence score of 0.96.",
    affectedComponents: ["App Server #3", "LLM Gateway", "Input Sanitizer", "Response Filter"],
    timeline: [
      { time: "14:30:12", action: "Initial suspicious prompt detected", actor: "Injection Classifier" },
      { time: "14:30:14", action: "Prompt flagged - confidence 0.96", actor: "Risk Scoring Engine" },
      { time: "14:30:15", action: "Session anomaly score elevated to 92", actor: "Behavioral Model" },
      { time: "14:32:00", action: "Incident created - THR-2026-0891", actor: "System" },
      { time: "14:32:05", action: "Automated block applied to source IP", actor: "Firewall" },
      { time: "14:35:00", action: "SOC analyst notified via PagerDuty", actor: "Alert System" },
      { time: "14:42:00", action: "Manual investigation initiated", actor: "SOC-Analyst-04" },
    ],
    recommendations: [
      "Block source IP range 185.221.xxx/24 at WAF level",
      "Update injection classifier with new attack pattern signatures",
      "Review and rotate system prompts for affected services",
      "Enable enhanced logging for App Server #3 for 72 hours",
      "Conduct forensic analysis of all sessions from source ASN",
    ],
  },
  "INC-0412": {
    id: "INC-0412",
    type: "Suspicious Login",
    severity: "High",
    status: "Under Investigation",
    timestamp: "2026-02-12T14:32:00Z",
    sourceIP: "185.221.xxx",
    geoLocation: "Eastern Europe",
    affectedAsset: "App Server #3",
    description: "Suspicious login attempt from unrecognized geo-location using valid credentials.",
    narrative: "A login attempt was detected from Eastern Europe using valid credentials for a privileged admin account. The geo-location and device fingerprint do not match any known user patterns. The session exhibited anomalous behavior patterns consistent with credential stuffing or stolen token replay attacks.",
    affectedComponents: ["App Server #3", "Auth Service", "Session Manager"],
    timeline: [
      { time: "14:30:00", action: "Login attempt from new geo-location", actor: "Auth Service" },
      { time: "14:30:02", action: "Device fingerprint mismatch detected", actor: "Behavioral Model" },
      { time: "14:32:00", action: "Incident created", actor: "System" },
      { time: "14:33:00", action: "Session flagged for review", actor: "SOC-Analyst-02" },
    ],
    recommendations: [
      "Force password reset for affected account",
      "Review all sessions from this IP range",
      "Enable additional MFA challenge for admin accounts",
      "Audit recent privilege escalation events",
    ],
  },
}

export const geoThreats = [
  { region: "Eastern Europe", lat: 50.4, lng: 30.5, count: 1240, severity: "Critical" as const },
  { region: "Southeast Asia", lat: 13.7, lng: 100.5, count: 890, severity: "High" as const },
  { region: "South America", lat: -11.2, lng: 17.9, count: 456, severity: "Medium" as const },
  { region: "North America", lat: 40.7, lng: -74.0, count: 234, severity: "Low" as const },
  { region: "Central Asia", lat: 41.3, lng: 69.3, count: 178, severity: "Medium" as const },
]
