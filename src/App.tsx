import { useRef } from "react"
import { useReceipt } from "@/hooks/use-receipt"
import { ReceiptForm } from "@/components/receipt-form/receipt-form"
import { ReceiptPreview } from "@/components/receipt-preview"

export default function App() {
  const { receipt, dispatch, totals } = useReceipt()
  const previewRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="w-[440px] shrink-0 overflow-y-auto border-r border-border p-6">
        <h1 className="mb-4 text-lg font-semibold">Belegdaten</h1>
        <ReceiptForm receipt={receipt} dispatch={dispatch} totals={totals} />
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-1 justify-center bg-muted/30 p-6">
          <div className="self-start rounded-md shadow-lg">
            <ReceiptPreview receipt={receipt} totals={totals} previewRef={previewRef} />
          </div>
        </div>
        <div className="border-t border-border p-6">
          <p className="text-center text-muted-foreground">Photo generation coming next...</p>
        </div>
      </div>
    </div>
  )
}
