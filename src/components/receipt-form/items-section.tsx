import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import type { ReceiptData } from "@/types"
import type { ReceiptDispatch } from "@/hooks/use-receipt"

interface ItemsSectionProps {
  receipt: ReceiptData
  dispatch: ReceiptDispatch
}

export function ItemsSection({ receipt, dispatch }: ItemsSectionProps) {
  return (
    <div className="space-y-2">
      {receipt.items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Input
            placeholder="Artikelname"
            value={item.name}
            onChange={(e) =>
              dispatch({ type: "SET_ITEM", index: i, field: "name", value: e.target.value })
            }
            className="flex-1"
          />
          <Input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) =>
              dispatch({
                type: "SET_ITEM",
                index: i,
                field: "quantity",
                value: parseInt(e.target.value) || 1,
              })
            }
            className="w-14 text-center"
          />
          <Input
            type="number"
            min={0}
            step={0.01}
            value={item.unitPrice}
            onChange={(e) =>
              dispatch({
                type: "SET_ITEM",
                index: i,
                field: "unitPrice",
                value: parseFloat(e.target.value) || 0,
              })
            }
            className="w-20 text-right"
          />
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => dispatch({ type: "REMOVE_ITEM", index: i })}
            disabled={receipt.items.length <= 1}
          >
            <Trash2 className="size-3.5 text-muted-foreground" />
          </Button>
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => dispatch({ type: "ADD_ITEM" })}
        className="w-full text-muted-foreground"
      >
        <Plus className="mr-1 size-3.5" />
        + Artikel hinzufügen
      </Button>
    </div>
  )
}
