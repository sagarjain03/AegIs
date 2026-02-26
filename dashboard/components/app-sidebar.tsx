"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  ShieldAlert,
  Activity,
  BrainCircuit,
  Lock,
  Puzzle,
  Settings,
  Shield,
  Menu,
} from "lucide-react"

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Threats", href: "/threats", icon: ShieldAlert },
  { label: "Activity Logs", href: "/activity", icon: Activity },
  { label: "Behavioral Analytics", href: "/behavior", icon: BrainCircuit },
  { label: "Policies", href: "/policies", icon: Lock },
  { label: "Integrations", href: "/integrations", icon: Puzzle },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-sidebar border-sidebar-border p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          {/* Logo */}
          <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-5">
            {/* use the official PNG logo instead of the generic shield icon */}
            <img
              src="/aegis-logo.png"
              alt="AegisAI logo"
              className="h-8 w-auto rounded"
            />
            <span className="font-mono text-sm font-bold tracking-wide text-sidebar-foreground">
              AegisAI
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary border border-sidebar-primary/20"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 border border-transparent"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50")} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* System Status */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
            <div className="glass-card p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">System Status</span>
                <span className="h-2 w-2 rounded-full bg-chart-2" style={{ animation: "pulse-glow 2s ease-in-out infinite" }} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Firewall</span>
                  <span className="font-mono text-chart-2">Active</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Detection</span>
                  <span className="font-mono text-chart-2">Online</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Latency</span>
                  <span className="font-mono text-primary">12ms</span>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
