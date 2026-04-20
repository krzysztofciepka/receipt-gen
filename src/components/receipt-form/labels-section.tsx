import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ReceiptData } from "@/types"
import type { ReceiptDispatch } from "@/hooks/use-receipt"

interface LabelsSectionProps {
  receipt: ReceiptData
  dispatch: ReceiptDispatch
}

const labelFields: { key: keyof ReceiptData; label: string }[] = [
  { key: "phoneLabel", label: "Phone label" },
  { key: "vatNumberLabel", label: "VAT number label" },
  { key: "receiptNumberLabel", label: "Receipt # label" },
  { key: "dateLabel", label: "Date label" },
  { key: "cashierLabel", label: "Cashier label" },
  { key: "totalLabel", label: "Total label" },
  { key: "netLabel", label: "Net label" },
  { key: "vatLabel", label: "VAT label" },
  { key: "paymentMethodLabel", label: "Payment method label" },
  { key: "paidLabel", label: "Paid label" },
  { key: "changeLabel", label: "Change label" },
]

export function LabelsSection({ receipt, dispatch }: LabelsSectionProps) {
  const set = (field: keyof ReceiptData, value: string) =>
    dispatch({ type: "SET_FIELD", field, value })

  return (
    <div className="grid grid-cols-2 gap-2">
      {labelFields.map(({ key, label }) => (
        <div key={key} className="space-y-1">
          <Label className="text-xs text-muted-foreground">{label}</Label>
          <Input
            value={receipt[key] as string}
            onChange={(e) => set(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}
