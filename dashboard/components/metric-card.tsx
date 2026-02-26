import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: { value: number; label: string }
  className?: string
  accentColor?: string
}

export function MetricCard({ title, value, icon: Icon, trend, className, accentColor = "text-primary" }: MetricCardProps) {
  return (
    <div className={cn("glass-card p-4 flex flex-col gap-3 group hover:border-primary/30 transition-colors", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{title}</span>
        <Icon className={cn("h-4 w-4", accentColor)} />
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-mono font-bold text-foreground tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {trend && (
          <span className={cn("text-xs font-mono", trend.value >= 0 ? "text-destructive" : "text-chart-2")}>
            {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
          </span>
        )}
      </div>
    </div>
  )
}
