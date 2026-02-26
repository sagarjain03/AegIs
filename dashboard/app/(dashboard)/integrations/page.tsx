"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { integrations, type Integration } from "@/lib/mock-data"
import { StatusIndicator } from "@/components/status-indicator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  ShieldCheck,
  ScrollText,
  Webhook,
  Activity,
  Fingerprint,
  Settings2,
  RefreshCw,
} from "lucide-react"

const typeIcons: Record<string, React.ElementType> = {
  SIEM: ShieldCheck,
  Logging: ScrollText,
  Webhook: Webhook,
  Monitoring: Activity,
  Identity: Fingerprint,
}

const typeColors: Record<string, string> = {
  SIEM: "bg-primary/10 text-primary border-primary/20",
  Logging: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Webhook: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  Monitoring: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  Identity: "bg-chart-4/10 text-chart-4 border-chart-4/20",
}

export default function IntegrationsPage() {
  const [configuring, setConfiguring] = useState<Integration | null>(null)

  return (
    <>
      <TopBar title="Integrations" subtitle="Connect external systems." />

      <div className="flex-1 p-4 grid-bg relative overflow-hidden flex flex-col gap-3">
        <div className="absolute inset-0 scan-line pointer-events-none" />

        {/* Stats */}
        <div className="relative grid grid-cols-4 gap-3 shrink-0">
          {[
            { label: "Connected", value: integrations.filter((i) => i.status === "Connected").length, color: "text-chart-2" },
            { label: "Disconnected", value: integrations.filter((i) => i.status === "Disconnected").length, color: "text-muted-foreground" },
            { label: "Error", value: integrations.filter((i) => i.status === "Error").length, color: "text-destructive" },
            { label: "Total", value: integrations.length, color: "text-primary" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              <span className={cn("text-2xl font-mono font-bold", stat.color)}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Integration Cards Grid */}
        <div className="relative grid grid-cols-2 gap-3 flex-1 min-h-0 overflow-auto">
          {integrations.map((integration) => {
            const TypeIcon = typeIcons[integration.type] || Activity
            return (
              <div key={integration.id} className="glass-card p-5 space-y-4 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary border border-border/50">
                      <TypeIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{integration.name}</h3>
                      <Badge variant="outline" className={cn("text-[10px] font-mono px-1.5 py-0 mt-1", typeColors[integration.type])}>
                        {integration.type}
                      </Badge>
                    </div>
                  </div>
                  <StatusIndicator status={integration.status} />
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{integration.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Last sync: {new Date(integration.lastSync).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5 text-[10px] font-mono border-border text-muted-foreground hover:text-foreground"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Sync
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5 text-[10px] font-mono border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => setConfiguring(integration)}
                    >
                      <Settings2 className="h-3 w-3" />
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Configuration Modal */}
        <Dialog open={!!configuring} onOpenChange={() => setConfiguring(null)}>
          <DialogContent className="bg-card border-border">
            {configuring && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-mono text-sm text-foreground">Configure {configuring.name}</DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Update connection settings for {configuring.name} integration.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-mono text-muted-foreground">API Endpoint</Label>
                    <Input
                      placeholder="https://api.example.com/v1"
                      className="h-8 text-xs font-mono bg-secondary border-border"
                      defaultValue={`https://api.${configuring.name.toLowerCase().replace(/\s/g, "-")}.com/v1`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-mono text-muted-foreground">API Key</Label>
                    <Input
                      type="password"
                      placeholder="Enter API key..."
                      className="h-8 text-xs font-mono bg-secondary border-border"
                      defaultValue="sk-xxxx-xxxx-xxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-mono text-muted-foreground">Webhook URL</Label>
                    <Input
                      placeholder="https://hooks.example.com/aegis"
                      className="h-8 text-xs font-mono bg-secondary border-border"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 font-mono text-xs border-border text-muted-foreground"
                      onClick={() => setConfiguring(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 font-mono text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setConfiguring(null)}
                    >
                      Save Configuration
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
