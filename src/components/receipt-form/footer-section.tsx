import { Input } from "@/components/ui/input"
import type { ReceiptData } from "@/types"
import type { ReceiptDispatch } from "@/hooks/use-receipt"

interface FooterSectionProps {
  receipt: ReceiptData
  dispatch: ReceiptDispatch
}

export function FooterSection({ receipt, dispatch }: FooterSectionProps) {
  const set = (field: keyof ReceiptData, value: string) =>
    dispatch({ type: "SET_FIELD", field, value })

  return (
    <div className="space-y-2">
      <Input
        placeholder="QR-Code Inhalt (optional)"
        value={receipt.qrCode}
        onChange={(e) => set("qrCode", e.target.value)}
      />
      <Input
        placeholder="Fußzeile"
        value={receipt.footer}
        onChange={(e) => set("footer", e.target.value)}
      />
    </div>
  )
}
