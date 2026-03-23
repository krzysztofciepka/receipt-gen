import type { ReceiptData, ReceiptItem } from "./types"

export type ReceiptAction =
  | { type: "SET_FIELD"; field: keyof ReceiptData; value: ReceiptData[keyof ReceiptData] }
  | { type: "SET_ITEM"; index: number; field: keyof ReceiptItem; value: string | number }
  | { type: "ADD_ITEM" }
  | { type: "REMOVE_ITEM"; index: number }

export function receiptReducer(state: ReceiptData, action: ReceiptAction): ReceiptData {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }
    case "SET_ITEM":
      return {
        ...state,
        items: state.items.map((item, i) =>
          i === action.index ? { ...item, [action.field]: action.value } : item
        ),
      }
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, { name: "", quantity: 1, unitPrice: 0 }],
      }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((_, i) => i !== action.index),
      }
  }
}
