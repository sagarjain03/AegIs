"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { threats, type Threat, threatTrend } from "@/lib/mock-data"
import { SeverityBadge } from "@/components/severity-badge"
import { StatusIndicator } from "@/components/status-indicator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ExternalLink, Scan, Flag, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ThreatsPage() {
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null)
  const [severityFilter, setSeverityFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filtered = threats.filter((t) => {
    if (severityFilter !== "all" && t.severity !== severityFilter) return false
    if (typeFilter !== "all" && t.type !== typeFilter) return false
    return true
  })

  return (
    <>
      <TopBar title="Threat Intelligence" subtitle="Analyze detected attacks and threats." />

      <div className="flex-1 p-4 grid-bg relative overflow-hidden flex flex-col gap-3">
        <div className="absolute inset-0 scan-line pointer-events-none" />

        {/* Threat Timeline */}
        <div className="relative glass-card p-3 shrink-0">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Threat Timeline</h3>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={threatTrend} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px", fontFamily: "monospace", color: "var(--foreground)" }}
              />
              <Bar dataKey="blocked" stackId="a" fill="var(--primary)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="incidents" stackId="a" fill="var(--destructive)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Filters */}
        <div className="relative flex gap-3 shrink-0">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40 h-8 text-xs font-mono bg-secondary border-border">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all" className="text-xs font-mono">All Severities</SelectItem>
              <SelectItem value="Critical" className="text-xs font-mono">Critical</SelectItem>
              <SelectItem value="High" className="text-xs font-mono">High</SelectItem>
              <SelectItem value="Medium" className="text-xs font-mono">Medium</SelectItem>
              <SelectItem value="Low" className="text-xs font-mono">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 h-8 text-xs font-mono bg-secondary border-border">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all" className="text-xs font-mono">All Types</SelectItem>
              <SelectItem value="Injection" className="text-xs font-mono">Injection</SelectItem>
              <SelectItem value="Jailbreak" className="text-xs font-mono">Jailbreak</SelectItem>
              <SelectItem value="Extraction" className="text-xs font-mono">Extraction</SelectItem>
              <SelectItem value="Probing" className="text-xs font-mono">Probing</SelectItem>
              <SelectItem value="Bot Abuse" className="text-xs font-mono">Bot Abuse</SelectItem>
              <SelectItem value="Data Harvesting" className="text-xs font-mono">Data Harvesting</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Threat Table */}
        <div className="relative glass-card overflow-auto flex-1 min-h-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">ID</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Type</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Severity</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Source</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Asset</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Time</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground sr-only">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((threat) => (
                <TableRow
                  key={threat.id}
                  className="border-border/30 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => setSelectedThreat(threat)}
                >
                  <TableCell className="text-xs font-mono text-primary">{threat.id}</TableCell>
                  <TableCell className="text-xs font-mono text-foreground">{threat.type}</TableCell>
                  <TableCell><SeverityBadge severity={threat.severity} /></TableCell>
                  <TableCell><StatusIndicator status={threat.status} /></TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{threat.sourceIP}</TableCell>
                  <TableCell className="text-xs font-mono text-foreground/80">{threat.affectedAsset}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{new Date(threat.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</TableCell>
                  <TableCell>
                    <Link href={`/incidents/${threat.id}`} className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Threat Detail Drawer */}
        <Sheet open={!!selectedThreat} onOpenChange={() => setSelectedThreat(null)}>
          <SheetContent className="bg-card border-border w-[420px] sm:w-[420px]">
            {selectedThreat && (
              <>
                <SheetHeader>
                  <SheetTitle className="font-mono text-sm text-foreground">{selectedThreat.id}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Type</span>
                      <span className="text-xs font-mono font-medium text-foreground">{selectedThreat.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Severity</span>
                      <SeverityBadge severity={selectedThreat.severity} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Status</span>
                      <StatusIndicator status={selectedThreat.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Source IP</span>
                      <span className="text-xs font-mono text-foreground">{selectedThreat.sourceIP}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Geo Location</span>
                      <span className="text-xs font-mono text-foreground">{selectedThreat.geoLocation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Affected Asset</span>
                      <span className="text-xs font-mono text-foreground">{selectedThreat.affectedAsset}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Timestamp</span>
                      <span className="text-xs font-mono text-foreground">{new Date(selectedThreat.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Description</span>
                    <p className="text-xs text-foreground/80 leading-relaxed">{selectedThreat.description}</p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button size="sm" className="flex-1 gap-2 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 font-mono text-xs" variant="outline">
                      <Scan className="h-3.5 w-3.5" />
                      Scan
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
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
