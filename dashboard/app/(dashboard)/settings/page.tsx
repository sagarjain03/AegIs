"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { settingsData } from "@/lib/mock-data"
import { StatusIndicator } from "@/components/status-indicator"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, BarChart } from "recharts"
import { RefreshCw, Cpu, Gauge, Clock, HardDrive } from "lucide-react"

const tooltipStyle = {
  background: "oklch(0.16 0.02 250)",
  border: "1px solid oklch(0.25 0.02 250)",
  borderRadius: "6px",
  fontSize: "11px",
  fontFamily: "monospace",
  color: "oklch(0.93 0.01 220)",
}

export default function SettingsPage() {
  const [thresholds, setThresholds] = useState(settingsData.thresholds)

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Settings & System Health" subtitle="System configuration & monitoring." />

      <div className="flex-1 p-6 space-y-6 grid-bg relative">
        <div className="absolute inset-0 scan-line pointer-events-none" />

        {/* AI Model Status */}
        <div className="relative glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">AI Model Status</h3>
            <Button variant="outline" size="sm" className="h-7 gap-1.5 text-[10px] font-mono border-primary/30 text-primary hover:bg-primary/10">
              <RefreshCw className="h-3 w-3" />
              Refresh All
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {settingsData.models.map((model) => (
              <div key={model.name} className="bg-secondary/30 rounded-lg p-4 space-y-3 border border-border/30">
                <div className="flex items-center justify-between">
                  <Cpu className="h-4 w-4 text-primary" />
                  <StatusIndicator status={model.status === "Active" ? "Active" : "Warning"} />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-foreground">{model.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">Updated {model.lastUpdated}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground">Accuracy</span>
                    <p className="text-sm font-mono font-bold text-chart-2">{model.accuracy}%</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">Latency</span>
                    <p className="text-sm font-mono font-bold text-primary">{model.latency}ms</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Grid */}
        <div className="relative grid grid-cols-12 gap-4">
          {/* Detection Thresholds */}
          <div className="col-span-5 glass-card p-5 space-y-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Detection Thresholds</h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Injection Confidence</Label>
                  <span className="text-xs font-mono text-primary">{thresholds.injectionConfidence}</span>
                </div>
                <Slider
                  value={[thresholds.injectionConfidence * 100]}
                  max={100}
                  step={1}
                  onValueChange={([v]) => setThresholds((prev) => ({ ...prev, injectionConfidence: v / 100 }))}
                  className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Anomaly Score Alert</Label>
                  <span className="text-xs font-mono text-chart-3">{thresholds.anomalyScoreAlert}</span>
                </div>
                <Slider
                  value={[thresholds.anomalyScoreAlert]}
                  max={100}
                  step={1}
                  onValueChange={([v]) => setThresholds((prev) => ({ ...prev, anomalyScoreAlert: v }))}
                  className="[&_[role=slider]]:bg-chart-3 [&_[role=slider]]:border-chart-3"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Rate Limit (req/min)</Label>
                  <span className="text-xs font-mono text-foreground">{thresholds.rateLimitPerMin}</span>
                </div>
                <Slider
                  value={[thresholds.rateLimitPerMin]}
                  max={500}
                  step={10}
                  onValueChange={([v]) => setThresholds((prev) => ({ ...prev, rateLimitPerMin: v }))}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Max Tokens/Session</Label>
                  <span className="text-xs font-mono text-foreground">{(thresholds.maxTokensPerSession / 1000).toFixed(0)}K</span>
                </div>
                <Slider
                  value={[thresholds.maxTokensPerSession / 1000]}
                  max={1000}
                  step={10}
                  onValueChange={([v]) => setThresholds((prev) => ({ ...prev, maxTokensPerSession: v * 1000 }))}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Session Timeout (min)</Label>
                  <span className="text-xs font-mono text-foreground">{thresholds.sessionTimeout}m</span>
                </div>
                <Slider
                  value={[thresholds.sessionTimeout]}
                  max={120}
                  step={5}
                  onValueChange={([v]) => setThresholds((prev) => ({ ...prev, sessionTimeout: v }))}
                />
              </div>
              <Button size="sm" className="w-full font-mono text-xs bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                Apply Changes
              </Button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="col-span-7 space-y-4">
            {/* Request Volume */}
            <div className="glass-card p-4">
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Request Volume & Latency</h3>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={settingsData.performance} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.15 195)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="oklch(0.72 0.15 195)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area yAxisId="left" type="monotone" dataKey="requests" stroke="oklch(0.72 0.15 195)" fill="url(#reqGrad)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="latency" stroke="oklch(0.78 0.16 85)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-mono text-muted-foreground">Requests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 bg-chart-3" />
                  <span className="text-[10px] font-mono text-muted-foreground">Latency (ms)</span>
                </div>
              </div>
            </div>

            {/* CPU & Memory */}
            <div className="glass-card p-4">
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">CPU & Memory Usage</h3>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={settingsData.performance} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="cpu" fill="oklch(0.72 0.15 195)" radius={[2, 2, 0, 0]} opacity={0.8} name="CPU %" />
                  <Bar dataKey="memory" fill="oklch(0.70 0.18 155)" radius={[2, 2, 0, 0]} opacity={0.6} name="Memory %" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-mono text-muted-foreground">CPU</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-chart-2" />
                  <span className="text-[10px] font-mono text-muted-foreground">Memory</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="relative grid grid-cols-4 gap-4">
          {[
            { label: "Uptime", value: "99.97%", sublabel: "Last 30 days", icon: Clock, color: "text-chart-2" },
            { label: "Avg Latency", value: "13ms", sublabel: "P99: 42ms", icon: Gauge, color: "text-primary" },
            { label: "CPU Usage", value: "49.5%", sublabel: "Peak: 72%", icon: Cpu, color: "text-chart-3" },
            { label: "Storage", value: "2.4 TB", sublabel: "of 5 TB", icon: HardDrive, color: "text-chart-5" },
          ].map((item) => (
            <div key={item.label} className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{item.label}</span>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <p className={`text-xl font-mono font-bold ${item.color}`}>{item.value}</p>
              <p className="text-[10px] font-mono text-muted-foreground">{item.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
