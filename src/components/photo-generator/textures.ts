import * as THREE from "three"

function makeTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

function makeCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  return [canvas, canvas.getContext("2d")!]
}

export function createWoodTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(width, height)
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
  return makeTexture(canvas)
}

export function createMarbleTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(width, height)
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
  return makeTexture(canvas)
}

export function createDarkDeskTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(width, height)
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
  return makeTexture(canvas)
}

export function createGraniteTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(width, height)
  ctx.fillStyle = "#8a8a8a"
  ctx.fillRect(0, 0, width, height)
  const imageData = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const speckle = (Math.random() - 0.5) * 60
    const base = 138 + speckle
    imageData.data[i] = base
    imageData.data[i + 1] = base - 2
    imageData.data[i + 2] = base + 2
  }
  ctx.putImageData(imageData, 0, 0)
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = 1 + Math.random() * 3
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(30, 30, 35, ${0.3 + Math.random() * 0.3})`
    ctx.fill()
  }
  return makeTexture(canvas)
}

export function createTableclothTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(width, height)
  ctx.fillStyle = "#f5f0e8"
  ctx.fillRect(0, 0, width, height)
  const cellSize = 64
  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      if (((y / cellSize) + (x / cellSize)) % 2 === 0) {
        ctx.fillStyle = "rgba(180, 40, 40, 0.35)"
        ctx.fillRect(x, y, cellSize, cellSize)
      }
    }
  }
  const imageData = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 8
    imageData.data[i] += noise
    imageData.data[i + 1] += noise
    imageData.data[i + 2] += noise
  }
  ctx.putImageData(imageData, 0, 0)
  return makeTexture(canvas)
}

export function createLeatherTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(width, height)
  ctx.fillStyle = "#3d2b1f"
  ctx.fillRect(0, 0, width, height)
  const imageData = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const px = (i / 4) % width
    const py = Math.floor(i / 4 / width)
    const grain = Math.sin(px * 0.8) * Math.sin(py * 0.6) * 8
    const noise = (Math.random() - 0.5) * 12
    imageData.data[i] += grain + noise
    imageData.data[i + 1] += (grain + noise) * 0.8
    imageData.data[i + 2] += (grain + noise) * 0.6
  }
  ctx.putImageData(imageData, 0, 0)
  return makeTexture(canvas)
}

export function createConcreteTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(width, height)
  ctx.fillStyle = "#b8b4ac"
  ctx.fillRect(0, 0, width, height)
  const imageData = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30
    const base = 184 + noise
    imageData.data[i] = base
    imageData.data[i + 1] = base - 1
    imageData.data[i + 2] = base - 4
  }
  ctx.putImageData(imageData, 0, 0)
  ctx.strokeStyle = "rgba(100, 95, 88, 0.2)"
  ctx.lineWidth = 1
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    let cx = Math.random() * width
    let cy = Math.random() * height
    ctx.moveTo(cx, cy)
    for (let j = 0; j < 8; j++) {
      cx += (Math.random() - 0.5) * 120
      cy += (Math.random() - 0.5) * 120
      ctx.lineTo(cx, cy)
    }
    ctx.stroke()
  }
  return makeTexture(canvas)
}
