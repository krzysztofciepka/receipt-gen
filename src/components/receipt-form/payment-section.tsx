import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import type { ReceiptData, Totals } from "@/types"
import type { ReceiptDispatch } from "@/hooks/use-receipt"

interface PaymentSectionProps {
  receipt: ReceiptData
  dispatch: ReceiptDispatch
  totals: Totals
}

export function PaymentSection({ receipt, dispatch, totals }: PaymentSectionProps) {
  const money = (v: number) =>
    formatCurrency(v, receipt.currencySymbol, receipt.currencyPosition, receipt.locale)

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Payment Method</Label>
          <Input
            placeholder="Card / Cash / Karte / Bar"
            value={receipt.paymentMethod}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "paymentMethod", value: e.target.value })
            }
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">VAT Rate</Label>
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              min={0}
              max={100}
              value={receipt.vatRate}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "vatRate",
                  value: parseFloat(e.target.value) || 0,
                })
              }
              className="text-right"
            />
            <span className="text-xs text-muted-foreground">%</span>
          </div>
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={receipt.isCashPayment}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "isCashPayment", value: e.target.checked })
          }
          className="size-4 accent-foreground"
        />
        Cash payment (show Paid and Change)
      </label>
      {receipt.isCashPayment && (
        <Input
          type="number"
          min={0}
          step={0.01}
          placeholder={`Amount paid (auto = ${money(totals.total)})`}
          value={receipt.amountPaid}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "amountPaid", value: e.target.value })
          }
        />
      )}

      {/* Totals */}
      <div className="space-y-1 rounded-lg bg-muted/50 p-3 font-mono text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">SUBTOTAL</span>
          <span>{money(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{receipt.netLabel || "NET"}</span>
          <span>{money(totals.net)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {receipt.vatLabel || "VAT"} {receipt.vatRate}%
          </span>
          <span>{money(totals.vat)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>{receipt.totalLabel || "TOTAL"}</span>
          <span>{money(totals.total)}</span>
        </div>
        {receipt.isCashPayment && (
          <>
            <div className="flex justify-between text-muted-foreground">
              <span>{receipt.paidLabel || "Paid"}</span>
              <span>{money(totals.paid)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{receipt.changeLabel || "Change"}</span>
              <span>{money(totals.change)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
