"use client"

import { PlanetSection } from "./planet-section"

const planetsData = [
  {
    name: "Sun",
    textureUrl: "/sun-texture.jpg",
    moons: [],
    planetSize: 3,
    rotationSpeed: 0.001,
    facts: {
      diameter: "1,392,700 km",
      orbit: "N/A (Center of Solar System)",
      atmosphere: "Plasma (Hydrogen, Helium)",
      funFact: "The Sun contains 99.86% of the mass in the Solar System and could fit 1.3 million Earths inside it",
    },
  },
  {
    name: "Mercury",
    textureUrl: "/mercury-texture.jpg",
    moons: [],
    planetSize: 1.2,
    rotationSpeed: 0.004,
    facts: {
      diameter: "4,879 km",
      orbit: "88 Earth days",
      atmosphere: "Virtually none (Exosphere)",
      funFact: "Mercury has the most extreme temperature variations in the solar system, ranging from -173°C to 427°C",
    },
  },
  {
    name: "Venus",
    textureUrl: "/venus-texture.jpg",
    moons: [],
    planetSize: 1.8,
    rotationSpeed: -0.001,
    facts: {
      diameter: "12,104 km",
      orbit: "225 Earth days",
      atmosphere: "Thick CO₂ clouds with sulfuric acid",
      funFact:
        "Venus rotates backwards (retrograde) and has the longest day of any planet - one day lasts 243 Earth days",
    },
  },
  {
    name: "Earth",
    textureUrl: "/earth-texture.jpg",
    moons: [{ name: "Moon", size: 0.27, distance: 3.5 }],
    planetSize: 2,
    rotationSpeed: 0.002,
    facts: {
      diameter: "12,742 km",
      orbit: "365.25 days",
      atmosphere: "Nitrogen (78%), Oxygen (21%)",
      funFact:
        "Earth is the only known planet with liquid water on its surface and the only place where life is known to exist",
    },
  },
  {
    name: "Mars",
    textureUrl: "/mars-texture.jpg",
    moons: [
      { name: "Phobos", size: 0.15, distance: 3 },
      { name: "Deimos", size: 0.1, distance: 4 },
    ],
    planetSize: 1.5,
    rotationSpeed: 0.0018,
    facts: {
      diameter: "6,779 km",
      orbit: "687 Earth days",
      atmosphere: "Thin CO₂ (95%)",
      funFact:
        "Mars has the largest volcano in the solar system, Olympus Mons, which is 21 km high - nearly three times Mount Everest",
    },
  },
  {
    name: "Jupiter",
    textureUrl: "/jupiter-texture.jpg",
    moons: [
      { name: "Io", size: 0.3, distance: 4 },
      { name: "Europa", size: 0.25, distance: 5 },
      { name: "Ganymede", size: 0.35, distance: 6 },
      { name: "Callisto", size: 0.3, distance: 7 },
    ],
    planetSize: 2.8,
    rotationSpeed: 0.004,
    facts: {
      diameter: "139,820 km",
      orbit: "11.9 Earth years",
      atmosphere: "Hydrogen (90%), Helium (10%)",
      funFact: "Jupiter's Great Red Spot is a storm larger than Earth that has been raging for at least 400 years",
    },
  },
  {
    name: "Saturn",
    textureUrl: "/saturn-texture.jpg",
    moons: [
      { name: "Titan", size: 0.4, distance: 5 },
      { name: "Enceladus", size: 0.15, distance: 4 },
      { name: "Rhea", size: 0.2, distance: 6 },
      { name: "Iapetus", size: 0.18, distance: 7 },
    ],
    planetSize: 2.5,
    rotationSpeed: 0.0038,
    facts: {
      diameter: "116,460 km",
      orbit: "29.5 Earth years",
      atmosphere: "Hydrogen (96%), Helium (3%)",
      funFact: "Saturn's rings are made of billions of ice particles ranging from tiny grains to house-sized chunks",
    },
  },
  {
    name: "Uranus",
    textureUrl: "/uranus-texture.jpg",
    moons: [
      { name: "Titania", size: 0.2, distance: 4 },
      { name: "Oberon", size: 0.18, distance: 5 },
      { name: "Umbriel", size: 0.16, distance: 3.5 },
      { name: "Ariel", size: 0.17, distance: 3 },
    ],
    planetSize: 2.2,
    rotationSpeed: -0.003,
    facts: {
      diameter: "50,724 km",
      orbit: "84 Earth years",
      atmosphere: "Hydrogen (83%), Helium (15%), Methane (2%)",
      funFact:
        "Uranus rotates on its side at a 98-degree angle, likely due to a massive collision billions of years ago",
    },
  },
  {
    name: "Neptune",
    textureUrl: "/neptune-texture.jpg",
    moons: [
      { name: "Triton", size: 0.25, distance: 4 },
      { name: "Proteus", size: 0.15, distance: 5 },
    ],
    planetSize: 2.1,
    rotationSpeed: 0.0032,
    facts: {
      diameter: "49,244 km",
      orbit: "165 Earth years",
      atmosphere: "Hydrogen (80%), Helium (19%), Methane (1%)",
      funFact: "Neptune has the strongest winds in the solar system, reaching speeds of up to 2,100 km/h",
    },
  },
]

export function PlanetSections() {
  return (
    <div className="relative">
      {planetsData.map((planet, index) => (
        <PlanetSection
          key={planet.name}
          planetName={planet.name}
          textureUrl={planet.textureUrl}
          moons={planet.moons}
          facts={planet.facts}
          index={index}
          planetSize={planet.planetSize}
          rotationSpeed={planet.rotationSpeed}
        />
      ))}
    </div>
  )
}
