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
  isCashPayment: boolean
  amountPaid: string
  qrCode: string
  footer: string
  // Localization
  currencySymbol: string
  currencyPosition: "prefix" | "suffix"
  locale: string
  // Labels
  phoneLabel: string
  vatNumberLabel: string
  receiptNumberLabel: string
  dateLabel: string
  cashierLabel: string
  totalLabel: string
  netLabel: string
  vatLabel: string
  paymentMethodLabel: string
  paidLabel: string
  changeLabel: string
}

export type SurfacePreset = "wood" | "marble" | "dark" | "granite" | "tablecloth" | "leather" | "concrete"

export type AnglePreset = "flat" | "angled" | "perspective-60" | "perspective-75" | "crumpled" | "folded-half" | "folded-vertical" | "folded-corner" | "worn"

export interface Totals {
  subtotal: number
  net: number
  vat: number
  total: number
  paid: number
  change: number
}
