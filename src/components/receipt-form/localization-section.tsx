import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ReceiptData } from "@/types"
import type { ReceiptDispatch } from "@/hooks/use-receipt"

interface LocalizationSectionProps {
  receipt: ReceiptData
  dispatch: ReceiptDispatch
}

const presets: { label: string; values: Partial<ReceiptData> }[] = [
  {
    label: "UK (£, en-GB)",
    values: {
      currencySymbol: "£",
      currencyPosition: "prefix",
      locale: "en-GB",
      phoneLabel: "Tel:",
      vatNumberLabel: "VAT No:",
      receiptNumberLabel: "Receipt #:",
      dateLabel: "Date:",
      cashierLabel: "Cashier:",
      totalLabel: "TOTAL",
      netLabel: "Net",
      vatLabel: "VAT",
      paymentMethodLabel: "Payment",
      paidLabel: "Paid",
      changeLabel: "Change",
      paymentMethod: "Card",
    },
  },
  {
    label: "Germany (€, de-DE)",
    values: {
      currencySymbol: "€",
      currencyPosition: "suffix",
      locale: "de-DE",
      phoneLabel: "Tel:",
      vatNumberLabel: "USt-IdNr:",
      receiptNumberLabel: "Beleg-Nr:",
      dateLabel: "Datum:",
      cashierLabel: "Kasse:",
      totalLabel: "GESAMT",
      netLabel: "Netto",
      vatLabel: "MwSt",
      paymentMethodLabel: "Zahlungsart",
      paidLabel: "Bezahlt",
      changeLabel: "Rückgeld",
      paymentMethod: "Karte",
    },
  },
  {
    label: "USA ($, en-US)",
    values: {
      currencySymbol: "$",
      currencyPosition: "prefix",
      locale: "en-US",
      phoneLabel: "Tel:",
      vatNumberLabel: "Tax ID:",
      receiptNumberLabel: "Receipt #:",
      dateLabel: "Date:",
      cashierLabel: "Cashier:",
      totalLabel: "TOTAL",
      netLabel: "Subtotal",
      vatLabel: "Tax",
      paymentMethodLabel: "Payment",
      paidLabel: "Paid",
      changeLabel: "Change",
      paymentMethod: "Card",
    },
  },
]

export function LocalizationSection({ receipt, dispatch }: LocalizationSectionProps) {
  const set = <K extends keyof ReceiptData>(field: K, value: ReceiptData[K]) =>
    dispatch({ type: "SET_FIELD", field, value })

  const applyPreset = (label: string | null) => {
    if (!label) return
    const preset = presets.find((p) => p.label === label)
    if (!preset) return
    for (const [k, v] of Object.entries(preset.values)) {
      dispatch({ type: "SET_FIELD", field: k as keyof ReceiptData, value: v as never })
    }
  }

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Preset</Label>
        <Select onValueChange={applyPreset}>
          <SelectTrigger>
            <SelectValue placeholder="Apply a regional preset..." />
          </SelectTrigger>
          <SelectContent>
            {presets.map((p) => (
              <SelectItem key={p.label} value={p.label}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Symbol</Label>
          <Input
            value={receipt.currencySymbol}
            onChange={(e) => set("currencySymbol", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Position</Label>
          <Select
            value={receipt.currencyPosition}
            onValueChange={(v) =>
              set("currencyPosition", (v as "prefix" | "suffix") ?? "suffix")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prefix">Prefix (£5)</SelectItem>
              <SelectItem value="suffix">Suffix (5 €)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Locale</Label>
          <Input
            placeholder="en-GB"
            value={receipt.locale}
            onChange={(e) => set("locale", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
