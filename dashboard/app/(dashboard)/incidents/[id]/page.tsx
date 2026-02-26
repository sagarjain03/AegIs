"use client"

import { use } from "react"
import { TopBar } from "@/components/top-bar"
import { SeverityBadge } from "@/components/severity-badge"
import { StatusIndicator } from "@/components/status-indicator"
import { incidentDetails, threats } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Scan, Flag, CheckCircle2, AlertTriangle, Clock, Server, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  // Try incidentDetails first, then fall back to threats data
  const incident = incidentDetails[id] || (() => {
    const threat = threats.find((t) => t.id === id)
    if (!threat) return null
    return {
      id: threat.id,
      type: threat.type,
      severity: threat.severity,
      status: threat.status,
      timestamp: threat.timestamp,
      sourceIP: threat.sourceIP,
      geoLocation: threat.geoLocation,
      affectedAsset: threat.affectedAsset,
      description: threat.description,
      narrative: threat.description + " Further investigation is required to determine the full scope and impact of this incident.",
      affectedComponents: [threat.affectedAsset, "LLM Gateway", "Input Filter"],
      timeline: [
        { time: new Date(threat.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), action: "Threat detected by automated classifier", actor: "System" },
        { time: new Date(new Date(threat.timestamp).getTime() + 120000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), action: "Incident created and flagged", actor: "Risk Engine" },
        { time: new Date(new Date(threat.timestamp).getTime() + 300000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), action: "SOC analyst notified", actor: "Alert System" },
      ],
      recommendations: [
        "Block source IP at WAF level",
        "Review affected asset logs for the last 24 hours",
        "Update detection rules based on attack pattern",
        "Notify security team for manual review",
      ],
    }
  })()

  if (!incident) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar title="Incident Not Found" />
        <div className="flex-1 flex items-center justify-center grid-bg">
          <div className="glass-card p-8 text-center space-y-4">
            <AlertTriangle className="h-8 w-8 text-chart-3 mx-auto" />
            <p className="text-sm font-mono text-foreground">Incident {id} not found</p>
            <Link href="/threats">
              <Button variant="outline" size="sm" className="gap-2 font-mono text-xs border-primary/30 text-primary hover:bg-primary/10">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Threats
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title={`Incident ${incident.id}`} subtitle={incident.type} />

      <div className="flex-1 p-6 space-y-6 grid-bg relative">
        <div className="absolute inset-0 scan-line pointer-events-none" />

        {/* Back button */}
        <div className="relative">
          <Link href="/threats">
            <Button variant="ghost" size="sm" className="gap-2 font-mono text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Threats
            </Button>
          </Link>
        </div>

        {/* Top Grid */}
        <div className="relative grid grid-cols-12 gap-4">
          {/* Incident Metadata */}
          <div className="col-span-4 glass-card p-5 space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Incident Metadata</h3>
            <div className="space-y-3">
              {[
                { label: "Incident ID", value: incident.id },
                { label: "Threat Type", value: incident.type },
                { label: "Source IP", value: `[${incident.sourceIP}]` },
                { label: "Geo Location", value: incident.geoLocation },
                { label: "Affected Asset", value: incident.affectedAsset },
                { label: "Timestamp", value: new Date(incident.timestamp).toLocaleString() },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-xs font-mono font-medium text-foreground">{item.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Severity</span>
                <SeverityBadge severity={incident.severity} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <StatusIndicator status={incident.status} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-border/50">
              <Button size="sm" className="flex-1 gap-2 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 font-mono text-xs" variant="outline">
                <Scan className="h-3.5 w-3.5" />
                Run Scan
              </Button>
              <Button size="sm" className="flex-1 gap-2 bg-chart-3/10 text-chart-3 border border-chart-3/30 hover:bg-chart-3/20 font-mono text-xs" variant="outline">
                <Flag className="h-3.5 w-3.5" />
                Escalate
              </Button>
              <Button size="sm" className="flex-1 gap-2 bg-chart-2/10 text-chart-2 border border-chart-2/30 hover:bg-chart-2/20 font-mono text-xs" variant="outline">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Resolve
              </Button>
            </div>
          </div>

          {/* Threat Narrative */}
          <div className="col-span-8 glass-card p-5 space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Threat Narrative Summary</h3>
            <p className="text-xs text-foreground/80 leading-relaxed">{incident.narrative}</p>

            {/* Affected Components */}
            <div className="pt-4 border-t border-border/50 space-y-3">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Affected AI Components</h4>
              <div className="flex flex-wrap gap-2">
                {incident.affectedComponents.map((component) => (
                  <div key={component} className="flex items-center gap-2 py-1.5 px-3 rounded-md bg-secondary/50 border border-border/50">
                    <Server className="h-3 w-3 text-primary" />
                    <span className="text-xs font-mono text-foreground">{component}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="relative grid grid-cols-12 gap-4">
          {/* Timeline */}
          <div className="col-span-7 glass-card p-5 space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Timeline of Actions</h3>
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/50" />
              <div className="space-y-4">
                {incident.timeline.map((event, i) => (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div className={`relative z-10 mt-0.5 h-3.5 w-3.5 rounded-full border-2 ${i === 0 ? "bg-primary border-primary" : "bg-card border-border"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] font-mono text-muted-foreground">{event.time}</span>
                        <span className="text-[10px] font-mono text-primary/60">{event.actor}</span>
                      </div>
                      <p className="text-xs text-foreground/80 mt-1">{event.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="col-span-5 glass-card p-5 space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Recommended Response Steps</h3>
            <div className="space-y-2">
              {incident.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-md bg-secondary/30">
                  <span className="text-xs font-mono text-primary font-bold mt-px">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs text-foreground/80 leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
