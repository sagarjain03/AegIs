"use client"

import { connectedAssets } from "@/lib/mock-data"
import { StatusIndicator } from "@/components/status-indicator"
import { Server, Database, Globe, Cpu, MessageSquare } from "lucide-react"

const assetIcons: Record<string, React.ElementType> = {
  "App Server": Server,
  "Database": Database,
  "API Gateway": Globe,
  "RAG Pipeline": Cpu,
  "Chat Service": MessageSquare,
}

export function ConnectedAssets() {
  return (
    <div className="glass-card p-4 h-full">
      <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Connected Assets</h3>
      <div className="space-y-2">
        {connectedAssets.map((asset) => {
          const Icon = assetIcons[asset.name] || Server
          return (
            <div key={asset.host} className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-secondary/30 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary border border-border/50">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{asset.name}</span>
                  <StatusIndicator status={asset.status} />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">[{asset.host}]</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
