import { useReceipt } from "@/hooks/use-receipt"
import { ReceiptForm } from "@/components/receipt-form/receipt-form"

export default function App() {
  const { receipt, dispatch, totals } = useReceipt()

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="w-[440px] shrink-0 overflow-y-auto border-r border-border p-6">
        <h1 className="mb-4 text-lg font-semibold">Belegdaten</h1>
        <ReceiptForm receipt={receipt} dispatch={dispatch} totals={totals} />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-muted-foreground">Preview coming next...</p>
      </div>
    </div>
  )
}
