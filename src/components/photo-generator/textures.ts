import * as THREE from "three"

export function createWoodTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#8B6914"
  ctx.fillRect(0, 0, width, height)
  for (let y = 0; y < height; y += 2) {
    const lightness = 40 + Math.sin(y * 0.05) * 10 + Math.random() * 5
    ctx.fillStyle = `hsl(35, 60%, ${lightness}%)`
    ctx.fillRect(0, y, width, 2)
  }
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.beginPath()
    ctx.ellipse(x, y, 20 + Math.random() * 30, 10 + Math.random() * 15, 0, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(60, 30, 0, 0.3)"
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

export function createMarbleTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#f0ece4"
  ctx.fillRect(0, 0, width, height)
  ctx.strokeStyle = "rgba(180, 170, 160, 0.3)"
  ctx.lineWidth = 2
  for (let i = 0; i < 8; i++) {
    ctx.beginPath()
    const startX = Math.random() * width
    const startY = Math.random() * height
    ctx.moveTo(startX, startY)
    for (let j = 0; j < 5; j++) {
      ctx.quadraticCurveTo(
        startX + (Math.random() - 0.5) * 400,
        startY + (Math.random() - 0.5) * 400,
        startX + (Math.random() - 0.5) * 600,
        startY + (Math.random() - 0.5) * 600,
      )
    }
    ctx.stroke()
  }
  const imageData = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 10
    imageData.data[i] += noise
    imageData.data[i + 1] += noise
    imageData.data[i + 2] += noise
  }
  ctx.putImageData(imageData, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

export function createDarkDeskTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#1a1a1a"
  ctx.fillRect(0, 0, width, height)
  const imageData = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 15
    imageData.data[i] += noise
    imageData.data[i + 1] += noise
    imageData.data[i + 2] += noise
  }
  ctx.putImageData(imageData, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}
