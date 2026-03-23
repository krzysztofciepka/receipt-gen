import { useReducer, useMemo } from "react"
import type { Totals } from "@/types"
import { receiptReducer, type ReceiptAction } from "@/reducer"
import { defaultReceipt } from "@/defaults"

export function useReceipt() {
  const [receipt, dispatch] = useReducer(receiptReducer, defaultReceipt)

  const totals: Totals = useMemo(() => {
    const subtotal = receipt.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    )
    const net = subtotal / (1 + receipt.vatRate / 100)
    const vat = subtotal - net
    const paid = parseFloat(receipt.amountPaid) || subtotal
    const change = Math.max(0, paid - subtotal)
    return { subtotal, net, vat, total: subtotal, paid, change }
  }, [receipt.items, receipt.vatRate, receipt.amountPaid])

  return { receipt, dispatch, totals }
}

export type ReceiptDispatch = React.Dispatch<ReceiptAction>
