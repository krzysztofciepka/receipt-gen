import { useState, useCallback } from "react"
import html2canvas from "html2canvas"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { SurfacePreset, AnglePreset } from "@/types"
import { surfaceConfigs, angleConfigs } from "./presets"
import { generatePhoto } from "./scene"
import { cn } from "@/lib/utils"

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
        <Label className="text-xs font-medium text-muted-foreground">Oberfläche</Label>
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
        <Label className="text-xs font-medium text-muted-foreground">Winkel</Label>
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
                <span>{config.label}</span>
              </button>
            ),
          )}
        </div>
      </div>

      {/* Generate button */}
      <Button onClick={handleGenerate} disabled={generating} className="w-full" size="lg">
        {generating ? "Wird generiert..." : "Foto generieren & herunterladen"}
      </Button>
    </div>
  )
}
