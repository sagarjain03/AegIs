"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { SeverityBadge } from "@/components/severity-badge"
import { sessions, sessionTimeline, behaviorData } from "@/lib/mock-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart } from "recharts"
import type { Session } from "@/lib/mock-data"

const tooltipStyle = {
  background: "oklch(0.16 0.02 250)",
  border: "1px solid oklch(0.25 0.02 250)",
  borderRadius: "6px",
  fontSize: "11px",
  fontFamily: "monospace",
  color: "oklch(0.93 0.01 220)",
}

export default function ActivityPage() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)

  return (
    <>
      <TopBar title="Activity & Session Logs" subtitle="Track user and AI behavior over time." />

      <div className="flex-1 p-4 grid-bg relative overflow-hidden flex flex-col gap-3">
        <div className="absolute inset-0 scan-line pointer-events-none" />

        {/* Charts Row */}
        <div className="relative grid grid-cols-3 gap-3 shrink-0">
          {/* Session Timeline */}
          <div className="glass-card p-4">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Session Timeline</h3>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={sessionTimeline} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.15 195)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.72 0.15 195)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="sessions" stroke="oklch(0.72 0.15 195)" fill="url(#sessionGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="anomalies" stroke="oklch(0.60 0.22 25)" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Prompt Frequency */}
          <div className="glass-card p-4">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Prompt Frequency</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={behaviorData.promptFrequency} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="oklch(0.72 0.15 195)" radius={[2, 2, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Token Usage */}
          <div className="glass-card p-4">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Token Usage Trend</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={behaviorData.tokenUsageTrend} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${(value / 1_000_000).toFixed(2)}M tokens`, "Usage"]} />
                <Line type="monotone" dataKey="tokens" stroke="oklch(0.70 0.18 155)" strokeWidth={2} dot={{ fill: "oklch(0.70 0.18 155)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Session Table */}
        <div className="relative glass-card overflow-auto flex-1 min-h-0">
          <div className="p-4 border-b border-border/50">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Active Sessions</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Session ID</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">User</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Entity</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Prompts</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Anomaly Score</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Risk Level</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Duration</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Tokens</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow
                  key={session.id}
                  className="border-border/30 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => setSelectedSession(session)}
                >
                  <TableCell className="text-xs font-mono text-primary">{session.id}</TableCell>
                  <TableCell className="text-xs font-mono text-foreground">{session.userId}</TableCell>
                  <TableCell className="text-xs font-mono text-foreground/80">{session.entity}</TableCell>
                  <TableCell className="text-xs font-mono text-foreground">{session.promptCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={session.anomalyScore}
                        className="h-1.5 w-16 bg-secondary"
                      />
                      <span className={`text-xs font-mono ${session.anomalyScore >= 80 ? "text-destructive" : session.anomalyScore >= 60 ? "text-chart-3" : "text-muted-foreground"}`}>
                        {session.anomalyScore}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell><SeverityBadge severity={session.riskLevel} /></TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{session.duration}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{session.tokenUsage.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Session Detail Drawer */}
        <Sheet open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <SheetContent className="bg-card border-border w-[420px] sm:w-[420px]">
            {selectedSession && (
              <>
                <SheetHeader>
                  <SheetTitle className="font-mono text-sm text-foreground">{selectedSession.id}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-5">
                  <div className="space-y-3">
                    {[
                      { label: "User ID", value: selectedSession.userId },
                      { label: "Entity", value: selectedSession.entity },
                      { label: "Prompt Count", value: String(selectedSession.promptCount) },
                      { label: "Duration", value: selectedSession.duration },
                      { label: "Token Usage", value: selectedSession.tokenUsage.toLocaleString() },
                      { label: "Start Time", value: new Date(selectedSession.startTime).toLocaleString() },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className="text-xs font-mono font-medium text-foreground">{item.value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Risk Level</span>
                      <SeverityBadge severity={selectedSession.riskLevel} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Anomaly Score</span>
                    <div className="flex items-center gap-3">
                      <Progress value={selectedSession.anomalyScore} className="h-2 flex-1 bg-secondary" />
                      <span className={`text-sm font-mono font-bold ${selectedSession.anomalyScore >= 80 ? "text-destructive" : selectedSession.anomalyScore >= 60 ? "text-chart-3" : "text-chart-2"}`}>
                        {selectedSession.anomalyScore}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Behavioral Indicators</span>
                    <div className="space-y-2">
                      {[
                        { label: "Prompt Velocity", value: selectedSession.anomalyScore > 70 ? "Elevated" : "Normal", alert: selectedSession.anomalyScore > 70 },
                        { label: "Semantic Deviation", value: selectedSession.anomalyScore > 60 ? "High" : "Low", alert: selectedSession.anomalyScore > 60 },
                        { label: "Token Spike", value: selectedSession.tokenUsage > 200_000 ? "Detected" : "None", alert: selectedSession.tokenUsage > 200_000 },
                      ].map((ind) => (
                        <div key={ind.label} className="flex items-center justify-between py-1.5 px-2 rounded-md bg-secondary/30">
                          <span className="text-xs text-muted-foreground">{ind.label}</span>
                          <span className={`text-xs font-mono ${ind.alert ? "text-chart-3" : "text-chart-2"}`}>{ind.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
