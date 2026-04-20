import { useReducer, useMemo, useEffect } from "react"
import type { ReceiptData, Totals } from "@/types"
import { receiptReducer, type ReceiptAction } from "@/reducer"
import { defaultReceipt } from "@/defaults"

const STORAGE_KEY = "receipt-gen:receipt"

function loadInitial(): ReceiptData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultReceipt
    const stored = JSON.parse(raw) as Partial<ReceiptData>
    // Merge with defaults so fields added in newer versions get populated.
    return { ...defaultReceipt, ...stored }
  } catch {
    return defaultReceipt
  }
}

export function useReceipt() {
  const [receipt, dispatch] = useReducer(receiptReducer, undefined, loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(receipt))
    } catch {
      // Ignore quota / access errors (e.g. Safari private mode).
    }
  }, [receipt])

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
