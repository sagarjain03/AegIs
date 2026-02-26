"use client"

import { Search, Sparkles, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HamburgerMenu } from "@/components/app-sidebar"

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="shrink-0 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-4">
      <div className="flex items-center gap-3">
        <HamburgerMenu />
        <div>
          <h1 className="text-sm font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search threats, sessions..."
            className="h-8 w-56 bg-secondary border-border pl-8 text-xs font-mono placeholder:text-muted-foreground/50"
          />
        </div>

        <Button variant="outline" size="sm" className="h-8 gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary font-mono text-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Ask AI</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <Avatar className="h-8 w-8 border border-border">
          <AvatarFallback className="bg-secondary text-xs font-mono text-foreground">SA</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
