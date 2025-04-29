"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Mesh, MeshStandardMaterial } from "three"

interface ProductViewerProps {
  modelPath: string
}

function Model({ modelPath }: { modelPath: string }) {
  const meshRef = useRef<Mesh>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (modelPath.startsWith("data:")) {
      try {
        const [header, data] = modelPath.split(",")
        const mimeType = header.match(/:(.*?);/)?.[1] || "model/gltf-binary"
        const binaryData = atob(data)
        const arrayBuffer = new ArrayBuffer(binaryData.length)
        const uint8Array = new Uint8Array(arrayBuffer)

        for (let i = 0; i < binaryData.length; i++) {
          uint8Array[i] = binaryData.charCodeAt(i)
        }

        const blob = new Blob([arrayBuffer], { type: mimeType })
        const url = URL.createObjectURL(blob)
        setBlobUrl(url)

        return () => {
          URL.revokeObjectURL(url)
          if (loadTimeout) clearTimeout(loadTimeout)
        }
      } catch (err) {
        console.error("Data URL processing failed:", err)
        setError("Invalid model data format")
        setLoading(false)
      }
    }
  }, [modelPath])

  const { scene, error: loadError } = useGLTF(
    blobUrl || modelPath,
    undefined,
    undefined,
    undefined,
    (error) => {
      console.error("Model load error:", error)
      setError(`Failed to load model: ${error.message || "Unknown error"}`)
      setLoading(false)
      if (loadTimeout) clearTimeout(loadTimeout)
    },
  )

  useEffect(() => {
    if (!scene) {
      const timeout = setTimeout(() => {
        setError("Model loading timed out")
        setLoading(false)
      }, 15000)
      setLoadTimeout(timeout)
    }
    return () => {
      if (loadTimeout) clearTimeout(loadTimeout)
    }
  }, [scene])

  useEffect(() => {
    if (loadError) {
      setError(`Model load failed: ${loadError.message || "Unknown error"}`)
      setLoading(false)
      if (loadTimeout) clearTimeout(loadTimeout)
    }
  }, [loadError])

  useEffect(() => {
    if (!scene || error) return

    try {
      const clonedScene = scene.clone()

      if (meshRef.current) {
        while (meshRef.current.children.length > 0) {
          meshRef.current.remove(meshRef.current.children[0])
        }
        meshRef.current.add(clonedScene)
      }

      setLoading(false)
      if (loadTimeout) clearTimeout(loadTimeout)
    } catch (err) {
      console.error("Model processing error:", err)
      setError(`Error processing model: ${err instanceof Error ? err.message : "Unknown error"}`)
      setLoading(false)
      if (loadTimeout) clearTimeout(loadTimeout)
    }
  }, [scene, error])

  if (error) {
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <Html center>
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg max-w-xs text-center">{error}</div>
        </Html>
      </group>
    )
  }

  if (loading) {
    return (
      <Html center>
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
          <span className="text-muted-foreground">Loading model...</span>
        </div>
      </Html>
    )
  }

  return <primitive object={scene} ref={meshRef} />
}

function ProductViewer({ modelPath }: ProductViewerProps) {
  const [isRotating, setIsRotating] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted || !modelPath) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/30">
        <div className="text-muted-foreground">Initializing viewer...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative bg-muted/30 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }} shadows frameloop={isRotating ? "always" : "demand"}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} />

        <Suspense fallback={<FallbackBox />}>
          <Model modelPath={modelPath} />
        </Suspense>

        <ContactShadows position={[0, -0.5, 0]} opacity={0.75} scale={10} blur={2.5} far={1} color="#000000" />
        <Environment preset="sunset" />

        <OrbitControls
          autoRotate={isRotating}
          autoRotateSpeed={1.5}
          enableZoom={true}
          enablePan={true}
          minDistance={2}
          maxDistance={10}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.75}
        />
      </Canvas>

      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="bg-background/90 hover:bg-background transition-colors px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          <span className={`w-3 h-3 rounded-full ${isRotating ? "bg-primary" : "bg-destructive"}`} />
          {isRotating ? "Auto Rotating" : "Rotation Paused"}
        </button>
      </div>
    </div>
  )
}

function FallbackBox() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-muted border-t-primary" />
        <span className="text-muted-foreground">Initializing viewer...</span>
      </div>
    </Html>
  )
}

const DynamicProductViewer = dynamic(() => Promise.resolve(ProductViewer), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/30">
      <div className="animate-pulse flex flex-col items-center gap-2">
        <div className="w-8 h-8 bg-muted rounded-full" />
        <span className="text-muted-foreground text-sm">Loading 3D viewer...</span>
      </div>
    </div>
  ),
})

export const ProductViewer3D = DynamicProductViewer