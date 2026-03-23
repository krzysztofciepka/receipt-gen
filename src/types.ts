export interface ReceiptItem {
  name: string
  quantity: number
  unitPrice: number
}

export interface ReceiptData {
  storeName: string
  addressLine1: string
  addressLine2: string
  phone: string
  vatNumber: string
  receiptNumber: string
  date: string
  cashier: string
  items: ReceiptItem[]
  vatRate: number
  paymentMethod: string
  amountPaid: string
  qrCode: string
  footer: string
}

export type SurfacePreset = "wood" | "marble" | "dark"

export type AnglePreset = "flat" | "angled" | "perspective" | "crumpled"

export interface Totals {
  subtotal: number
  net: number
  vat: number
  total: number
  paid: number
  change: number
}
