"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Search, Loader2, BookOpen, Download } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ResearchPanelProps {
  isOpen: boolean
  onClose: () => void
}

interface CelestialObject {
  id: string
  name: string
  category: string
  description: string
  imageUrl: string
}

interface DetailedResearch {
  name: string
  category: string
  overview: string
  physicalCharacteristics: {
    diameter?: string
    mass?: string
    density?: string
    gravity?: string
    escapeVelocity?: string
    rotationPeriod?: string
    orbitalPeriod?: string
    distanceFromSun?: string
    temperature?: string
  }
  atmosphere?: {
    composition: string[]
    pressure?: string
    features?: string[]
  }
  surface?: {
    features: string[]
    composition?: string
    terrain?: string
  }
  moons?: {
    count: number
    notable: string[]
  }
  exploration?: {
    missions: string[]
    discoveries: string[]
  }
  scientificSignificance: string
  funFacts: string[]
  imageUrl: string
  nasaImageQuery: string
}

const CELESTIAL_CATEGORIES = [
  { id: "all", label: "All Objects", icon: "🌌" },
  { id: "planets", label: "Planets", icon: "🪐" },
  { id: "dwarf-planets", label: "Dwarf Planets", icon: "🌑" },
  { id: "moons", label: "Moons", icon: "🌙" },
  { id: "stars", label: "Stars", icon: "⭐" },
  { id: "asteroids", label: "Asteroids", icon: "☄️" },
  { id: "comets", label: "Comets", icon: "☄️" },
  { id: "satellites", label: "Satellites", icon: "🛰️" },
  { id: "nebulae", label: "Nebulae", icon: "🌫️" },
  { id: "galaxies", label: "Galaxies", icon: "🌌" },
]

const CELESTIAL_OBJECTS: CelestialObject[] = [
  // Planets
  {
    id: "sun",
    name: "Sun",
    category: "stars",
    description: "The star at the center of our solar system",
    imageUrl: "/sun-texture.jpg",
  },
  {
    id: "mercury",
    name: "Mercury",
    category: "planets",
    description: "The smallest and closest planet to the Sun",
    imageUrl: "/mercury-texture.jpg",
  },
  {
    id: "venus",
    name: "Venus",
    category: "planets",
    description: "The hottest planet with a thick atmosphere",
    imageUrl: "/venus-texture.jpg",
  },
  {
    id: "earth",
    name: "Earth",
    category: "planets",
    description: "Our home planet, the only known world with life",
    imageUrl: "/earth-texture.jpg",
  },
  {
    id: "mars",
    name: "Mars",
    category: "planets",
    description: "The Red Planet, target for human exploration",
    imageUrl: "/mars-texture.jpg",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    category: "planets",
    description: "The largest planet in our solar system",
    imageUrl: "/jupiter-texture.jpg",
  },
  {
    id: "saturn",
    name: "Saturn",
    category: "planets",
    description: "The ringed gas giant",
    imageUrl: "/saturn-texture.jpg",
  },
  {
    id: "uranus",
    name: "Uranus",
    category: "planets",
    description: "The ice giant tilted on its side",
    imageUrl: "/uranus-texture.jpg",
  },
  {
    id: "neptune",
    name: "Neptune",
    category: "planets",
    description: "The windiest planet in the solar system",
    imageUrl: "/neptune-texture.jpg",
  },

  // Dwarf Planets
  {
    id: "pluto",
    name: "Pluto",
    category: "dwarf-planets",
    description: "The famous dwarf planet in the Kuiper Belt",
    imageUrl: "/pluto-dwarf-planet.jpg",
  },
  {
    id: "ceres",
    name: "Ceres",
    category: "dwarf-planets",
    description: "The largest object in the asteroid belt",
    imageUrl: "/ceres-dwarf-planet.jpg",
  },
  {
    id: "eris",
    name: "Eris",
    category: "dwarf-planets",
    description: "One of the most massive dwarf planets",
    imageUrl: "/eris-dwarf-planet.jpg",
  },

  // Moons
  {
    id: "moon",
    name: "Moon (Luna)",
    category: "moons",
    description: "Earth's only natural satellite",
    imageUrl: "/earth-moon-luna.jpg",
  },
  {
    id: "europa",
    name: "Europa",
    category: "moons",
    description: "Jupiter's moon with a subsurface ocean",
    imageUrl: "/europa-moon-jupiter.jpg",
  },
  {
    id: "titan",
    name: "Titan",
    category: "moons",
    description: "Saturn's largest moon with a thick atmosphere",
    imageUrl: "/titan-moon-saturn.jpg",
  },
  {
    id: "enceladus",
    name: "Enceladus",
    category: "moons",
    description: "Saturn's icy moon with water geysers",
    imageUrl: "/enceladus-moon-saturn.jpg",
  },
  {
    id: "io",
    name: "Io",
    category: "moons",
    description: "Jupiter's volcanic moon",
    imageUrl: "/io-moon-jupiter-volcanic.jpg",
  },

  // Asteroids
  {
    id: "vesta",
    name: "Vesta",
    category: "asteroids",
    description: "One of the largest asteroids",
    imageUrl: "/vesta-asteroid.jpg",
  },
  {
    id: "pallas",
    name: "Pallas",
    category: "asteroids",
    description: "Third-largest asteroid in the asteroid belt",
    imageUrl: "/pallas-asteroid.jpg",
  },

  // Comets
  {
    id: "halley",
    name: "Halley's Comet",
    category: "comets",
    description: "Famous periodic comet visible from Earth",
    imageUrl: "/halley-comet.jpg",
  },

  // Satellites
  {
    id: "iss",
    name: "International Space Station",
    category: "satellites",
    description: "Humanity's orbital laboratory",
    imageUrl: "/international-space-station-iss.jpg",
  },
  {
    id: "hubble",
    name: "Hubble Space Telescope",
    category: "satellites",
    description: "Revolutionary space telescope",
    imageUrl: "/hubble-space-telescope.jpg",
  },

  // Nebulae
  {
    id: "orion",
    name: "Orion Nebula",
    category: "nebulae",
    description: "Stellar nursery in the Orion constellation",
    imageUrl: "/orion-nebula.png",
  },
  {
    id: "crab",
    name: "Crab Nebula",
    category: "nebulae",
    description: "Supernova remnant",
    imageUrl: "/crab-nebula.jpg",
  },

  // Galaxies
  {
    id: "milky-way",
    name: "Milky Way",
    category: "galaxies",
    description: "Our home galaxy",
    imageUrl: "/milky-way-galaxy.jpg",
  },
  {
    id: "andromeda",
    name: "Andromeda Galaxy",
    category: "galaxies",
    description: "Nearest major galaxy to the Milky Way",
    imageUrl: "/andromeda-galaxy.png",
  },
]

export function ResearchPanel({ isOpen, onClose }: ResearchPanelProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null)
  const [detailedResearch, setDetailedResearch] = useState<DetailedResearch | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [nasaImages, setNasaImages] = useState<any[]>([])

  const filteredObjects = CELESTIAL_OBJECTS.filter((obj) => {
    const matchesCategory = activeCategory === "all" || obj.category === activeCategory
    const matchesSearch =
      obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleObjectSelect = async (obj: CelestialObject) => {
    setSelectedObject(obj)
    setIsLoading(true)
    setDetailedResearch(null)

    // Generate detailed research data
    const research = await generateDetailedResearch(obj)
    setDetailedResearch(research)

    // Fetch NASA images for this object
    await fetchNASAImages(research.nasaImageQuery)

    setIsLoading(false)
  }

  const fetchNASAImages = async (query: string) => {
    try {
      const response = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`)
      const data = await response.json()
      const images = data.collection.items.slice(0, 6).map((item: any) => ({
        nasa_id: item.data[0].nasa_id,
        title: item.data[0].title,
        href: item.links?.[0]?.href || "",
      }))
      setNasaImages(images)
    } catch (error) {
      console.error("[v0] NASA API error:", error)
      setNasaImages([])
    }
  }

  const generateDetailedResearch = async (obj: CelestialObject): Promise<DetailedResearch> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generate comprehensive research data based on object
    const researchData: Record<string, DetailedResearch> = {
      earth: {
        name: "Earth",
        category: "Planet",
        overview:
          "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is covered with water, mostly by oceans. The remaining 29% is land consisting of continents and islands.",
        physicalCharacteristics: {
          diameter: "12,742 km",
          mass: "5.972 × 10²⁴ kg",
          density: "5.51 g/cm³",
          gravity: "9.807 m/s²",
          escapeVelocity: "11.186 km/s",
          rotationPeriod: "23.934 hours",
          orbitalPeriod: "365.256 days",
          distanceFromSun: "149.6 million km (1 AU)",
          temperature: "-88°C to 58°C (average 15°C)",
        },
        atmosphere: {
          composition: ["Nitrogen (78%)", "Oxygen (21%)", "Argon (0.93%)", "Carbon Dioxide (0.04%)"],
          pressure: "101.325 kPa at sea level",
          features: ["Ozone layer protection", "Weather systems", "Greenhouse effect"],
        },
        surface: {
          features: ["Oceans (71%)", "Continents", "Mountains", "Valleys", "Polar ice caps"],
          composition: "Silicate rocks and metals",
          terrain: "Diverse: deserts, forests, tundra, grasslands",
        },
        moons: {
          count: 1,
          notable: ["Luna (The Moon)"],
        },
        exploration: {
          missions: ["Apollo missions", "ISS", "Earth observation satellites"],
          discoveries: ["Plate tectonics", "Magnetic field", "Biosphere complexity"],
        },
        scientificSignificance:
          "Earth is the only known planet with life and liquid water on its surface. It serves as a reference point for studying other potentially habitable worlds. Understanding Earth's climate, geology, and biosphere is crucial for planetary science and astrobiology.",
        funFacts: [
          "Earth is the densest planet in the solar system",
          "A day on Earth is getting longer by about 1.7 milliseconds per century",
          "Earth's magnetic field protects us from solar radiation",
          "The planet is about 4.54 billion years old",
          "Earth is the only planet not named after a god",
        ],
        imageUrl: obj.imageUrl,
        nasaImageQuery: "earth from space",
      },
      mars: {
        name: "Mars",
        category: "Planet",
        overview:
          "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. Often called the 'Red Planet' due to iron oxide (rust) on its surface, Mars has been a prime target for exploration due to its similarities to Earth.",
        physicalCharacteristics: {
          diameter: "6,779 km",
          mass: "6.39 × 10²³ kg",
          density: "3.93 g/cm³",
          gravity: "3.721 m/s² (38% of Earth)",
          escapeVelocity: "5.027 km/s",
          rotationPeriod: "24.623 hours",
          orbitalPeriod: "687 Earth days",
          distanceFromSun: "227.9 million km (1.52 AU)",
          temperature: "-140°C to 20°C (average -63°C)",
        },
        atmosphere: {
          composition: ["Carbon Dioxide (95.3%)", "Nitrogen (2.7%)", "Argon (1.6%)"],
          pressure: "0.636 kPa (0.6% of Earth)",
          features: ["Dust storms", "Thin atmosphere", "Polar ice caps"],
        },
        surface: {
          features: [
            "Olympus Mons (largest volcano)",
            "Valles Marineris (canyon system)",
            "Polar ice caps",
            "Ancient river valleys",
          ],
          composition: "Iron oxide, basaltic rock",
          terrain: "Craters, volcanoes, valleys, deserts",
        },
        moons: {
          count: 2,
          notable: ["Phobos", "Deimos"],
        },
        exploration: {
          missions: ["Viking 1 & 2", "Curiosity Rover", "Perseverance Rover", "Ingenuity Helicopter"],
          discoveries: ["Evidence of ancient water", "Organic molecules", "Methane detection"],
        },
        scientificSignificance:
          "Mars is the most Earth-like planet and the primary target for human exploration. Evidence suggests it once had liquid water and a thicker atmosphere, making it crucial for understanding planetary evolution and the potential for past life.",
        funFacts: [
          "A year on Mars is almost twice as long as an Earth year",
          "Mars has the largest dust storms in the solar system",
          "Olympus Mons is three times taller than Mount Everest",
          "Mars appears red due to iron oxide (rust) on its surface",
          "Pieces of Mars have been found on Earth as meteorites",
        ],
        imageUrl: obj.imageUrl,
        nasaImageQuery: "mars planet surface rover",
      },
      jupiter: {
        name: "Jupiter",
        category: "Planet",
        overview:
          "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets combined. Jupiter's iconic Great Red Spot is a giant storm larger than Earth.",
        physicalCharacteristics: {
          diameter: "139,820 km",
          mass: "1.898 × 10²⁷ kg",
          density: "1.33 g/cm³",
          gravity: "24.79 m/s²",
          escapeVelocity: "59.5 km/s",
          rotationPeriod: "9.925 hours",
          orbitalPeriod: "11.86 Earth years",
          distanceFromSun: "778.5 million km (5.2 AU)",
          temperature: "-145°C (cloud tops)",
        },
        atmosphere: {
          composition: ["Hydrogen (90%)", "Helium (10%)", "Methane", "Ammonia"],
          pressure: "Unknown (no solid surface)",
          features: ["Great Red Spot", "Banded cloud patterns", "Lightning storms"],
        },
        surface: {
          features: ["No solid surface", "Liquid metallic hydrogen core", "Dense atmosphere"],
          composition: "Hydrogen and helium gas",
          terrain: "Gas giant with no solid terrain",
        },
        moons: {
          count: 95,
          notable: ["Io (volcanic)", "Europa (subsurface ocean)", "Ganymede (largest moon)", "Callisto"],
        },
        exploration: {
          missions: ["Pioneer 10 & 11", "Voyager 1 & 2", "Galileo", "Juno"],
          discoveries: ["Intense radiation belts", "Complex magnetic field", "Europa's ocean"],
        },
        scientificSignificance:
          "Jupiter's massive gravity has shaped the solar system's architecture. Its moon Europa is a prime candidate for finding extraterrestrial life due to its subsurface ocean. Jupiter also protects inner planets from asteroid impacts.",
        funFacts: [
          "Jupiter is so massive it could fit all other planets inside it",
          "The Great Red Spot has been raging for at least 400 years",
          "Jupiter has the shortest day of all planets (under 10 hours)",
          "Jupiter's moon Ganymede is larger than Mercury",
          "Jupiter has faint rings, discovered by Voyager 1",
        ],
        imageUrl: obj.imageUrl,
        nasaImageQuery: "jupiter planet great red spot",
      },
    }

    // Return specific data or generate generic data
    return researchData[obj.id] || generateGenericResearch(obj)
  }

  const generateGenericResearch = (obj: CelestialObject): DetailedResearch => {
    return {
      name: obj.name,
      category: obj.category.charAt(0).toUpperCase() + obj.category.slice(1),
      overview:
        obj.description +
        ". This celestial object is part of our fascinating universe and continues to be studied by astronomers and space agencies worldwide.",
      physicalCharacteristics: {
        diameter: "Data being compiled",
        mass: "Data being compiled",
      },
      scientificSignificance: `${obj.name} represents an important subject of astronomical study, contributing to our understanding of ${obj.category} and the broader cosmos.`,
      funFacts: [
        `${obj.name} is classified as a ${obj.category.slice(0, -1)}`,
        "Ongoing research continues to reveal new information",
        "Part of humanity's quest to understand the universe",
      ],
      imageUrl: obj.imageUrl,
      nasaImageQuery: obj.name.toLowerCase(),
    }
  }

  const handleExportResearch = () => {
    if (!detailedResearch) return

    let exportText = `COSMIC EXPLORER - RESEARCH REPORT\n`
    exportText += `${"=".repeat(60)}\n\n`
    exportText += `Object: ${detailedResearch.name}\n`
    exportText += `Category: ${detailedResearch.category}\n`
    exportText += `Generated: ${new Date().toLocaleString()}\n\n`
    exportText += `${"=".repeat(60)}\n\n`

    exportText += `OVERVIEW\n${"-".repeat(60)}\n${detailedResearch.overview}\n\n`

    if (detailedResearch.physicalCharacteristics) {
      exportText += `PHYSICAL CHARACTERISTICS\n${"-".repeat(60)}\n`
      Object.entries(detailedResearch.physicalCharacteristics).forEach(([key, value]) => {
        if (value) {
          const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
          exportText += `${label}: ${value}\n`
        }
      })
      exportText += `\n`
    }

    if (detailedResearch.atmosphere) {
      exportText += `ATMOSPHERE\n${"-".repeat(60)}\n`
      exportText += `Composition: ${detailedResearch.atmosphere.composition.join(", ")}\n`
      if (detailedResearch.atmosphere.pressure) {
        exportText += `Pressure: ${detailedResearch.atmosphere.pressure}\n`
      }
      if (detailedResearch.atmosphere.features) {
        exportText += `Features: ${detailedResearch.atmosphere.features.join(", ")}\n`
      }
      exportText += `\n`
    }

    if (detailedResearch.surface) {
      exportText += `SURFACE\n${"-".repeat(60)}\n`
      exportText += `Features: ${detailedResearch.surface.features.join(", ")}\n`
      if (detailedResearch.surface.composition) {
        exportText += `Composition: ${detailedResearch.surface.composition}\n`
      }
      exportText += `\n`
    }

    if (detailedResearch.moons) {
      exportText += `MOONS\n${"-".repeat(60)}\n`
      exportText += `Count: ${detailedResearch.moons.count}\n`
      exportText += `Notable: ${detailedResearch.moons.notable.join(", ")}\n\n`
    }

    if (detailedResearch.exploration) {
      exportText += `EXPLORATION\n${"-".repeat(60)}\n`
      exportText += `Missions: ${detailedResearch.exploration.missions.join(", ")}\n`
      exportText += `Discoveries: ${detailedResearch.exploration.discoveries.join(", ")}\n\n`
    }

    exportText += `SCIENTIFIC SIGNIFICANCE\n${"-".repeat(60)}\n${detailedResearch.scientificSignificance}\n\n`

    exportText += `FUN FACTS\n${"-".repeat(60)}\n`
    detailedResearch.funFacts.forEach((fact, index) => {
      exportText += `${index + 1}. ${fact}\n`
    })

    exportText += `\n${"=".repeat(60)}\n`
    exportText += `Report generated by Cosmic Explorer\n`
    exportText += `https://cosmic-explorer.vercel.app\n`

    const blob = new Blob([exportText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${detailedResearch.name.replace(/\s+/g, "_")}_Research_Report.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleNASAImageClick = (image: any) => {
    window.dispatchEvent(
      new CustomEvent("openImageDetail", {
        detail: {
          nasa_id: image.nasa_id,
          title: image.title,
          description: `Research image for ${detailedResearch?.name}`,
          date_created: new Date().toISOString(),
          media_type: "image",
          href: image.href,
          thumbnail: image.href,
        },
      }),
    )
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-md overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-3xl font-light mb-2 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                Celestial Research Database
              </h2>
              <p className="text-sm text-muted-foreground">
                Comprehensive scientific data on celestial objects with NASA imagery
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar */}
          <div className="w-80 border-r border-border/20 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-border/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search objects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="p-4 border-b border-border/20">
              <ScrollArea className="h-48">
                <div className="space-y-1">
                  {CELESTIAL_CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveCategory(category.id)}
                      className="w-full justify-start"
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Objects List */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {filteredObjects.map((obj) => (
                  <Card
                    key={obj.id}
                    className={`p-3 cursor-pointer transition-all hover:bg-accent ${
                      selectedObject?.id === obj.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleObjectSelect(obj)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <img
                          src={obj.imageUrl || "/placeholder.svg"}
                          alt={obj.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{obj.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{obj.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
                {filteredObjects.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No objects found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {!selectedObject ? (
              <div className="h-full flex items-center justify-center text-center p-8">
                <div>
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-serif text-2xl font-light mb-2">Select a Celestial Object</h3>
                  <p className="text-muted-foreground">
                    Choose an object from the list to view detailed research and NASA imagery
                  </p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Compiling research data...</p>
                </div>
              </div>
            ) : detailedResearch ? (
              <div className="p-8 max-w-5xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    {/* Header with Image */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h1 className="font-serif text-4xl font-light mb-2">{detailedResearch.name}</h1>
                        <p className="text-lg text-muted-foreground mb-4">{detailedResearch.category}</p>
                        <Button onClick={handleExportResearch} className="gap-2">
                          <Download className="w-4 h-4" />
                          Export Research Report
                        </Button>
                      </div>
                      <Card className="overflow-hidden">
                        <img
                          src={detailedResearch.imageUrl || "/placeholder.svg"}
                          alt={detailedResearch.name}
                          className="w-full h-64 object-cover"
                        />
                      </Card>
                    </div>

                    {/* Overview */}
                    <Card className="p-6">
                      <h3 className="font-serif text-2xl font-light mb-4">Overview</h3>
                      <p className="text-sm leading-relaxed text-pretty">{detailedResearch.overview}</p>
                    </Card>

                    {/* Physical Characteristics */}
                    {detailedResearch.physicalCharacteristics && (
                      <Card className="p-6">
                        <h3 className="font-serif text-2xl font-light mb-4">Physical Characteristics</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {Object.entries(detailedResearch.physicalCharacteristics).map(([key, value]) => {
                            if (!value) return null
                            const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
                            return (
                              <div
                                key={key}
                                className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg"
                              >
                                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                                <span className="text-sm font-semibold">{value}</span>
                              </div>
                            )
                          })}
                        </div>
                      </Card>
                    )}

                    {/* Atmosphere */}
                    {detailedResearch.atmosphere && (
                      <Card className="p-6">
                        <h3 className="font-serif text-2xl font-light mb-4">Atmosphere</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Composition</h4>
                            <div className="flex flex-wrap gap-2">
                              {detailedResearch.atmosphere.composition.map((comp, idx) => (
                                <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                  {comp}
                                </span>
                              ))}
                            </div>
                          </div>
                          {detailedResearch.atmosphere.pressure && (
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Pressure</h4>
                              <p className="text-sm">{detailedResearch.atmosphere.pressure}</p>
                            </div>
                          )}
                          {detailedResearch.atmosphere.features && (
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Features</h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                {detailedResearch.atmosphere.features.map((feature, idx) => (
                                  <li key={idx}>{feature}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </Card>
                    )}

                    {/* Surface */}
                    {detailedResearch.surface && (
                      <Card className="p-6">
                        <h3 className="font-serif text-2xl font-light mb-4">Surface</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Features</h4>
                            <div className="flex flex-wrap gap-2">
                              {detailedResearch.surface.features.map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                          {detailedResearch.surface.composition && (
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Composition</h4>
                              <p className="text-sm">{detailedResearch.surface.composition}</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    )}

                    {/* Moons */}
                    {detailedResearch.moons && (
                      <Card className="p-6">
                        <h3 className="font-serif text-2xl font-light mb-4">Moons</h3>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">Count:</span> {detailedResearch.moons.count}
                          </p>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Notable Moons</h4>
                            <div className="flex flex-wrap gap-2">
                              {detailedResearch.moons.notable.map((moon, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                                >
                                  {moon}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Exploration */}
                    {detailedResearch.exploration && (
                      <Card className="p-6">
                        <h3 className="font-serif text-2xl font-light mb-4">Exploration</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Missions</h4>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {detailedResearch.exploration.missions.map((mission, idx) => (
                                <li key={idx}>{mission}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Key Discoveries</h4>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {detailedResearch.exploration.discoveries.map((discovery, idx) => (
                                <li key={idx}>{discovery}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Scientific Significance */}
                    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                      <h3 className="font-serif text-2xl font-light mb-4">Scientific Significance</h3>
                      <p className="text-sm leading-relaxed text-pretty">{detailedResearch.scientificSignificance}</p>
                    </Card>

                    {/* Fun Facts */}
                    <Card className="p-6">
                      <h3 className="font-serif text-2xl font-light mb-4">Fun Facts</h3>
                      <ul className="space-y-3">
                        {detailedResearch.funFacts.map((fact, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="text-primary font-bold">{idx + 1}.</span>
                            <span className="text-sm">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    {/* NASA Images */}
                    {nasaImages.length > 0 && (
                      <div>
                        <h3 className="font-serif text-2xl font-light mb-4">NASA Imagery</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Click any image to view in detail viewer with AI analysis
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {nasaImages.map((image) => (
                            <Card
                              key={image.nasa_id}
                              className="group cursor-pointer overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                              onClick={() => handleNASAImageClick(image)}
                            >
                              <div className="aspect-square relative">
                                <img
                                  src={image.href || "/placeholder.svg"}
                                  alt={image.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="text-white text-xs font-medium line-clamp-2">{image.title}</p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
