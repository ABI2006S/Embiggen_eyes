"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, ZoomIn, ZoomOut, Maximize2, Minimize2, Trash2, Move, RotateCw, Home, StickyNote } from "lucide-react"
import { AIAnalysis } from "./ai-analysis"
import { getAnnotations, addAnnotation, deleteAnnotation, type Annotation } from "@/lib/annotations"
import { isFirebaseAvailable } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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

export function ImageViewer() {
  const [isOpen, setIsOpen] = useState(false)
  const [image, setImage] = useState<NASAImage | null>(null)
  const [highResUrl, setHighResUrl] = useState<string | null>(null)
  const [isLoadingHighRes, setIsLoadingHighRes] = useState(false)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [isLoadingAnnotations, setIsLoadingAnnotations] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [notePosition, setNotePosition] = useState({ x: 0, y: 0 })
  const [noteText, setNoteText] = useState("")
  const [noteTitle, setNoteTitle] = useState("")

  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const { toast } = useToast()

  const fetchHighResImage = async (assetManifestUrl: string) => {
    setIsLoadingHighRes(true)
    try {
      console.log("[v0] Fetching asset manifest from:", assetManifestUrl)
      const response = await fetch(assetManifestUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Asset manifest response:", data)

      if (!Array.isArray(data)) {
        console.error("[v0] Expected array response, got:", typeof data)
        throw new Error("Invalid asset manifest structure")
      }

      const imageUrls = data.filter((url: string) => {
        return url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".jpeg") || url.endsWith(".tif")
      })

      console.log("[v0] Found image URLs:", imageUrls.length)

      if (imageUrls.length === 0) {
        console.warn("[v0] No image URLs found in manifest")
        return
      }

      const origImage = imageUrls.find((url: string) => url.includes("~orig"))
      const largeImage = imageUrls.find((url: string) => url.includes("~large"))
      const mediumImage = imageUrls.find((url: string) => url.includes("~medium"))

      const highQualityUrl = origImage || largeImage || mediumImage || imageUrls[0]

      if (highQualityUrl) {
        setHighResUrl(highQualityUrl)
        console.log("[v0] Loaded high-res image:", highQualityUrl)

        const quality = origImage ? "original" : largeImage ? "large" : mediumImage ? "medium" : "standard"

        toast({
          title: "High-resolution loaded",
          description: `Image upgraded to ${quality} quality`,
        })
      }
    } catch (error) {
      console.error("[v0] Failed to fetch high-res image:", error)
      console.log("[v0] Continuing with preview quality image")
    } finally {
      setIsLoadingHighRes(false)
    }
  }

  const captureCurrentViewport = (): string | null => {
    if (!imageRef.current) return null

    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return null

      const img = imageRef.current
      const rect = img.getBoundingClientRect()

      // Calculate visible area based on zoom and pan
      const visibleWidth = rect.width / zoom
      const visibleHeight = rect.height / zoom

      // Calculate the center point considering pan
      const centerX = img.naturalWidth / 2 - pan.x / zoom
      const centerY = img.naturalHeight / 2 - pan.y / zoom

      // Calculate crop boundaries
      const cropX = Math.max(0, centerX - visibleWidth / 2)
      const cropY = Math.max(0, centerY - visibleHeight / 2)
      const cropWidth = Math.min(visibleWidth, img.naturalWidth - cropX)
      const cropHeight = Math.min(visibleHeight, img.naturalHeight - cropY)

      // Set canvas size to cropped area
      canvas.width = cropWidth
      canvas.height = cropHeight

      // Draw the cropped portion
      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

      return canvas.toDataURL("image/jpeg", 0.95)
    } catch (error) {
      console.error("[v0] Failed to capture viewport:", error)
      return null
    }
  }

  useEffect(() => {
    const handleOpenViewer = async (e: Event) => {
      const customEvent = e as CustomEvent
      setImage(customEvent.detail)
      setIsOpen(true)
      setZoom(1)
      setPan({ x: 0, y: 0 })
      setRotation(0)
      setHighResUrl(null)

      if (customEvent.detail.assetManifestUrl) {
        fetchHighResImage(customEvent.detail.assetManifestUrl)
      }

      if (isFirebaseAvailable) {
        setIsLoadingAnnotations(true)
        try {
          const savedAnnotations = await getAnnotations(customEvent.detail.nasa_id)
          setAnnotations(savedAnnotations)
        } catch (error) {
          console.error("[v0] Failed to load annotations:", error)
        } finally {
          setIsLoadingAnnotations(false)
        }
      } else {
        console.log("[v0] Annotations disabled - Firebase not configured")
      }
    }

    window.addEventListener("openImageViewer", handleOpenViewer)
    return () => window.removeEventListener("openImageViewer", handleOpenViewer)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setImage(null)
    setAnnotations([])
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 1000))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.25))
  }

  const handleResetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setRotation(0)
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleImageClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    if (isDragging || zoom > 1 || !image) return

    if (!isFirebaseAvailable) {
      toast({
        title: "Annotations unavailable",
        description: "Please configure Firebase to enable study notes",
        variant: "destructive",
      })
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setNotePosition({ x, y })
    setShowNoteDialog(true)
  }

  const handleSaveNote = async () => {
    if (!image || !noteText) return

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      x: notePosition.x,
      y: notePosition.y,
      text: `${noteTitle ? noteTitle + ": " : ""}${noteText}`,
      timestamp: Date.now(),
    }

    try {
      await addAnnotation(image.nasa_id, newAnnotation)
      setAnnotations([...annotations, newAnnotation])
      toast({
        title: "Study note saved",
        description: "Your annotation has been saved to the cloud",
      })
      setShowNoteDialog(false)
      setNoteText("")
      setNoteTitle("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save annotation",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAnnotation = async (annotation: Annotation) => {
    if (!image) return

    try {
      await deleteAnnotation(image.nasa_id, annotation)
      setAnnotations(annotations.filter((a) => a.id !== annotation.id))
      toast({
        title: "Annotation deleted",
        description: "Your annotation has been removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete annotation",
        variant: "destructive",
      })
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  if (!isOpen || !image) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-md">
      <div ref={containerRef} className="relative w-full h-full flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/20 bg-card/30 backdrop-blur-sm">
            <div className="flex-1">
              <h3 className="font-serif text-2xl font-light line-clamp-1">{image.title}</h3>
              <p className="text-sm text-muted-foreground">
                NASA ID: {image.nasa_id} •{" "}
                {new Date(image.date_created).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleResetView} title="Reset View">
                <Home className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRotate} title="Rotate">
                <RotateCw className="w-5 h-5" />
              </Button>
              <div className="w-px h-6 bg-border/50" />
              <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 0.25}>
                <ZoomOut className="w-5 h-5" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[4rem] text-center font-mono">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 1000}>
                <ZoomIn className="w-5 h-5" />
              </Button>
              <div className="w-px h-6 bg-border/50" />
              <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Image Container */}
          <div className="flex-1 overflow-hidden relative bg-black/20">
            {isLoadingHighRes && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-primary/90 backdrop-blur-sm rounded-lg border border-primary/50 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span className="text-sm text-primary-foreground font-medium">Loading high-resolution image...</span>
              </div>
            )}

            {zoom > 1 && (
              <div className="absolute top-4 left-4 z-10 px-3 py-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border/50 flex items-center gap-2">
                <Move className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Drag to pan</span>
              </div>
            )}

            <div className="absolute bottom-4 left-4 z-10 px-3 py-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border/50">
              <span className="text-xs text-muted-foreground font-mono">
                {highResUrl ? "🔍 High Resolution" : "📷 Preview Quality"}
              </span>
            </div>

            {annotations.length > 0 && (
              <div className="absolute top-4 right-4 z-10 px-3 py-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border/50 flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{annotations.length} notes</span>
              </div>
            )}

            <div
              className="w-full h-full flex items-center justify-center"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "crosshair" }}
            >
              <div
                className="relative transition-transform duration-200"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px) rotate(${rotation}deg)`,
                  transformOrigin: "center",
                }}
              >
                <img
                  ref={imageRef}
                  src={highResUrl || image.href || "/placeholder.svg"}
                  alt={image.title}
                  className="max-w-full max-h-[calc(100vh-200px)] object-contain"
                  style={{
                    imageRendering: zoom > 1 ? "high-quality" : "auto",
                  }}
                  onClick={handleImageClick}
                  draggable={false}
                  crossOrigin="anonymous"
                />

                {annotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{
                      left: `${annotation.x}%`,
                      top: `${annotation.y}%`,
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/80 border-2 border-background shadow-lg flex items-center justify-center">
                      <StickyNote className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <Card className="absolute top-10 left-1/2 -translate-x-1/2 p-4 min-w-[250px] max-w-[300px] opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{annotation.text}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(annotation.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteAnnotation(annotation)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description Panel */}
          {image.description && (
            <div className="px-6 py-4 border-t border-border/20 max-h-32 overflow-y-auto bg-card/30 backdrop-blur-sm">
              <p className="text-sm text-muted-foreground leading-relaxed">{image.description}</p>
            </div>
          )}
        </div>

        <AIAnalysis
          imageUrl={image.href}
          imageId={image.nasa_id}
          imageTitle={image.title}
          isOpen={showAIPanel}
          onToggle={() => setShowAIPanel(!showAIPanel)}
          captureViewport={captureCurrentViewport}
          zoom={zoom}
        />
      </div>

      {/* Note Dialog */}
      {showNoteDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 m-4">
            <h3 className="font-serif text-xl font-light mb-4">Add Study Note</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Title (optional)</label>
                <Input
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g., Crater Formation"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Note</label>
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add your observations, questions, or study notes..."
                  className="w-full min-h-[120px]"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowNoteDialog(false)
                    setNoteText("")
                    setNoteTitle("")
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveNote} disabled={!noteText}>
                  Save Note
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
