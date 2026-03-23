import { useRef } from "react"
import { useReceipt } from "@/hooks/use-receipt"
import { useDarkMode } from "@/hooks/use-dark-mode"
import { ReceiptForm } from "@/components/receipt-form/receipt-form"
import { ReceiptPreview } from "@/components/receipt-preview"
import { PhotoGenerator } from "@/components/photo-generator/photo-generator"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export default function App() {
  const { receipt, dispatch, totals } = useReceipt()
  const previewRef = useRef<HTMLDivElement>(null)
  const { dark, toggle } = useDarkMode()

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="w-[440px] shrink-0 overflow-y-auto border-r border-border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Receipt Data</h1>
          <Button variant="ghost" size="icon" onClick={toggle}>
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>
        <ReceiptForm receipt={receipt} dispatch={dispatch} totals={totals} />
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-1 justify-center bg-muted/30 p-6">
          <div className="self-start rounded-md shadow-lg">
            <ReceiptPreview receipt={receipt} totals={totals} previewRef={previewRef} />
          </div>
        </div>
        <div className="border-t border-border p-6">
          <PhotoGenerator previewRef={previewRef} />
        </div>
      </div>
    </div>
  )
}
