"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

interface Moon {
  name: string
  size: number
  distance?: number
}

interface Planet3DProps {
  textureUrl: string
  moons: Moon[]
  planetName: string
  planetSize?: number
  rotationSpeed?: number
}

function PlanetSphere({
  textureUrl,
  planetSize = 3.5,
  rotationSpeed = 0.002,
  planetName,
}: { textureUrl: string; planetSize?: number; rotationSpeed?: number; planetName: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const textureLoader = new THREE.TextureLoader()

  const texture = textureLoader.load(textureUrl)

  texture.anisotropy = 16
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[planetSize, 128, 128]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

function SaturnRings({ planetSize }: { planetSize: number }) {
  const ringsRef = useRef<THREE.Mesh>(null)
  const [ringTexture, setRingTexture] = useState<THREE.CanvasTexture | null>(null)

  useEffect(() => {
    const createRingTexture = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext("2d")
      if (!ctx) return null

      const gradient = ctx.createRadialGradient(256, 256, 100, 256, 256, 256)
      gradient.addColorStop(0, "rgba(200, 180, 150, 0)")
      gradient.addColorStop(0.3, "rgba(220, 200, 170, 0.8)")
      gradient.addColorStop(0.4, "rgba(180, 160, 130, 0.6)")
      gradient.addColorStop(0.5, "rgba(200, 180, 150, 0.9)")
      gradient.addColorStop(0.6, "rgba(160, 140, 110, 0.5)")
      gradient.addColorStop(0.7, "rgba(190, 170, 140, 0.8)")
      gradient.addColorStop(0.85, "rgba(150, 130, 100, 0.4)")
      gradient.addColorStop(1, "rgba(200, 180, 150, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 512, 512)

      const texture = new THREE.CanvasTexture(canvas)
      return texture
    }

    setRingTexture(createRingTexture())
  }, [])

  if (!ringTexture) return null

  return (
    <mesh ref={ringsRef} rotation={[Math.PI / 2.2, 0, 0]}>
      <ringGeometry args={[planetSize * 1.5, planetSize * 2.5, 128]} />
      <meshStandardMaterial map={ringTexture} transparent opacity={0.9} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function MoonOrbit({ moon, planetSize }: { moon: Moon; planetSize: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const orbitRef = useRef<THREE.Group>(null)
  const distance = moon.distance || 5

  useFrame(({ clock }) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y = clock.getElapsedTime() * 0.5
    }
  })

  return (
    <group ref={orbitRef}>
      <mesh ref={meshRef} position={[distance, 0, 0]}>
        <sphereGeometry args={[moon.size * planetSize * 0.3, 32, 32]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.02, distance + 0.02, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export function Planet3D({ textureUrl, moons, planetName, planetSize = 3.5, rotationSpeed = 0.002 }: Planet3DProps) {
  const isSaturn = planetName.toLowerCase() === "saturn"

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <PlanetSphere
          textureUrl={textureUrl}
          planetSize={planetSize}
          rotationSpeed={rotationSpeed}
          planetName={planetName}
        />

        {isSaturn && <SaturnRings planetSize={planetSize} />}

        {moons.map((moon, index) => (
          <MoonOrbit key={index} moon={moon} planetSize={planetSize} />
        ))}

        <OrbitControls enableZoom={true} enablePan={false} minDistance={4} maxDistance={1000} />
      </Canvas>
    </div>
  )
}
