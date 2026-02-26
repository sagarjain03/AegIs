"use client"

import { recentIncidents } from "@/lib/mock-data"
import { SeverityBadge } from "@/components/severity-badge"
import { StatusIndicator } from "@/components/status-indicator"
import { Button } from "@/components/ui/button"
import { Scan, ChevronRight } from "lucide-react"
import Link from "next/link"

export function IncidentPanel() {
  const incident = recentIncidents[0]

  return (
    <div className="glass-card p-4 space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-destructive" style={{ animation: "pulse-glow 2s ease-in-out infinite" }} />
          <span className="text-xs font-mono font-bold text-foreground">Incident</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">[ 2026/02/12 ]</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Threat Type</span>
          <span className="text-xs font-mono font-medium text-foreground">{incident.type}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Affected Asset</span>
          <span className="text-xs font-mono text-foreground">{incident.asset}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Source IP</span>
          <span className="text-xs font-mono text-foreground">[{incident.sourceIP}]</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Geo Location</span>
          <span className="text-xs font-mono text-foreground">{incident.geo}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Severity</span>
          <SeverityBadge severity={incident.severity} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Status</span>
          <StatusIndicator status={incident.status} />
        </div>
      </div>

      <Button className="w-full gap-2 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 font-mono text-xs" variant="outline" size="sm">
        <Scan className="h-3.5 w-3.5" />
        Run Sentinel Scan
      </Button>

      <div className="pt-2 border-t border-border/50">
        <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Recent Incidents</h4>
        <div className="space-y-2">
          {recentIncidents.slice(1).map((inc) => (
            <Link
              key={inc.id}
              href={`/incidents/${inc.id}`}
              className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-secondary/50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <SeverityBadge severity={inc.severity} />
                <span className="text-xs font-mono text-foreground/80">{inc.type}</span>
              </div>
              <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
