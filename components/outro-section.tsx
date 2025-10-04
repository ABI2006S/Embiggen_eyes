"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Github, Users, X } from "lucide-react"

export function OutroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleGitHubClick = () => {
    window.open("https://github.com/ABI2006S/cosmic-explorer", "_blank")
  }

  const teamMembers = [
    { name: "Abin Varughese John", stream: "CSE" },
    { name: "Ashvel Ipe", stream: "CSE" },
    { name: "P.B.Brahmadathan ", stream: "B.Sc maths" },
    { name: "Colin Abraham Varughese", stream: "B.Sc maths" },
    { name: "Jeyaprasad K", stream: "CSE" },
    { name: "Justin K C", stream: "CSE" },
  ]

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div
        className={`text-center space-y-8 transition-all duration-1000 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 animate-pulse" />
          <h2 className="relative font-serif text-5xl md:text-7xl font-light tracking-tight text-balance">
            The Universe Awaits
          </h2>
        </div>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
          You've journeyed through our solar system, explored NASA's cosmic imagery, and witnessed the power of AI in
          understanding the universe. Continue your exploration and discover the infinite wonders that lie beyond.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>Built with Next.js</span>
          <span>•</span>
          <span>NASA API</span>
          <span>•</span>
          <span>Hugging Face AI</span>
          <span>•</span>
          <span>Firebase</span>
          <span>•</span>
          <span>Three.js</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
          <Button
            size="lg"
            variant="outline"
            className="gap-2 bg-transparent hover:bg-primary/10 transition-colors"
            onClick={handleGitHubClick}
          >
            <Github className="w-5 h-5" />
            View Source Code on GitHub
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="gap-2 bg-transparent hover:bg-accent/10 transition-colors"
            onClick={() => setShowTeamModal(true)}
          >
            <Users className="w-5 h-5" />
            About Team
          </Button>
        </div>

        <p className="text-xs text-muted-foreground pt-4">
          Open source • MIT License • Made with love for space enthusiasts
        </p>
      </div>

      {showTeamModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl p-8 m-4 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setShowTeamModal(false)}
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="text-center space-y-6">
              {/* Team Logo */}
              <div className="flex justify-center mb-6">
                <img
                  src="/assets/team/team-logo.png"
                  alt="Team Logo"
                  className="w-48 h-48 object-contain"
                  onError={(e) => {
                    // Fallback to placeholder if logo doesn't exist
                    e.currentTarget.src = "/abstract-team-logo.png"
                  }}
                />
              </div>

              <h3 className="font-serif text-3xl font-light">Our Team</h3>
              <p className="text-muted-foreground">Meet the talented individuals who brought Cosmic Explorer to life</p>

              {/* Team Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="p-4 rounded-lg bg-accent/10 border border-border/50">
                    <h4 className="font-medium text-lg">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.stream}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground pt-4">
                A collaborative effort combining expertise in space science, software engineering, and design
              </p>
            </div>
          </Card>
        </div>
      )}
    </section>
  )
}
