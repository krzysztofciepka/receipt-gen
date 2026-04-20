import type { ReceiptData } from "./types"

const pad = (n: number, len = 2) => String(n).padStart(len, "0")

function randomReceiptDate(): string {
  const now = new Date()
  const hour = Math.floor(Math.random() * 12) + 8
  const minute = Math.floor(Math.random() * 60)
  return `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()} ${pad(hour)}:${pad(minute)}`
}

function randomReceiptNumber(): string {
  return pad(Math.floor(Math.random() * 99999) + 1, 5)
}

function randomPrice(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100
}

export const defaultReceipt: ReceiptData = {
  storeName: "Müller Lebensmittel",
  addressLine1: "Hauptstraße 42",
  addressLine2: "10115 Berlin",
  phone: "+49 30 12345678",
  vatNumber: "DE123456789",
  receiptNumber: randomReceiptNumber(),
  date: randomReceiptDate(),
  cashier: "Anna K.",
  items: [
    { name: "Vollmilch 3,5%", quantity: 2, unitPrice: randomPrice(0.89, 1.79) },
    { name: "Vollkornbrot", quantity: 1, unitPrice: randomPrice(1.49, 3.49) },
    { name: "Deutsche Markenbutter", quantity: 1, unitPrice: randomPrice(1.69, 2.99) },
    { name: "Orangensaft 1L", quantity: 2, unitPrice: randomPrice(1.29, 2.49) },
  ],
  vatRate: 19,
  paymentMethod: "Karte",
  isCashPayment: false,
  amountPaid: "",
  qrCode: "",
  footer: "Vielen Dank für Ihren Einkauf!",
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
}
