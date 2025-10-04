"use client"

import { useEffect, useRef } from "react"

interface AuroraBackgroundProps {
  colorStops?: string[]
  amplitude?: number
  speed?: number
  intensity?: number
}

export function AuroraBackground({
  colorStops = ["#4169E1", "#9370DB", "#20B2AA", "#48D1CC"],
  amplitude = 0.5,
  speed = 0.0005,
  intensity = 0.8,
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const drawAurora = () => {
      ctx.fillStyle = "rgba(10, 10, 15, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const waves = 4
      const waveHeight = canvas.height / waves

      for (let i = 0; i < waves; i++) {
        ctx.beginPath()

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        const color1 = colorStops[i % colorStops.length]
        const color2 = colorStops[(i + 1) % colorStops.length]

        gradient.addColorStop(
          0,
          `${color1}${Math.floor(intensity * 40)
            .toString(16)
            .padStart(2, "0")}`,
        )
        gradient.addColorStop(
          1,
          `${color2}${Math.floor(intensity * 20)
            .toString(16)
            .padStart(2, "0")}`,
        )

        ctx.fillStyle = gradient

        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            waveHeight * i +
            Math.sin(x * 0.01 + time + i) * amplitude * 100 +
            Math.sin(x * 0.005 + time * 0.5) * amplitude * 50

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()
        ctx.fill()
      }

      time += speed * 100
      animationFrameId = requestAnimationFrame(drawAurora)
    }

    drawAurora()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [colorStops, amplitude, speed, intensity])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" style={{ opacity: 0.6 }} />
}
