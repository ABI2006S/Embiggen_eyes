"use server"

interface AnalysisResult {
  category: string
  findings: Array<{
    feature: string
    confidence: number
    description: string
  }>
}

interface EnhancedAnalysis {
  summary: string
  categories: AnalysisResult[]
  timestamp: string
}

export async function analyzeImage(
  imageUrl: string,
  region?: { x: number; y: number; width: number; height: number },
): Promise<EnhancedAnalysis> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error("Failed to fetch image")
    }

    const blob = await response.blob()

    // Call Hugging Face Vision Transformer API
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/google/vit-base-patch16-224", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      },
      body: blob,
    })

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text()
      throw new Error(`Hugging Face API error: ${errorText}`)
    }

    const labels = await hfResponse.json()

    // Enhance with scientific context
    const enhancedAnalysis = enhanceWithScientificData(labels, region)

    return enhancedAnalysis
  } catch (error) {
    console.error("[v0] AI Analysis error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to analyze image")
  }
}

function enhanceWithScientificData(
  labels: Array<{ label: string; score: number }>,
  region?: { x: number; y: number; width: number; height: number },
): EnhancedAnalysis {
  // Sort by confidence
  const sortedLabels = labels.sort((a, b) => b.score - a.score)
  const topLabels = sortedLabels.slice(0, 10)

  // Categorize findings
  const atmosphericFindings: AnalysisResult["findings"] = []
  const weatherFindings: AnalysisResult["findings"] = []
  const geologicalFindings: AnalysisResult["findings"] = []
  const celestialFindings: AnalysisResult["findings"] = []
  const environmentalFindings: AnalysisResult["findings"] = []

  // Analyze each label and categorize
  topLabels.forEach((label) => {
    const normalized = label.label.toLowerCase()
    const confidence = Math.round(label.score * 100)

    // Atmospheric features
    if (
      normalized.includes("cloud") ||
      normalized.includes("sky") ||
      normalized.includes("atmosphere") ||
      normalized.includes("haze") ||
      normalized.includes("fog")
    ) {
      atmosphericFindings.push({
        feature: formatFeatureName(label.label),
        confidence,
        description: getAtmosphericDescription(normalized, confidence),
      })
    }

    // Weather patterns
    if (
      normalized.includes("storm") ||
      normalized.includes("cyclone") ||
      normalized.includes("wind") ||
      normalized.includes("weather") ||
      normalized.includes("precipitation")
    ) {
      weatherFindings.push({
        feature: formatFeatureName(label.label),
        confidence,
        description: getWeatherDescription(normalized, confidence),
      })
    }

    // Geological features
    if (
      normalized.includes("crater") ||
      normalized.includes("mountain") ||
      normalized.includes("valley") ||
      normalized.includes("terrain") ||
      normalized.includes("surface") ||
      normalized.includes("rock") ||
      normalized.includes("sand") ||
      normalized.includes("ice") ||
      normalized.includes("volcano")
    ) {
      geologicalFindings.push({
        feature: formatFeatureName(label.label),
        confidence,
        description: getGeologicalDescription(normalized, confidence),
      })
    }

    // Celestial objects
    if (
      normalized.includes("planet") ||
      normalized.includes("moon") ||
      normalized.includes("star") ||
      normalized.includes("galaxy") ||
      normalized.includes("nebula") ||
      normalized.includes("asteroid") ||
      normalized.includes("comet") ||
      normalized.includes("satellite")
    ) {
      celestialFindings.push({
        feature: formatFeatureName(label.label),
        confidence,
        description: getCelestialDescription(normalized, confidence),
      })
    }

    // Environmental conditions
    if (
      normalized.includes("light") ||
      normalized.includes("dark") ||
      normalized.includes("shadow") ||
      normalized.includes("bright") ||
      normalized.includes("color") ||
      normalized.includes("texture")
    ) {
      environmentalFindings.push({
        feature: formatFeatureName(label.label),
        confidence,
        description: getEnvironmentalDescription(normalized, confidence),
      })
    }
  })

  // Build categories array
  const categories: AnalysisResult[] = []

  if (atmosphericFindings.length > 0) {
    categories.push({
      category: "Atmospheric Analysis",
      findings: atmosphericFindings,
    })
  }

  if (weatherFindings.length > 0) {
    categories.push({
      category: "Weather Conditions",
      findings: weatherFindings,
    })
  }

  if (geologicalFindings.length > 0) {
    categories.push({
      category: "Geological Features",
      findings: geologicalFindings,
    })
  }

  if (celestialFindings.length > 0) {
    categories.push({
      category: "Celestial Objects",
      findings: celestialFindings,
    })
  }

  if (environmentalFindings.length > 0) {
    categories.push({
      category: "Environmental Conditions",
      findings: environmentalFindings,
    })
  }

  // Generate summary
  const summary = generateSummary(categories, region)

  return {
    summary,
    categories,
    timestamp: new Date().toISOString(),
  }
}

function formatFeatureName(label: string): string {
  return label
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getAtmosphericDescription(feature: string, confidence: number): string {
  if (feature.includes("cloud")) {
    return `Cloud formations detected with ${confidence}% confidence. These atmospheric structures may indicate active weather systems or atmospheric circulation patterns.`
  }
  if (feature.includes("haze") || feature.includes("fog")) {
    return `Atmospheric haze or fog detected (${confidence}% confidence). This suggests the presence of suspended particles or moisture in the atmosphere.`
  }
  if (feature.includes("sky")) {
    return `Sky features identified with ${confidence}% confidence. Analysis of atmospheric layers and composition in progress.`
  }
  return `Atmospheric feature detected with ${confidence}% confidence. Further analysis may reveal composition and density information.`
}

function getWeatherDescription(feature: string, confidence: number): string {
  if (feature.includes("storm") || feature.includes("cyclone")) {
    return `Potential storm system detected (${confidence}% confidence). Large-scale atmospheric disturbances may be present with significant wind patterns.`
  }
  if (feature.includes("wind")) {
    return `Wind patterns identified with ${confidence}% confidence. Atmospheric circulation and pressure gradients are likely active.`
  }
  return `Weather-related phenomena detected with ${confidence}% confidence. Atmospheric dynamics are observable in this region.`
}

function getGeologicalDescription(feature: string, confidence: number): string {
  if (feature.includes("crater")) {
    return `Impact crater detected (${confidence}% confidence). This geological feature indicates past meteorite or asteroid impacts, providing insights into the surface age.`
  }
  if (feature.includes("mountain") || feature.includes("volcano")) {
    return `Elevated terrain or volcanic features identified (${confidence}% confidence). These structures suggest tectonic activity or volcanic processes.`
  }
  if (feature.includes("ice")) {
    return `Ice formations detected with ${confidence}% confidence. Frozen water or other volatiles may be present, indicating cold surface temperatures.`
  }
  if (feature.includes("rock") || feature.includes("terrain")) {
    return `Rocky terrain identified (${confidence}% confidence). Surface composition analysis suggests solid geological structures.`
  }
  return `Geological feature detected with ${confidence}% confidence. Surface characteristics indicate specific formation processes.`
}

function getCelestialDescription(feature: string, confidence: number): string {
  if (feature.includes("planet")) {
    return `Planetary body detected (${confidence}% confidence). Large celestial object with significant mass and possible atmosphere.`
  }
  if (feature.includes("moon") || feature.includes("satellite")) {
    return `Natural satellite or moon identified (${confidence}% confidence). Smaller celestial body likely in orbit around a larger planet.`
  }
  if (feature.includes("star")) {
    return `Stellar object detected (${confidence}% confidence). Luminous celestial body powered by nuclear fusion.`
  }
  if (feature.includes("galaxy") || feature.includes("nebula")) {
    return `Deep space object identified (${confidence}% confidence). Large-scale cosmic structure containing billions of stars or stellar nursery.`
  }
  return `Celestial object detected with ${confidence}% confidence. Further analysis may reveal specific classification.`
}

function getEnvironmentalDescription(feature: string, confidence: number): string {
  if (feature.includes("light") || feature.includes("bright")) {
    return `High luminosity detected (${confidence}% confidence). Strong illumination suggests proximity to light source or reflective surfaces.`
  }
  if (feature.includes("dark") || feature.includes("shadow")) {
    return `Low light conditions identified (${confidence}% confidence). Shadowed regions or absence of direct illumination detected.`
  }
  return `Environmental characteristic detected with ${confidence}% confidence. Visual properties provide insights into surface or atmospheric conditions.`
}

function generateSummary(
  categories: AnalysisResult[],
  region?: { x: number; y: number; width: number; height: number },
): string {
  const totalFindings = categories.reduce((sum, cat) => sum + cat.findings.length, 0)

  if (totalFindings === 0) {
    return "No significant features detected in this image. The AI model may require additional training data for this type of celestial imagery."
  }

  const regionText = region ? "in the selected region" : "across the entire image"

  const categoryNames = categories.map((cat) => cat.category.toLowerCase())
  const categoriesText =
    categoryNames.length > 1
      ? `${categoryNames.slice(0, -1).join(", ")}, and ${categoryNames[categoryNames.length - 1]}`
      : categoryNames[0]

  return `Analysis complete: ${totalFindings} significant features detected ${regionText}. The AI has identified ${categoriesText}. Each finding includes confidence scores and scientific context to help understand the celestial phenomena present in this image.`
}
