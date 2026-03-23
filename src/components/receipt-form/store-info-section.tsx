import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ReceiptData } from "@/types"
import type { ReceiptDispatch } from "@/hooks/use-receipt"

interface StoreInfoSectionProps {
  receipt: ReceiptData
  dispatch: ReceiptDispatch
}

export function StoreInfoSection({ receipt, dispatch }: StoreInfoSectionProps) {
  const set = (field: keyof ReceiptData, value: string) =>
    dispatch({ type: "SET_FIELD", field, value })

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Store Name</Label>
        <Input
          placeholder="Store name"
          value={receipt.storeName}
          onChange={(e) => set("storeName", e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Address</Label>
        <Input
          placeholder="Street and number"
          value={receipt.addressLine1}
          onChange={(e) => set("addressLine1", e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">City</Label>
        <Input
          placeholder="ZIP and city"
          value={receipt.addressLine2}
          onChange={(e) => set("addressLine2", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Phone</Label>
          <Input
            placeholder="Phone number"
            value={receipt.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">VAT Number</Label>
          <Input
            placeholder="VAT number"
            value={receipt.vatNumber}
            onChange={(e) => set("vatNumber", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
