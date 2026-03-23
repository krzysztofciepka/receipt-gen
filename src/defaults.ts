import type { ReceiptData } from "./types"

function randomReceiptDate(): string {
  const now = new Date()
  const hour = Math.floor(Math.random() * 12) + 8
  const minute = Math.floor(Math.random() * 60)
  const pad = (n: number) => String(n).padStart(2, "0")
  const d = pad(now.getDate())
  const m = pad(now.getMonth() + 1)
  const y = now.getFullYear()
  return `${d}.${m}.${y} ${pad(hour)}:${pad(minute)}`
}

export const defaultReceipt: ReceiptData = {
  storeName: "Müller Lebensmittel",
  addressLine1: "Hauptstraße 42",
  addressLine2: "10115 Berlin",
  phone: "+49 30 12345678",
  vatNumber: "DE123456789",
  receiptNumber: "00001",
  date: randomReceiptDate(),
  cashier: "Anna K.",
  items: [
    { name: "Vollmilch 3,5%", quantity: 2, unitPrice: 1.29 },
    { name: "Vollkornbrot", quantity: 1, unitPrice: 2.49 },
    { name: "Deutsche Markenbutter", quantity: 1, unitPrice: 2.19 },
    { name: "Orangensaft 1L", quantity: 2, unitPrice: 1.99 },
  ],
  vatRate: 19,
  paymentMethod: "Karte",
  amountPaid: "",
  qrCode: "",
  footer: "Vielen Dank für Ihren Einkauf!",
}
