import { cn } from "@/lib/utils"

type SeverityLevel = "Critical" | "High" | "Medium" | "Low"

const severityStyles: Record<SeverityLevel, string> = {
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
  High: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  Medium: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  Low: "bg-chart-2/15 text-chart-2 border-chart-2/30",
}

export function SeverityBadge({ severity, className }: { severity: SeverityLevel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-mono font-medium",
        severityStyles[severity],
        className
      )}
    >
      {severity}
    </span>
  )
}
