import * as THREE from "three"
import type { SurfacePreset, AnglePreset } from "@/types"
import { surfaceConfigs, angleConfigs } from "./presets"
import { createWoodTexture, createMarbleTexture, createDarkDeskTexture, createGraniteTexture, createTableclothTexture, createLeatherTexture, createConcreteTexture } from "./textures"

// 9:16 vertical — typical smartphone photo
const OUTPUT_WIDTH = 1080
const OUTPUT_HEIGHT = 1920

function createSurfaceTexture(preset: SurfacePreset): THREE.CanvasTexture {
  switch (preset) {
    case "wood": return createWoodTexture()
    case "marble": return createMarbleTexture()
    case "dark": return createDarkDeskTexture()
    case "granite": return createGraniteTexture()
    case "tablecloth": return createTableclothTexture()
    case "leather": return createLeatherTexture()
    case "concrete": return createConcreteTexture()
  }
}

function applyPaperCurl(
  geometry: THREE.PlaneGeometry,
  curlIntensity: number,
  wrinkle: boolean,
): void {
  const positions = geometry.attributes.position
  const params = geometry.parameters
  const halfW = params.width / 2
  const halfH = params.height / 2

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)

    // Gentle upward curl at the long edges (top/bottom of receipt)
    const yNorm = y / halfH // -1 to 1
    let z = curlIntensity * yNorm * yNorm

    // Slight lateral curl at left/right edges
    const xNorm = x / halfW // -1 to 1
    z += curlIntensity * 0.3 * xNorm * xNorm

    if (wrinkle) {
      // Subtle low-frequency waviness, not random noise
      z += curlIntensity * 0.15 * Math.sin(xNorm * 4 + yNorm * 3)
      z += curlIntensity * 0.1 * Math.sin(xNorm * 2 - yNorm * 5)
    }

    positions.setZ(i, z)
  }
  positions.needsUpdate = true
  geometry.computeVertexNormals()
}

function addFilmGrain(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const len = data.length
  for (let i = 0; i < len; i += 4) {
    const noise = (Math.random() * 16 - 8) | 0
    data[i] = data[i] + noise
    data[i + 1] = data[i + 1] + noise
    data[i + 2] = data[i + 2] + noise
  }
  ctx.putImageData(imageData, 0, 0)
}

function addVignette(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, width * 0.3,
    width / 2, height / 2, width * 0.7,
  )
  gradient.addColorStop(0, "rgba(0,0,0,0)")
  gradient.addColorStop(1, "rgba(0,0,0,0.3)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

export async function generatePhoto(
  receiptCanvas: HTMLCanvasElement,
  surface: SurfacePreset,
  angle: AnglePreset,
): Promise<Blob> {
  const surfaceConfig = surfaceConfigs[surface]
  const angleConfig = angleConfigs[angle]
  const lighting = surfaceConfig.createLighting()

  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  renderer.setSize(OUTPUT_WIDTH, OUTPUT_HEIGHT)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(40, OUTPUT_WIDTH / OUTPUT_HEIGHT, 0.1, 100)
  camera.position.set(...angleConfig.cameraPosition)
  camera.lookAt(new THREE.Vector3(...angleConfig.cameraLookAt))

  const ambient = new THREE.AmbientLight(lighting.ambientColor, lighting.ambientIntensity)
  scene.add(ambient)

  const point = new THREE.PointLight(lighting.pointColor, lighting.pointIntensity)
  point.position.set(...lighting.pointPosition)
  point.castShadow = true
  point.shadow.mapSize.width = 2048
  point.shadow.mapSize.height = 2048
  scene.add(point)

  const surfaceTexture = createSurfaceTexture(surface)
  const surfaceGeometry = new THREE.PlaneGeometry(10, 10)
  const surfaceMaterial = new THREE.MeshStandardMaterial({
    map: surfaceTexture,
    roughness: 0.8,
    metalness: 0.1,
  })
  const surfaceMesh = new THREE.Mesh(surfaceGeometry, surfaceMaterial)
  surfaceMesh.rotation.x = -Math.PI / 2
  surfaceMesh.position.y = -0.01
  surfaceMesh.receiveShadow = true
  scene.add(surfaceMesh)

  const receiptTexture = new THREE.CanvasTexture(receiptCanvas)
  receiptTexture.minFilter = THREE.LinearFilter
  receiptTexture.magFilter = THREE.LinearFilter

  const aspect = receiptCanvas.height / receiptCanvas.width
  const receiptWidth = 1.0
  const receiptHeight = receiptWidth * aspect

  const receiptGeometry = new THREE.PlaneGeometry(receiptWidth, receiptHeight, 32, 64)
  applyPaperCurl(receiptGeometry, angleConfig.curlIntensity, angleConfig.wrinkle)

  const receiptMaterial = new THREE.MeshStandardMaterial({
    map: receiptTexture,
    roughness: 0.9,
    metalness: 0.0,
    side: THREE.DoubleSide,
    transparent: false,
    depthWrite: true,
  })
  const receiptMesh = new THREE.Mesh(receiptGeometry, receiptMaterial)
  receiptMesh.rotation.x = -Math.PI / 2
  receiptMesh.rotation.z = angleConfig.receiptRotationZ
  receiptMesh.position.y = 0.05
  receiptMesh.renderOrder = 1
  receiptMesh.castShadow = true
  scene.add(receiptMesh)

  renderer.render(scene, camera)

  // Post-processing: copy WebGL canvas to a 2D canvas (WebGL canvas can't get a 2D context)
  const postCanvas = document.createElement("canvas")
  postCanvas.width = OUTPUT_WIDTH
  postCanvas.height = OUTPUT_HEIGHT
  const ctx = postCanvas.getContext("2d", { willReadFrequently: true })!
  ctx.drawImage(renderer.domElement, 0, 0)
  addVignette(ctx, OUTPUT_WIDTH, OUTPUT_HEIGHT)
  addFilmGrain(ctx, OUTPUT_WIDTH, OUTPUT_HEIGHT)

  const blob = await new Promise<Blob>((resolve, reject) => {
    postCanvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to create blob"))),
      "image/jpeg",
      0.92,
    )
  })

  renderer.dispose()
  receiptTexture.dispose()
  surfaceTexture.dispose()
  receiptGeometry.dispose()
  receiptMaterial.dispose()
  surfaceGeometry.dispose()
  surfaceMaterial.dispose()

  return blob
}
