import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={receipt.paymentMethod}
          onValueChange={(v) =>
            dispatch({ type: "SET_FIELD", field: "paymentMethod", value: v ?? "Karte" })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Karte">Karte</SelectItem>
            <SelectItem value="Bar">Bar</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1.5">
          <Label className="shrink-0 text-xs text-muted-foreground">
            MwSt
          </Label>
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
      <Input
        type="number"
        min={0}
        step={0.01}
        placeholder={`Bezahlt (auto = ${formatCurrency(totals.total)})`}
        value={receipt.amountPaid}
        onChange={(e) =>
          dispatch({ type: "SET_FIELD", field: "amountPaid", value: e.target.value })
        }
      />

      {/* Totals */}
      <div className="space-y-1 rounded-lg bg-muted/50 p-3 font-mono text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">ZWISCHENSUMME</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">NETTO</span>
          <span>{formatCurrency(totals.net)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            MwSt {receipt.vatRate}%
          </span>
          <span>{formatCurrency(totals.vat)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>GESAMT</span>
          <span>{formatCurrency(totals.total)}</span>
        </div>
        {receipt.paymentMethod === "Bar" && (
          <>
            <div className="flex justify-between text-muted-foreground">
              <span>Bezahlt</span>
              <span>{formatCurrency(totals.paid)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Rückgeld</span>
              <span>{formatCurrency(totals.change)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
