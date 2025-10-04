import { AuroraBackground } from "@/components/aurora-background"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { PlanetSections } from "@/components/planet-sections"
import { ImageViewer } from "@/components/image-viewer"
import { ImageDetailViewer } from "@/components/image-detail-viewer"
import { OutroSection } from "@/components/outro-section"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <AuroraBackground />
      <Navigation />
      <HeroSection />
      <PlanetSections />
      <OutroSection />
      <ImageViewer />
      <ImageDetailViewer />
    </main>
  )
}
