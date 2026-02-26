import { TopBar } from "@/components/top-bar"
import { MetricCard } from "@/components/metric-card"
import { ThreatGlobe } from "@/components/dashboard/threat-globe"
import { IncidentPanel } from "@/components/dashboard/incident-panel"
import { ThreatTrendChart } from "@/components/dashboard/threat-trend-chart"
import { ConnectedAssets } from "@/components/dashboard/connected-assets"
import { RiskBars } from "@/components/dashboard/risk-bars"
import { kpiData } from "@/lib/mock-data"
import {
  Activity,
  ShieldAlert,
  Syringe,
  Gauge,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <>
      <TopBar
        title="Overview"
        subtitle="A unified view of your security posture, threats, and system integrity."
      />

      <div className="flex-1 p-4 grid-bg relative overflow-hidden flex flex-col gap-3">
        {/* Scan line overlay */}
        <div className="absolute inset-0 scan-line pointer-events-none" />

        {/* KPI Row */}
        <div className="relative grid grid-cols-4 gap-3 shrink-0">
          <MetricCard
            title="Total Events"
            value={kpiData.totalInteractions}
            icon={Activity}
            trend={{ value: 12.3, label: "30d" }}
            accentColor="text-primary"
          />
          <MetricCard
            title="Active Threats"
            value={kpiData.activeThreats}
            icon={ShieldAlert}
            trend={{ value: 21.7, label: "30d" }}
            accentColor="text-destructive"
          />
          <MetricCard
            title="Injection Attempts"
            value={kpiData.injectionAttempts}
            icon={Syringe}
            trend={{ value: 8.4, label: "7d" }}
            accentColor="text-chart-3"
          />
          <MetricCard
            title="Session Risk Score"
            value={kpiData.sessionRiskScore}
            icon={Gauge}
            trend={{ value: -3.2, label: "24h" }}
            accentColor="text-chart-2"
          />
        </div>

        {/* Main Content Grid */}
        <div className="relative grid grid-cols-12 gap-3 flex-1 min-h-0">
          {/* Left Column */}
          <div className="col-span-3 flex flex-col gap-3 min-h-0 overflow-hidden">
            <div className="glass-card p-3 space-y-2 shrink-0">
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Quick Stats</h3>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Last Incident</span>
                  <span className="text-xs font-mono font-bold text-foreground">[{kpiData.lastIncident}]</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Last Scan</span>
                  <span className="text-xs font-mono font-bold text-foreground">[{kpiData.lastScan}]</span>
                </div>
              </div>
            </div>
            <RiskBars />
            <div className="flex-1 min-h-0">
              <ConnectedAssets />
            </div>
          </div>

          {/* Center - Globe */}
          <div className="col-span-5 min-h-0">
            <div className="glass-card p-2 h-full flex flex-col">
              <div className="flex-1 min-h-0">
                <ThreatGlobe />
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center px-3 pb-2 shrink-0">
                {[
                  { label: "Login Anomaly", color: "bg-chart-2" },
                  { label: "IP Reputation", color: "bg-primary" },
                  { label: "Proxy Detection", color: "bg-chart-3" },
                  { label: "Rate Limiting", color: "bg-destructive" },
                  { label: "ASN Risk", color: "bg-chart-4" },
                  { label: "TOR Network", color: "bg-chart-5" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span className="text-[10px] font-mono text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-4 flex flex-col gap-3 min-h-0 overflow-hidden">
            <div className="flex-1 min-h-0">
              <IncidentPanel />
            </div>
            <div className="flex-1 min-h-0">
              <ThreatTrendChart />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
