"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Loader2, ExternalLink, Calendar, Camera, Info, Sparkles, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NASAImage {
  nasa_id: string
  title: string
  description: string
  date_created: string
  media_type: string
  href: string
  thumbnail?: string
  assetManifestUrl?: string
}

interface ImageMetadata {
  photographer?: string
  center?: string
  keywords?: string[]
  location?: string
  secondaryCreator?: string
}

interface DetailedInfo {
  summary: string
  significance: string
  technicalDetails: string
  historicalContext: string
  scientificImportance: string
  metadata: ImageMetadata
}

export function ImageDetailViewer() {
  const [isOpen, setIsOpen] = useState(false)
  const [image, setImage] = useState<NASAImage | null>(null)
  const [detailedInfo, setDetailedInfo] = useState<DetailedInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "technical" | "scientific">("overview")

  useEffect(() => {
    const handleOpenDetail = async (e: Event) => {
      const customEvent = e as CustomEvent
      setImage(customEvent.detail)
      setIsOpen(true)
      setDetailedInfo(null)
      setActiveTab("overview")

      // Fetch detailed information
      await fetchDetailedInfo(customEvent.detail)
    }

    window.addEventListener("openImageDetail", handleOpenDetail)
    return () => window.removeEventListener("openImageDetail", handleOpenDetail)
  }, [])

  const fetchDetailedInfo = async (img: NASAImage) => {
    setIsLoading(true)
    try {
      console.log("[v0] Fetching detailed info for:", img.nasa_id)

      // Fetch metadata from NASA API
      let metadata: ImageMetadata = {}
      if (img.assetManifestUrl) {
        try {
          const metadataUrl = img.assetManifestUrl.replace("/collection.json", "/metadata.json")
          const response = await fetch(metadataUrl)
          if (response.ok) {
            const data = await response.json()
            metadata = {
              photographer: data["AVAIL:Photographer"] || data["AVAIL:PI"] || "NASA",
              center: data["AVAIL:Center"] || "NASA",
              keywords: data["AVAIL:Keywords"]?.split(",").map((k: string) => k.trim()) || [],
              location: data["AVAIL:Location"] || "",
              secondaryCreator: data["AVAIL:SecondaryCreator"] || "",
            }
          }
        } catch (error) {
          console.log("[v0] Could not fetch metadata:", error)
        }
      }

      // Generate detailed analysis based on title, description, and metadata
      const info = generateDetailedInfo(img, metadata)
      setDetailedInfo(info)
    } catch (error) {
      console.error("[v0] Error fetching detailed info:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateDetailedInfo = (img: NASAImage, metadata: ImageMetadata): DetailedInfo => {
    const title = img.title.toLowerCase()
    const description = img.description.toLowerCase()
    const keywords = metadata.keywords || []

    // Analyze content
    const isMars = title.includes("mars") || description.includes("mars")
    const isEarth = title.includes("earth") || description.includes("earth")
    const isHubble = title.includes("hubble") || description.includes("hubble")
    const isISS = title.includes("iss") || title.includes("international space station")
    const isGalaxy = title.includes("galaxy") || description.includes("galaxy")
    const isNebula = title.includes("nebula") || description.includes("nebula")
    const isMoon = title.includes("moon") || description.includes("moon")
    const isJupiter = title.includes("jupiter") || description.includes("jupiter")
    const isSaturn = title.includes("saturn") || description.includes("saturn")

    let summary = ""
    let significance = ""
    let technicalDetails = ""
    let historicalContext = ""
    let scientificImportance = ""

    if (isMars) {
      summary = `This image captures Mars, the fourth planet from the Sun, often called the "Red Planet" due to iron oxide (rust) on its surface. ${img.description.substring(0, 200)}...`
      significance =
        "Mars is a primary target for human exploration and the search for past or present life beyond Earth. Its similarities to Earth make it the most likely candidate for future human colonization."
      technicalDetails = `Captured by ${metadata.photographer || "NASA's Mars exploration program"}. Mars has a thin atmosphere composed primarily of carbon dioxide, with surface temperatures ranging from -140°C to 20°C.`
      historicalContext =
        "Mars has been observed since ancient times and has been the subject of numerous missions since the 1960s. Recent rovers like Curiosity and Perseverance have revolutionized our understanding of the planet."
      scientificImportance =
        "Mars shows evidence of ancient river valleys and lake beds, suggesting it once had liquid water. Current missions are searching for signs of past microbial life and preparing for future human missions."
    } else if (isEarth) {
      summary = `This stunning view of Earth, our home planet, showcases the beauty and fragility of our world from space. ${img.description.substring(0, 200)}...`
      significance =
        "Images of Earth from space have profoundly changed human perspective, highlighting the planet's isolation in the cosmos and the need for environmental stewardship."
      technicalDetails = `Photographed by ${metadata.photographer || "NASA astronauts or satellites"}. Earth is the only known planet with liquid water oceans covering 71% of its surface and an atmosphere that supports life.`
      historicalContext =
        "The first photographs of Earth from space were taken in the 1940s. The famous 'Blue Marble' (1972) and 'Pale Blue Dot' (1990) images became iconic symbols of Earth's beauty and vulnerability."
      scientificImportance =
        "Earth observation from space is crucial for monitoring climate change, weather patterns, natural disasters, and environmental changes. These images help scientists understand our planet's complex systems."
    } else if (isHubble) {
      summary = `This remarkable image was captured by the Hubble Space Telescope, one of humanity's most important scientific instruments. ${img.description.substring(0, 200)}...`
      significance =
        "Hubble has revolutionized astronomy, providing unprecedented views of the universe and helping answer fundamental questions about cosmic origins, evolution, and the nature of space-time."
      technicalDetails = `Captured by the Hubble Space Telescope, launched in 1990 and operating in low Earth orbit at approximately 547 km altitude. Hubble uses advanced cameras and spectrographs to observe in ultraviolet, visible, and near-infrared wavelengths.`
      historicalContext =
        "Since its launch, Hubble has made over 1.5 million observations and contributed to more than 18,000 scientific papers. It has observed galaxies billions of light-years away, helping determine the age of the universe."
      scientificImportance =
        "Hubble's observations have been crucial in discovering dark energy, studying exoplanet atmospheres, observing the formation of stars and galaxies, and providing the deepest views of the universe ever obtained."
    } else if (isISS) {
      summary = `This image relates to the International Space Station (ISS), humanity's orbital laboratory and home to astronauts from around the world. ${img.description.substring(0, 200)}...`
      significance =
        "The ISS represents international cooperation in space exploration and serves as a testbed for technologies needed for future deep space missions."
      technicalDetails = `The ISS orbits Earth at approximately 408 km altitude, traveling at 28,000 km/h and completing an orbit every 90 minutes. It has been continuously inhabited since November 2000.`
      historicalContext =
        "Construction began in 1998 with contributions from NASA, Roscosmos, ESA, JAXA, and CSA. It's the largest human-made structure in space, about the size of a football field."
      scientificImportance =
        "The ISS enables research in microgravity that's impossible on Earth, including studies in biology, physics, astronomy, and materials science. It's crucial for understanding long-term space habitation effects on humans."
    } else if (isGalaxy) {
      summary = `This image captures a galaxy, a massive system of stars, gas, dust, and dark matter bound together by gravity. ${img.description.substring(0, 200)}...`
      significance =
        "Studying galaxies helps us understand the large-scale structure of the universe, galaxy formation and evolution, and the distribution of matter throughout cosmic history."
      technicalDetails = `Galaxies contain billions to trillions of stars and can span tens of thousands to hundreds of thousands of light-years. They come in various shapes: spiral, elliptical, and irregular.`
      historicalContext =
        "Until the 1920s, galaxies were thought to be nebulae within our own Milky Way. Edwin Hubble's observations proved they were separate 'island universes,' revolutionizing our understanding of cosmic scale."
      scientificImportance =
        "Galaxy observations reveal the universe's expansion, the role of dark matter and dark energy, and how structures formed from the early universe. They're key to understanding cosmic evolution over 13.8 billion years."
    } else if (isNebula) {
      summary = `This image shows a nebula, a vast cloud of gas and dust in space where stars are born or where dying stars have expelled their outer layers. ${img.description.substring(0, 200)}...`
      significance =
        "Nebulae are stellar nurseries and graveyards, representing the cycle of stellar birth, life, and death. They're crucial for understanding how stars and planetary systems form."
      technicalDetails = `Nebulae can span hundreds of light-years and contain enough material to form thousands of stars. They glow due to ionization from nearby hot stars or reflect starlight from embedded or nearby stars.`
      historicalContext =
        "Ancient astronomers observed nebulae as fuzzy patches of light. With telescopes, we discovered their true nature as vast clouds of gas and dust, some forming new stars, others remnants of stellar explosions."
      scientificImportance =
        "Studying nebulae reveals the chemical composition of interstellar matter, star formation processes, and how heavy elements created in stars are recycled to form new generations of stars and planets."
    } else if (isMoon) {
      summary = `This image features Earth's Moon, our closest celestial neighbor and the only other world humans have visited. ${img.description.substring(0, 200)}...`
      significance =
        "The Moon has been crucial to human culture, science, and exploration. It stabilizes Earth's rotation, creates tides, and served as the first destination for human space exploration."
      technicalDetails = `The Moon is 384,400 km from Earth with a diameter of 3,474 km (about 1/4 of Earth's). It has no atmosphere, and surface temperatures range from -173°C to 127°C.`
      historicalContext =
        "The Apollo program (1969-1972) landed 12 astronauts on the Moon, returning 382 kg of lunar samples. These missions revolutionized our understanding of the Moon's origin and the early solar system."
      scientificImportance =
        "Lunar samples revealed the Moon formed from debris after a Mars-sized object collided with early Earth. The Moon preserves a record of the early solar system and is a target for future exploration and potential habitation."
    } else if (isJupiter) {
      summary = `This image shows Jupiter, the largest planet in our solar system and a gas giant with no solid surface. ${img.description.substring(0, 200)}...`
      significance =
        "Jupiter's massive gravity has shaped the solar system's architecture, protecting inner planets from asteroid impacts and influencing the orbits of countless objects."
      technicalDetails = `Jupiter has a diameter of 139,820 km (11 times Earth's) and is composed mainly of hydrogen and helium. Its Great Red Spot is a storm larger than Earth that has raged for centuries.`
      historicalContext =
        "Jupiter has been observed since ancient times. Galileo's 1610 discovery of its four largest moons provided evidence for the Copernican model of the solar system."
      scientificImportance =
        "Jupiter's moons, especially Europa with its subsurface ocean, are prime targets in the search for extraterrestrial life. Studying Jupiter helps us understand gas giant formation and planetary system evolution."
    } else if (isSaturn) {
      summary = `This image captures Saturn, the sixth planet from the Sun, famous for its spectacular ring system. ${img.description.substring(0, 200)}...`
      significance =
        "Saturn's rings are the most extensive and visible in the solar system, making it one of the most recognizable and studied planets. Its moon Titan is a target for astrobiology research."
      technicalDetails = `Saturn's rings are composed of billions of ice particles ranging from tiny grains to house-sized chunks. The planet itself is a gas giant with winds reaching 1,800 km/h.`
      historicalContext =
        "Galileo first observed Saturn's rings in 1610 but couldn't resolve them clearly. The Cassini mission (2004-2017) provided unprecedented views and data about Saturn and its moons."
      scientificImportance =
        "Saturn's moon Titan has a thick atmosphere and liquid methane lakes, making it a unique laboratory for studying prebiotic chemistry. Enceladus has geysers suggesting a subsurface ocean, another potential habitat for life."
    } else {
      // Generic space image
      summary = `${img.description || "This remarkable space image captures the beauty and mystery of the cosmos, showcasing phenomena that expand our understanding of the universe."}`
      significance =
        "Every image from space contributes to humanity's growing knowledge of the cosmos, inspiring wonder and advancing scientific understanding of our place in the universe."
      technicalDetails = `Captured by ${metadata.photographer || "NASA's advanced imaging systems"}. ${metadata.center ? `Provided by ${metadata.center}.` : ""} ${keywords.length > 0 ? `Related topics: ${keywords.slice(0, 5).join(", ")}.` : ""}`
      historicalContext = `Taken on ${new Date(img.date_created).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}. This image is part of NASA's extensive archive documenting space exploration and astronomical observations.`
      scientificImportance =
        "Space imagery is essential for scientific research, public education, and inspiring future generations of scientists and explorers. Each image contributes to our collective understanding of the universe."
    }

    return {
      summary,
      significance,
      technicalDetails,
      historicalContext,
      scientificImportance,
      metadata,
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setImage(null)
    setDetailedInfo(null)
  }

  const handleOpenInViewer = () => {
    if (image) {
      window.dispatchEvent(new CustomEvent("openImageViewer", { detail: image }))
      handleClose()
    }
  }

  if (!isOpen || !image) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-md overflow-y-auto">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <h2 className="font-serif text-4xl font-light mb-3 text-balance">{image.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(image.date_created).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {detailedInfo?.metadata.photographer && (
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  {detailedInfo.metadata.photographer}
                </div>
              )}
              {detailedInfo?.metadata.center && (
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {detailedInfo.metadata.center}
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Image */}
          <Card className="overflow-hidden group cursor-pointer" onClick={handleOpenInViewer}>
            <div className="relative aspect-square">
              <img
                src={image.href || "/placeholder.svg"}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center text-white">
                  <ExternalLink className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">Open in Advanced Viewer</p>
                  <p className="text-sm text-white/70">Zoom, annotate, and analyze</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Info */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Analyzing image and gathering information...</p>
                </div>
              </div>
            ) : detailedInfo ? (
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h3 className="font-serif text-xl font-medium">Overview</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-pretty">{detailedInfo.summary}</p>
                  </Card>

                  {detailedInfo.metadata.keywords && detailedInfo.metadata.keywords.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {detailedInfo.metadata.keywords.slice(0, 10).map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : null}
          </div>
        </div>

        {/* Detailed Information Tabs */}
        {detailedInfo && !isLoading && (
          <div className="space-y-6">
            <div className="flex gap-2 border-b border-border">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                onClick={() => setActiveTab("overview")}
                className="rounded-b-none"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Significance
              </Button>
              <Button
                variant={activeTab === "technical" ? "default" : "ghost"}
                onClick={() => setActiveTab("technical")}
                className="rounded-b-none"
              >
                <Info className="w-4 h-4 mr-2" />
                Technical Details
              </Button>
              <Button
                variant={activeTab === "scientific" ? "default" : "ghost"}
                onClick={() => setActiveTab("scientific")}
                className="rounded-b-none"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Scientific Importance
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <Card className="p-6">
                      <h3 className="font-serif text-xl font-medium mb-4">Why This Image Matters</h3>
                      <p className="text-sm leading-relaxed text-pretty mb-6">{detailedInfo.significance}</p>

                      <h4 className="font-medium mb-3">Historical Context</h4>
                      <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                        {detailedInfo.historicalContext}
                      </p>
                    </Card>
                  </div>
                )}

                {activeTab === "technical" && (
                  <Card className="p-6">
                    <h3 className="font-serif text-xl font-medium mb-4">Technical Information</h3>
                    <p className="text-sm leading-relaxed text-pretty">{detailedInfo.technicalDetails}</p>

                    {detailedInfo.metadata.location && (
                      <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                        <h4 className="font-medium mb-2">Location</h4>
                        <p className="text-sm text-muted-foreground">{detailedInfo.metadata.location}</p>
                      </div>
                    )}
                  </Card>
                )}

                {activeTab === "scientific" && (
                  <Card className="p-6">
                    <h3 className="font-serif text-xl font-medium mb-4">Scientific Importance</h3>
                    <p className="text-sm leading-relaxed text-pretty">{detailedInfo.scientificImportance}</p>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button size="lg" onClick={handleOpenInViewer} className="gap-2">
            <ExternalLink className="w-5 h-5" />
            Open in Advanced Viewer
          </Button>
        </div>
      </div>
    </div>
  )
}
