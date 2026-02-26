"use client"

const barData = [
  { label: "Failed Login", values: [8, 9, 7, 10, 8, 9, 10, 7, 8, 9], color: "bg-destructive" },
  { label: "Suspicious Req.", values: [6, 8, 9, 7, 10, 8, 9, 10, 7, 9], color: "bg-chart-3" },
  { label: "Blocked Attacks", values: [9, 10, 8, 9, 10, 9, 10, 9, 10, 8], color: "bg-primary" },
]

export function RiskBars() {
  return (
    <div className="glass-card p-4">
      <div className="space-y-3">
        {barData.map((item) => (
          <div key={item.label} className="space-y-1">
            <span className="text-xs font-mono text-muted-foreground">{item.label}</span>
            <div className="flex gap-0.5">
              {item.values.map((v, i) => (
                <div
                  key={i}
                  className={`h-4 w-2 rounded-sm ${item.color}`}
                  style={{ opacity: v / 10 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
