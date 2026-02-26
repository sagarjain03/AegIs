"use client"

import { TopBar } from "@/components/top-bar"
import { behaviorData } from "@/lib/mock-data"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, ScatterChart, Scatter, ZAxis, Cell } from "recharts"

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  fontSize: "11px",
  fontFamily: "monospace",
  color: "var(--foreground)",
}

const clusterColors: Record<string, string> = {
  Normal: "oklch(0.70 0.18 155)",
  Suspicious: "oklch(0.78 0.16 85)",
  Malicious: "oklch(0.60 0.22 25)",
}

const distributionColors = [
  "oklch(0.70 0.18 155)",
  "oklch(0.72 0.15 195)",
  "oklch(0.78 0.16 85)",
  "oklch(0.60 0.22 25)",
  "oklch(0.55 0.25 25)",
]

// Spike detection data
const spikeData = [
  { time: "00:00", value: 12, spike: false },
  { time: "02:00", value: 8, spike: false },
  { time: "04:00", value: 6, spike: false },
  { time: "06:00", value: 15, spike: false },
  { time: "08:00", value: 45, spike: false },
  { time: "10:00", value: 78, spike: true },
  { time: "12:00", value: 92, spike: true },
  { time: "14:00", value: 145, spike: true },
  { time: "16:00", value: 67, spike: false },
  { time: "18:00", value: 34, spike: false },
  { time: "20:00", value: 22, spike: false },
  { time: "22:00", value: 14, spike: false },
]

// Similarity data
const similarityGroups = [
  { pattern: "System prompt extraction", count: 23, similarity: 94.2, risk: "Critical" as const },
  { pattern: "Roleplay jailbreak", count: 18, similarity: 87.5, risk: "High" as const },
  { pattern: "Data enumeration", count: 15, similarity: 91.8, risk: "High" as const },
  { pattern: "Token boundary probing", count: 11, similarity: 82.3, risk: "Medium" as const },
  { pattern: "Output manipulation", count: 8, similarity: 76.9, risk: "Medium" as const },
  { pattern: "Encoding bypass", count: 6, similarity: 89.1, risk: "High" as const },
]

const riskColors: Record<string, string> = {
  Critical: "text-destructive",
  High: "text-chart-4",
  Medium: "text-chart-3",
}

export default function BehaviorPage() {
  // Calculate AI abuse probability
  const abuseProbability = 67.3

  return (
    <>
      <TopBar title="Behavioral Analytics" subtitle="UEBA-style anomaly detection insights." />

      <div className="flex-1 p-4 grid-bg relative overflow-hidden flex flex-col gap-3">
        <div className="absolute inset-0 scan-line pointer-events-none" />

        {/* Top Row */}
        <div className="relative grid grid-cols-12 gap-3 flex-1 min-h-0">
          {/* Anomaly Score Distribution */}
          <div className="col-span-4 glass-card p-4">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Anomaly Score Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={behaviorData.anomalyDistribution} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {behaviorData.anomalyDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={distributionColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {behaviorData.anomalyDistribution.map((item, i) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: distributionColors[i] }} />
                  <span className="text-[10px] font-mono text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Behavioral Clusters */}
          <div className="col-span-4 glass-card p-4">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Behavioral Clusters</h3>
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                <XAxis type="number" dataKey="x" tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} name="Frequency" />
                <YAxis type="number" dataKey="y" tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} name="Deviation" />
                <ZAxis type="number" dataKey="size" range={[40, 400]} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number, name: string) => {
                    if (name === "x") return [value, "Frequency"]
                    if (name === "y") return [value, "Deviation"]
                    return [value, name]
                  }}
                  labelFormatter={() => ""}
                />
                <Scatter data={behaviorData.clusterData}>
                  {behaviorData.clusterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={clusterColors[entry.cluster] || "#22d3ee"} fillOpacity={0.7} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 justify-center">
              {Object.entries(clusterColors).map(([label, color]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Abuse Gauge */}
          <div className="col-span-4 glass-card p-4 flex flex-col">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">AI Abuse Probability</h3>
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="relative h-40 w-40">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="oklch(0.20 0.02 250)" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={abuseProbability > 70 ? "oklch(0.60 0.22 25)" : abuseProbability > 40 ? "oklch(0.78 0.16 85)" : "oklch(0.70 0.18 155)"}
                    strokeWidth="8"
                    strokeDasharray={`${(abuseProbability / 100) * 314.16} 314.16`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-mono font-bold ${abuseProbability > 70 ? "text-destructive" : abuseProbability > 40 ? "text-chart-3" : "text-chart-2"}`}>
                    {abuseProbability}%
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">Probability</span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-mono text-chart-3">Elevated Risk</span>
                <p className="text-[10px] text-muted-foreground mt-1">Based on 2,909 analyzed sessions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="relative grid grid-cols-12 gap-3 flex-1 min-h-0">
          {/* Spike Detection */}
          <div className="col-span-6 glass-card p-4">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Spike Detection</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={spikeData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="oklch(0.72 0.15 195)"
                  strokeWidth={2}
                  dot={(props: { cx: number; cy: number; index: number }) => {
                    const isSpike = spikeData[props.index]?.spike
                    return (
                      <circle
                        key={props.index}
                        cx={props.cx}
                        cy={props.cy}
                        r={isSpike ? 5 : 3}
                        fill={isSpike ? "oklch(0.60 0.22 25)" : "oklch(0.72 0.15 195)"}
                        stroke={isSpike ? "oklch(0.60 0.22 25)" : "none"}
                        strokeWidth={isSpike ? 2 : 0}
                        opacity={isSpike ? 1 : 0.6}
                      />
                    )
                  }}
                />
                {/* Threshold line */}
                <Line
                  type="monotone"
                  dataKey={() => 70}
                  stroke="oklch(0.60 0.22 25)"
                  strokeWidth={1}
                  strokeDasharray="6 3"
                  dot={false}
                  name="Threshold"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "oklch(0.60 0.22 25)" }} />
                <span className="text-[10px] font-mono text-muted-foreground">Spike Detected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-0.5 w-4" style={{ backgroundColor: "oklch(0.60 0.22 25)", opacity: 0.6 }} />
                <span className="text-[10px] font-mono text-muted-foreground">Threshold (70)</span>
              </div>
            </div>
          </div>

          {/* Prompt Similarity Detection */}
          <div className="col-span-6 glass-card p-4">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Repeated Prompt Similarity Detection</h3>
            <div className="space-y-2">
              {similarityGroups.map((group) => (
                <div key={group.pattern} className="flex items-center gap-3 py-2 px-3 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono text-foreground">{group.pattern}</span>
                    <div className="flex gap-4 mt-1">
                      <span className="text-[10px] text-muted-foreground">{group.count} instances</span>
                      <span className="text-[10px] text-muted-foreground">{group.similarity}% similar</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${group.similarity}%`,
                          backgroundColor: group.risk === "Critical" ? "oklch(0.60 0.22 25)" : group.risk === "High" ? "oklch(0.78 0.16 85)" : "oklch(0.72 0.15 195)",
                        }}
                      />
                    </div>
                    <span className={`text-xs font-mono ${riskColors[group.risk]}`}>{group.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
