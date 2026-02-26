"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { policies, toolPermissions, type Policy } from "@/lib/mock-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Shield, Eye, Ban, ChevronRight } from "lucide-react"

const severityStyles: Record<string, string> = {
  Block: "bg-destructive/15 text-destructive border-destructive/30",
  Warn: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  Log: "bg-primary/15 text-primary border-primary/30",
}

const toolStatusStyles: Record<string, { color: string; icon: React.ElementType }> = {
  Allowed: { color: "text-chart-2", icon: Shield },
  Restricted: { color: "text-chart-3", icon: Eye },
  Blocked: { color: "text-destructive", icon: Ban },
}

const categoryColors: Record<string, string> = {
  Injection: "bg-destructive/10 text-destructive border-destructive/20",
  "Rate Limiting": "bg-chart-3/10 text-chart-3 border-chart-3/20",
  "Tool Access": "bg-primary/10 text-primary border-primary/20",
  "Data Protection": "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Session: "bg-chart-5/10 text-chart-5 border-chart-5/20",
}

export default function PoliciesPage() {
  const [policyState, setPolicyState] = useState<Record<string, boolean>>(
    Object.fromEntries(policies.map((p) => [p.id, p.enabled]))
  )
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)

  const togglePolicy = (id: string) => {
    setPolicyState((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      <TopBar title="Tool & Policy Management" subtitle="Zero-trust enforcement configuration." />

      <div className="flex-1 p-4 grid-bg relative overflow-hidden flex flex-col gap-3">
        <div className="absolute inset-0 scan-line pointer-events-none" />

        {/* Tool Permissions Matrix */}
        <div className="relative glass-card overflow-auto shrink-0 max-h-[35%]">
          <div className="p-4 border-b border-border/50">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Tool Permissions Matrix</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Tool Name</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Scope</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Invocations</TableHead>
                <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Last Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {toolPermissions.map((tool) => {
                const StatusIcon = toolStatusStyles[tool.status].icon
                return (
                  <TableRow key={tool.name} className="border-border/30 hover:bg-secondary/50 transition-colors">
                    <TableCell className="text-xs font-mono text-primary">{tool.name}</TableCell>
                    <TableCell>
                      <span className={cn("inline-flex items-center gap-1.5 text-xs font-mono", toolStatusStyles[tool.status].color)}>
                        <StatusIcon className="h-3 w-3" />
                        {tool.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-foreground/80">{tool.scope}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{tool.invocations.toLocaleString()}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {tool.lastUsed === "Never" ? "Never" : new Date(tool.lastUsed).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Policy Rules */}
        <div className="relative glass-card overflow-auto flex-1 min-h-0">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Policy Rules</h3>
            <span className="text-[10px] font-mono text-muted-foreground">
              {Object.values(policyState).filter(Boolean).length} / {policies.length} active
            </span>
          </div>
          <div className="divide-y divide-border/30">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => setSelectedPolicy(policy)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") setSelectedPolicy(policy) }}
              >
                <Switch
                  checked={policyState[policy.id]}
                  onCheckedChange={() => togglePolicy(policy.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="data-[state=checked]:bg-primary"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-foreground">{policy.name}</span>
                    <Badge variant="outline" className={cn("text-[10px] font-mono px-1.5 py-0", categoryColors[policy.category])}>
                      {policy.category}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{policy.description}</p>
                </div>
                <Badge variant="outline" className={cn("text-[10px] font-mono px-2 py-0.5 border", severityStyles[policy.severity])}>
                  {policy.severity}
                </Badge>
                <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">{policy.lastModified}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Policy Detail Drawer */}
        <Sheet open={!!selectedPolicy} onOpenChange={() => setSelectedPolicy(null)}>
          <SheetContent className="bg-card border-border w-[420px] sm:w-[420px]">
            {selectedPolicy && (
              <>
                <SheetHeader>
                  <SheetTitle className="font-mono text-sm text-foreground">{selectedPolicy.name}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-5">
                  <div className="space-y-3">
                    {[
                      { label: "Policy ID", value: selectedPolicy.id },
                      { label: "Category", value: selectedPolicy.category },
                      { label: "Last Modified", value: selectedPolicy.lastModified },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className="text-xs font-mono font-medium text-foreground">{item.value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Action</span>
                      <Badge variant="outline" className={cn("text-[10px] font-mono px-2 py-0.5 border", severityStyles[selectedPolicy.severity])}>
                        {selectedPolicy.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Status</span>
                      <span className={`text-xs font-mono ${policyState[selectedPolicy.id] ? "text-chart-2" : "text-muted-foreground"}`}>
                        {policyState[selectedPolicy.id] ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Description</span>
                    <p className="text-xs text-foreground/80 leading-relaxed">{selectedPolicy.description}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Policy Impact Preview</span>
                    <div className="space-y-2">
                      {[
                        { label: "Blocked events (7d)", value: selectedPolicy.enabled ? Math.floor(Math.random() * 500 + 100) : 0 },
                        { label: "False positives (7d)", value: selectedPolicy.enabled ? Math.floor(Math.random() * 20 + 2) : 0 },
                        { label: "Affected sessions", value: selectedPolicy.enabled ? Math.floor(Math.random() * 200 + 50) : 0 },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-1.5 px-2 rounded-md bg-secondary/30">
                          <span className="text-xs text-muted-foreground">{item.label}</span>
                          <span className="text-xs font-mono text-foreground">{item.value.toLocaleString()}</span>
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
