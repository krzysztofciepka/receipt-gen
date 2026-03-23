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
    label: "Holz",
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
    label: "Marmor",
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
    label: "Dunkel",
    icon: "🖥️",
    createLighting: () => ({
      ambientColor: 0x222222,
      ambientIntensity: 0.3,
      pointColor: 0xffffff,
      pointIntensity: 1.0,
      pointPosition: [0, 4, 0],
    }),
  },
}

export const angleConfigs: Record<AnglePreset, AngleConfig> = {
  flat: {
    label: "Flach",
    cameraPosition: [0, 5, 0.01],
    cameraLookAt: [0, 0, 0],
    receiptRotationZ: 0,
    curlIntensity: 0.02,
    wrinkle: false,
  },
  angled: {
    label: "Schräg",
    cameraPosition: [1, 4.5, 1],
    cameraLookAt: [0, 0, 0],
    receiptRotationZ: -Math.PI / 12,
    curlIntensity: 0.05,
    wrinkle: false,
  },
  perspective: {
    label: "Perspektive",
    cameraPosition: [0, 2.5, 4.3],
    cameraLookAt: [0, 0, 0],
    receiptRotationZ: 0,
    curlIntensity: 0.08,
    wrinkle: false,
  },
  crumpled: {
    label: "Zerknittert",
    cameraPosition: [0.2, 4, 0.8],
    cameraLookAt: [0, 0, 0],
    receiptRotationZ: Math.PI / 36,
    curlIntensity: 0.12,
    wrinkle: true,
  },
}
