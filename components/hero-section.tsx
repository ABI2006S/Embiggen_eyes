"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronDown } from "lucide-react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setIsVisible(true)

    audioRef.current = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-music.mp3-T4PJVYQScRpNRi8PZnJs6MA2E01wly.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = 0.3 // Set to 30% volume

    // Auto-play with user interaction handling
    const playAudio = () => {
      audioRef.current?.play().catch((err) => console.log("[v0] Audio autoplay prevented:", err))
    }

    // Try to play immediately
    playAudio()

    // Also try on first user interaction
    const handleInteraction = () => {
      playAudio()
      document.removeEventListener("click", handleInteraction)
      document.removeEventListener("keydown", handleInteraction)
    }

    document.addEventListener("click", handleInteraction)
    document.addEventListener("keydown", handleInteraction)

    return () => {
      // Cleanup audio on unmount
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      document.removeEventListener("click", handleInteraction)
      document.removeEventListener("keydown", handleInteraction)
    }
  }, [])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <div
        className={`text-center space-y-6 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground">Welcome to</p>

        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-balance">
          Cosmic Explorer
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          Journey through the solar system with immersive 3D planets, NASA imagery, and AI-powered exploration
        </p>
      </div>

      <button
        onClick={scrollToContent}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:opacity-70 transition-opacity"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs tracking-[0.2em] uppercase">Scroll to Reveal</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
    </section>
  )
}
