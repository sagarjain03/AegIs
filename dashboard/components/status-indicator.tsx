import { cn } from "@/lib/utils"

type Status = "Active" | "Mitigated" | "Under Investigation" | "Resolved" | "Connected" | "Disconnected" | "Error" | "Warning"

const statusColors: Record<Status, string> = {
  Active: "bg-chart-2",
  Connected: "bg-chart-2",
  Mitigated: "bg-chart-1",
  "Under Investigation": "bg-chart-3",
  Warning: "bg-chart-3",
  Resolved: "bg-muted-foreground",
  Disconnected: "bg-muted-foreground",
  Error: "bg-destructive",
}

export function StatusIndicator({ status, showLabel = true, className }: { status: Status; showLabel?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}>
      <span className={cn("h-2 w-2 rounded-full", statusColors[status])} style={{ animation: status === "Active" || status === "Connected" ? "pulse-glow 2s ease-in-out infinite" : undefined }} />
      {showLabel && <span className="text-foreground/80">{status}</span>}
    </span>
  )
}
