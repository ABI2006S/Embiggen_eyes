"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Search, Moon, Sun, BookOpen } from "lucide-react"
import { SearchBar } from "./search-bar"
import { ResearchPanel } from "./research-panel"

export function Navigation() {
  const [isMuted, setIsMuted] = useState(true)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isResearchOpen, setIsResearchOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Initialize ambient space audio
    audioRef.current = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-music.mp3-T4PJVYQScRpNRi8PZnJs6MA2E01wly.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = 0.3
  }, [])

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch((e) => console.error("[v0] Audio play error:", e))
      } else {
        audioRef.current.pause()
      }
      setIsMuted(!isMuted)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-background/50 backdrop-blur-sm border-b border-border/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
          <span className="text-xl font-serif font-semibold tracking-tight">Cosmic Explorer</span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsResearchOpen(!isResearchOpen)}
            className="text-foreground/80 hover:text-foreground"
          >
            <BookOpen className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-foreground/80 hover:text-foreground"
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-foreground/80 hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMute} className="text-foreground/80 hover:text-foreground">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ResearchPanel isOpen={isResearchOpen} onClose={() => setIsResearchOpen(false)} />
    </>
  )
}
