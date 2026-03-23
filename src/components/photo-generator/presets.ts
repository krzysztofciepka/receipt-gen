import type { SurfacePreset, AnglePreset } from "@/types"

export interface SurfaceConfig {
  label: string
  icon: string
  createLighting: () => LightingConfig
}

export interface LightingConfig {
  ambientColor: number
  ambientIntensity: number
  pointColor: number
  pointIntensity: number
  pointPosition: [number, number, number]
}

export interface AngleConfig {
  label: string
  cameraPosition: [number, number, number]
  cameraLookAt: [number, number, number]
  receiptRotationZ: number
  curlIntensity: number
  wrinkle: boolean
}

export const surfaceConfigs: Record<SurfacePreset, SurfaceConfig> = {
  wood: {
    label: "Wood",
    icon: "🪵",
    createLighting: () => ({
      ambientColor: 0xfff5e6,
      ambientIntensity: 0.4,
      pointColor: 0xffe4b5,
      pointIntensity: 0.8,
      pointPosition: [2, 4, 2],
    }),
  },
  marble: {
    label: "Marble",
    icon: "🪨",
    createLighting: () => ({
      ambientColor: 0xf0f0ff,
      ambientIntensity: 0.5,
      pointColor: 0xffffff,
      pointIntensity: 0.7,
      pointPosition: [0, 5, 2],
    }),
  },
  dark: {
    label: "Dark",
    icon: "🖥️",
    createLighting: () => ({
      ambientColor: 0x888888,
      ambientIntensity: 0.5,
      pointColor: 0xffffff,
      pointIntensity: 1.2,
      pointPosition: [0, 4, 1],
    }),
  },
  granite: {
    label: "Granite",
    icon: "🪨",
    createLighting: () => ({
      ambientColor: 0xe8e8e8,
      ambientIntensity: 0.5,
      pointColor: 0xffffff,
      pointIntensity: 0.7,
      pointPosition: [1, 5, 2],
    }),
  },
  tablecloth: {
    label: "Tablecloth",
    icon: "🍽️",
    createLighting: () => ({
      ambientColor: 0xfff8f0,
      ambientIntensity: 0.5,
      pointColor: 0xfffae6,
      pointIntensity: 0.7,
      pointPosition: [1, 4, 1],
    }),
  },
  leather: {
    label: "Leather",
    icon: "💼",
    createLighting: () => ({
      ambientColor: 0x998877,
      ambientIntensity: 0.4,
      pointColor: 0xffeedd,
      pointIntensity: 0.9,
      pointPosition: [2, 4, 1],
    }),
  },
  concrete: {
    label: "Concrete",
    icon: "🏗️",
    createLighting: () => ({
      ambientColor: 0xdddddd,
      ambientIntensity: 0.5,
      pointColor: 0xffffff,
      pointIntensity: 0.8,
      pointPosition: [0, 5, 2],
    }),
  },
}

export const angleConfigs: Record<AnglePreset, AngleConfig> = {
  flat: {
    label: "Flat",
    cameraPosition: [0, 5, 0.01],
    cameraLookAt: [0, 0, 0],
    receiptRotationZ: 0,
    curlIntensity: 0.02,
    wrinkle: false,
  },
  angled: {
    label: "Angled",
    cameraPosition: [1, 4.5, 1],
    cameraLookAt: [0, 0, 0],
    receiptRotationZ: -Math.PI / 12,
    curlIntensity: 0.05,
    wrinkle: false,
  },
  "perspective-30": {
    label: "30°",
    cameraPosition: [0, 2.5, 4.33],
    cameraLookAt: [0, 0, 0],
    receiptRotationZ: 0,
    curlIntensity: 0.06,
    wrinkle: false,
  },
  "perspective-45": {
    label: "45°",
    cameraPosition: [0, 3.54, 3.54],
    cameraLookAt: [0, 0, 0],
    receiptRotationZ: 0,
    curlIntensity: 0.08,
    wrinkle: false,
  },
  "perspective-60": {
    label: "60°",
    cameraPosition: [0, 4.33, 2.5],
    cameraLookAt: [0, 0, 0],
    receiptRotationZ: 0,
    curlIntensity: 0.08,
    wrinkle: false,
  },
  crumpled: {
    label: "Crumpled",
    cameraPosition: [0.2, 4, 0.8],
    cameraLookAt: [0, 0, 0],
    receiptRotationZ: Math.PI / 36,
    curlIntensity: 0.12,
    wrinkle: true,
  },
}
