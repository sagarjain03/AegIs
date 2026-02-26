"use client"

import { threatTrend } from "@/lib/mock-data"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export function ThreatTrendChart() {
  return (
    <div className="glass-card p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-lg font-mono font-bold text-chart-2">+21.74%</span>
          <p className="text-xs text-muted-foreground font-mono">Threat activity - Last 30d</p>
        </div>
        <div className="flex gap-1">
          {["1M", "3M", "6M", "YTD", "All"].map((range) => (
            <button
              key={range}
              className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                range === "1M"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={threatTrend} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.72 0.15 195)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="oklch(0.72 0.15 195)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.70 0.18 155)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="oklch(0.70 0.18 155)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "oklch(0.60 0.02 250)" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "oklch(0.16 0.02 250)",
              border: "1px solid oklch(0.25 0.02 250)",
              borderRadius: "6px",
              fontSize: "11px",
              fontFamily: "monospace",
              color: "oklch(0.93 0.01 220)",
            }}
          />
          <Area type="monotone" dataKey="threats" stroke="oklch(0.72 0.15 195)" fill="url(#threatGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="blocked" stroke="oklch(0.70 0.18 155)" fill="url(#blockedGrad)" strokeWidth={1.5} strokeDasharray="4 2" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
