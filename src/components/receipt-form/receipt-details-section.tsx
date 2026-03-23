import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ReceiptData } from "@/types"
import type { ReceiptDispatch } from "@/hooks/use-receipt"

interface ReceiptDetailsSectionProps {
  receipt: ReceiptData
  dispatch: ReceiptDispatch
}

export function ReceiptDetailsSection({ receipt, dispatch }: ReceiptDetailsSectionProps) {
  const set = (field: keyof ReceiptData, value: string) =>
    dispatch({ type: "SET_FIELD", field, value })

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Beleg-Nr.</Label>
          <Input
            placeholder="Beleg-Nr."
            value={receipt.receiptNumber}
            onChange={(e) => set("receiptNumber", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Datum</Label>
          <Input
            placeholder="TT.MM.JJJJ HH:MM"
            value={receipt.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Kassierer/in</Label>
        <Input
          placeholder="Name"
          value={receipt.cashier}
          onChange={(e) => set("cashier", e.target.value)}
        />
      </div>
    </div>
  )
}
