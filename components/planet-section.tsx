"use client"

import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"

const Planet3D = dynamic(() => import("./planet-3d").then((mod) => ({ default: mod.Planet3D })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  ),
})

interface Moon {
  name: string
  size: number
  distance?: number
}

interface Facts {
  diameter: string
  orbit: string
  atmosphere: string
  funFact: string
}

interface PlanetSectionProps {
  planetName: string
  textureUrl: string
  moons: Moon[]
  facts: Facts
  index: number
  planetSize?: number
  rotationSpeed?: number
}

export function PlanetSection({
  planetName,
  textureUrl,
  moons,
  facts,
  index,
  planetSize,
  rotationSpeed,
}: PlanetSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const factsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const factsPanel = factsRef.current
    if (!section || !factsPanel) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            factsPanel.classList.add("opacity-100", "translate-x-0")
            factsPanel.classList.remove("opacity-0", "translate-x-10")
          }
        })
      },
      { threshold: 0.5 },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="container mx-auto h-full flex flex-col lg:flex-row items-center gap-12">
        {/* Planet visualization */}
        <div className="flex-1 h-[500px] lg:h-[700px] flex items-center justify-center">
          <Planet3D
            textureUrl={textureUrl}
            moons={moons}
            planetName={planetName}
            planetSize={planetSize}
            rotationSpeed={rotationSpeed}
          />
        </div>

        {/* Planet details */}
        <div ref={factsRef} className="flex-1 space-y-6 opacity-0 translate-x-10 transition-all duration-1000 ease-out">
          <div>
            <h2 className="font-serif text-5xl md:text-7xl font-light mb-2">{planetName}</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent" />
          </div>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <dl className="space-y-4">
              <div className="flex justify-between items-center border-b border-border/30 pb-3">
                <dt className="text-sm text-muted-foreground uppercase tracking-wider">Diameter</dt>
                <dd className="text-lg font-medium">{facts.diameter}</dd>
              </div>
              <div className="flex justify-between items-center border-b border-border/30 pb-3">
                <dt className="text-sm text-muted-foreground uppercase tracking-wider">Orbital Period</dt>
                <dd className="text-lg font-medium">{facts.orbit}</dd>
              </div>
              <div className="flex justify-between items-center border-b border-border/30 pb-3">
                <dt className="text-sm text-muted-foreground uppercase tracking-wider">Atmosphere</dt>
                <dd className="text-lg font-medium">{facts.atmosphere}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6 bg-accent/20 backdrop-blur-sm border-accent/30">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Did You Know?</p>
            <p className="text-base leading-relaxed">{facts.funFact}</p>
          </Card>

          {moons.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Moons ({moons.length}):</span>
              {moons.map((moon) => (
                <span key={moon.name} className="px-3 py-1 rounded-full bg-secondary/50 text-sm">
                  {moon.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
