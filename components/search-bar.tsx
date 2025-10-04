"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, X, Loader2, Sparkles, TrendingUp } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

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

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

const FILTER_CATEGORIES = [
  { id: "all", label: "All", query: "" },
  { id: "planets", label: "Planets", query: "planet" },
  { id: "stars", label: "Stars", query: "star" },
  { id: "satellites", label: "Satellites", query: "satellite" },
  { id: "moons", label: "Moons", query: "moon" },
  { id: "galaxies", label: "Galaxies", query: "galaxy" },
  { id: "nebulae", label: "Nebulae", query: "nebula" },
  { id: "asteroids", label: "Asteroids", query: "asteroid" },
]

const SUGGESTED_SEARCHES = [
  "Hubble Deep Field",
  "Mars Rover",
  "International Space Station",
  "Milky Way",
  "Black Hole",
  "Solar Eclipse",
]

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<NASAImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<NASAImage | null>(null)
  const [activeFilter, setActiveFilter] = useState("all")

  const debouncedQuery = useDebounce(query, 500)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchNASA(query)
  }

  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchNASA(debouncedQuery)
    } else {
      setResults([])
    }
  }, [debouncedQuery])

  const searchNASA = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchQuery)}&media_type=image`,
      )
      const data = await response.json()

      const images: NASAImage[] = data.collection.items.slice(0, 12).map((item: any) => ({
        nasa_id: item.data[0].nasa_id,
        title: item.data[0].title,
        description: item.data[0].description || "",
        date_created: item.data[0].date_created,
        media_type: item.data[0].media_type,
        href: item.links?.[0]?.href || "",
        thumbnail: item.links?.[0]?.href || "",
        assetManifestUrl: item.href || "",
      }))

      setResults(images)
    } catch (error) {
      console.error("[v0] NASA API error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleFilterClick = (filterId: string, filterQuery: string) => {
    setActiveFilter(filterId)
    if (filterQuery) {
      setQuery(filterQuery)
    } else {
      setQuery("")
      setResults([])
    }
  }

  const handleSuggestedSearch = (suggestion: string) => {
    setQuery(suggestion)
    setActiveFilter("all")
  }

  const handleImageClick = (image: NASAImage) => {
    setSelectedImage(image)
    window.dispatchEvent(
      new CustomEvent("openImageDetail", {
        detail: image,
      }),
    )
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-6 py-20 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl font-light mb-2">Search NASA Image Library</h2>
            <p className="text-sm text-muted-foreground">Explore millions of space images with detailed information</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for planets, galaxies, nebulae, missions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg"
              autoFocus
            />
            {isLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin" />}
          </div>
        </form>

        {!query && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Suggested Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_SEARCHES.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedSearch(suggestion)}
                  className="transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {FILTER_CATEGORIES.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick(filter.id, filter.query)}
              className="transition-all"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
            {results.map((image) => (
              <Card
                key={image.nasa_id}
                className="group cursor-pointer overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                onClick={() => handleImageClick(image)}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={image.thumbnail || "/placeholder.svg"}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium line-clamp-2">{image.title}</p>
                      <p className="text-white/70 text-xs mt-1">Click for detailed info</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && query && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found for "{query}"</p>
            <p className="text-sm text-muted-foreground mt-2">Try different keywords or browse suggested searches</p>
          </div>
        )}
      </div>
    </div>
  )
}
