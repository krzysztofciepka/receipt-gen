import { useCallback, useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { capturePreview, triggerDownload } from "@/lib/capture-preview"

interface PreviewDownloadButtonProps {
  previewRef: React.RefObject<HTMLDivElement | null>
  className?: string
}

export function PreviewDownloadButton({ previewRef, className }: PreviewDownloadButtonProps) {
  const [busy, setBusy] = useState(false)

  const handleDownload = useCallback(async () => {
    if (!previewRef.current || busy) return
    setBusy(true)
    try {
      const canvas = await capturePreview(previewRef.current)
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      )
      if (!blob) return
      triggerDownload(URL.createObjectURL(blob), "receipt.png")
    } finally {
      setBusy(false)
    }
  }, [previewRef, busy])

  return (
    <Button
      onClick={handleDownload}
      disabled={busy}
      variant="outline"
      size="sm"
      className={className}
    >
      <Download className="mr-1.5 size-3.5" />
      {busy ? "Preparing..." : "Download Preview"}
    </Button>
  )
}
