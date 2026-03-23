import { useState, useCallback } from "react"
import html2canvas from "html2canvas"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { SurfacePreset, AnglePreset } from "@/types"
import { surfaceConfigs, angleConfigs } from "./presets"
import { generatePhoto } from "./scene"
import { cn } from "@/lib/utils"

const angleIcons: Record<AnglePreset, React.ReactNode> = {
  flat: (
    <svg viewBox="0 0 40 40" className="size-8">
      <rect x="10" y="8" width="20" height="28" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <line x1="14" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="14" y1="18" x2="24" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="14" y1="22" x2="26" y2="22" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="14" y1="26" x2="22" y2="26" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    </svg>
  ),
  angled: (
    <svg viewBox="0 0 40 40" className="size-8">
      <g transform="rotate(-12, 20, 20)">
        <rect x="10" y="8" width="20" height="28" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <line x1="14" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="14" y1="18" x2="24" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="14" y1="22" x2="26" y2="22" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="14" y1="26" x2="22" y2="26" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      </g>
    </svg>
  ),
  "perspective-60": (
    <svg viewBox="0 0 40 40" className="size-8">
      <polygon points="12,6 28,6 30,34 10,34" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="14" y1="12" x2="26" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="13.5" y1="17" x2="25" y2="17" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="13" y1="22" x2="27" y2="22" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="12.5" y1="27" x2="24" y2="27" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    </svg>
  ),
  "perspective-75": (
    <svg viewBox="0 0 40 40" className="size-8">
      <polygon points="14,4 26,4 29,36 11,36" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="15" y1="10" x2="25" y2="10" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="14.5" y1="16" x2="25.5" y2="16" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="14" y1="22" x2="26" y2="22" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="13.5" y1="28" x2="24.5" y2="28" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    </svg>
  ),
  crumpled: (
    <svg viewBox="0 0 40 40" className="size-8">
      <g transform="rotate(5, 20, 20)">
        <path d="M11,8 Q13,12 10,16 Q12,20 11,24 Q13,28 10,32 L10,34 L30,34 Q28,30 30,26 Q28,22 30,18 Q28,14 30,10 L30,8 Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="14" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="14" y1="19" x2="24" y2="18.5" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="14" y1="24" x2="26" y2="23.5" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      </g>
    </svg>
  ),
}

interface PhotoGeneratorProps {
  previewRef: React.RefObject<HTMLDivElement | null>
}

export function PhotoGenerator({ previewRef }: PhotoGeneratorProps) {
  const [surface, setSurface] = useState<SurfacePreset>("wood")
  const [angle, setAngle] = useState<AnglePreset>("flat")
  const [generating, setGenerating] = useState(false)

  const handleGenerate = useCallback(async () => {
    if (!previewRef.current || generating) return
    setGenerating(true)
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        onclone: (clonedDoc) => {
          // html2canvas cannot parse OKLCH color functions used by Tailwind CSS 4.
          // Remove all stylesheets and inline a minimal reset on the cloned document
          // so html2canvas only sees standard hex colors.
          clonedDoc.querySelectorAll("style, link[rel='stylesheet']").forEach((el) => el.remove())
          const style = clonedDoc.createElement("style")
          style.textContent = `
            *, *::before, *::after { border-color: transparent; outline-color: transparent; }
            body { background: #ffffff; color: #000000; margin: 0; }
          `
          clonedDoc.head.appendChild(style)
        },
      })
      const blob = await generatePhoto(canvas, surface, angle)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "receipt.jpg"
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }, [previewRef, surface, angle, generating])

  return (
    <div className="space-y-4">
      {/* Surface presets */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Surface</Label>
        <div className="flex gap-2">
          {(Object.entries(surfaceConfigs) as [SurfacePreset, typeof surfaceConfigs.wood][]).map(
            ([key, config]) => (
              <button
                key={key}
                onClick={() => setSurface(key)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors",
                  surface === key
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50",
                )}
              >
                <span className="text-lg">{config.icon}</span>
                <span>{config.label}</span>
              </button>
            ),
          )}
        </div>
      </div>

      {/* Angle presets */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Angle</Label>
        <div className="flex gap-2">
          {(Object.entries(angleConfigs) as [AnglePreset, typeof angleConfigs.flat][]).map(
            ([key, config]) => (
              <button
                key={key}
                onClick={() => setAngle(key)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors",
                  angle === key
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50",
                )}
              >
                {angleIcons[key]}
                <span>{config.label}</span>
              </button>
            ),
          )}
        </div>
      </div>

      {/* Generate button */}
      <Button onClick={handleGenerate} disabled={generating} className="w-full" size="lg">
        {generating ? "Generating..." : "Generate Photo & Download"}
      </Button>
    </div>
  )
}
