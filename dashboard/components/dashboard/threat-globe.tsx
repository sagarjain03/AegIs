"use client"

import { useEffect, useRef } from "react"
import { geoThreats } from "@/lib/mock-data"

const severityColor: Record<string, string> = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22d3ee",
}

export function ThreatGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotationRef = useRef(0)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const cx = rect.width / 2
    const cy = rect.height / 2
    const radius = Math.min(cx, cy) - 30

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Globe background glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.3)
      glow.addColorStop(0, "rgba(34, 211, 238, 0.05)")
      glow.addColorStop(0.5, "rgba(34, 211, 238, 0.02)")
      glow.addColorStop(1, "transparent")
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, rect.width, rect.height)

      // Globe circle
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(34, 211, 238, 0.15)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Globe fill
      const globeGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius)
      globeGrad.addColorStop(0, "rgba(34, 211, 238, 0.06)")
      globeGrad.addColorStop(1, "rgba(10, 15, 30, 0.8)")
      ctx.fillStyle = globeGrad
      ctx.fill()

      // Grid lines (latitude)
      for (let i = -3; i <= 3; i++) {
        const y = cy + (i / 4) * radius
        const halfWidth = Math.sqrt(Math.max(0, radius * radius - (y - cy) * (y - cy)))
        ctx.beginPath()
        ctx.ellipse(cx, y, halfWidth, halfWidth * 0.1, 0, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(34, 211, 238, 0.07)"
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Grid lines (longitude) - rotating
      const rot = rotationRef.current
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI + rot
        ctx.beginPath()
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(Math.cos(angle), 1)
        ctx.beginPath()
        ctx.arc(0, 0, radius, 0, Math.PI * 2)
        ctx.restore()
        ctx.strokeStyle = "rgba(34, 211, 238, 0.06)"
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Threat dots
      geoThreats.forEach((threat) => {
        const phi = ((90 - threat.lat) * Math.PI) / 180
        const theta = ((threat.lng + 180 + (rotationRef.current * 180) / Math.PI) * Math.PI) / 180

        const x = cx + radius * Math.sin(phi) * Math.cos(theta) * 0.85
        const y = cy - radius * Math.cos(phi) * 0.85

        // Only show if on front side
        const z = Math.sin(phi) * Math.sin(theta)
        if (z < -0.1) return

        const alpha = 0.5 + z * 0.5
        const color = severityColor[threat.severity] || "#22d3ee"
        const dotSize = 3 + (threat.count / 500) * 4

        // Pulse ring
        const pulse = 1 + Math.sin(Date.now() / 800 + threat.lat) * 0.4
        ctx.beginPath()
        ctx.arc(x, y, dotSize * pulse * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = color.replace(")", `, ${alpha * 0.15})`)
                            .replace("rgb", "rgba")
        ctx.fill()

        // Dot
        ctx.beginPath()
        ctx.arc(x, y, dotSize, 0, Math.PI * 2)
        ctx.fillStyle = color.replace(")", `, ${alpha * 0.8})`)
                            .replace("rgb", "rgba")
        ctx.fill()

        // Center bright dot
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`
        ctx.fill()
      })

      // Scan line
      const scanAngle = (Date.now() / 3000) % (Math.PI * 2)
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(
        cx + radius * Math.cos(scanAngle),
        cy + radius * Math.sin(scanAngle)
      )
      ctx.strokeStyle = "rgba(34, 211, 238, 0.15)"
      ctx.lineWidth = 1
      ctx.stroke()

      rotationRef.current += 0.002
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxHeight: 380 }}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card px-3 py-1.5">
        <span className="text-[10px] font-mono text-primary animate-pulse">
          Location Monitoring Active
        </span>
      </div>
    </div>
  )
}
