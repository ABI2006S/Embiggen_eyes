"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Search, Moon, Sun, BookOpen } from "lucide-react"
import type { LucideProps } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchBar } from "./search-bar"
import { ResearchPanel } from "./research-panel"

type IconButtonProps = {
  icon: React.ReactNode
  onClick?: () => void
  className?: string
  size?: "icon" | "default" | "sm" | "lg"
}

export function Navigation() {
  const [isMuted, setIsMuted] = useState(true)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isResearchOpen, setIsResearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
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

  const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, className, onClick, ...props }, ref) => (
      <Button
        ref={ref}
        onClick={onClick}
        variant="ghost"
        size="icon"
        className={cn("text-foreground/80 hover:text-foreground", className)}
        {...props}
      >
        {icon}
      </Button>
    )
  )
  IconButton.displayName = "IconButton"

  return (
    <React.Fragment>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-background/50 backdrop-blur-sm border-b border-border/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
          <span className="text-xl font-serif font-semibold tracking-tight">Cosmic Explorer</span>
        </div>

        <div className="flex items-center gap-4">
          <IconButton
            onClick={() => setIsResearchOpen(!isResearchOpen)}
            icon={<BookOpen size={20} strokeWidth={1.5} />}
          />
          <IconButton
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            icon={<Search size={20} strokeWidth={1.5} />}
          />
          <IconButton
            onClick={toggleTheme}
            icon={mounted && theme === "dark" ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
          />
          <IconButton
            onClick={toggleMute}
            icon={isMuted ? <VolumeX size={20} strokeWidth={1.5} /> : <Volume2 size={20} strokeWidth={1.5} />}
          />
        </div>
      </header>

      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ResearchPanel isOpen={isResearchOpen} onClose={() => setIsResearchOpen(false)} />
    </React.Fragment>
  )
}
