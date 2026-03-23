import { useMemo } from "react"
import qrcode from "qrcode-generator"
import type { ReceiptData, Totals } from "@/types"
import { formatNumber } from "@/lib/utils"

interface ReceiptPreviewProps {
  receipt: ReceiptData
  totals: Totals
  previewRef: React.RefObject<HTMLDivElement | null>
}

export function ReceiptPreview({ receipt, totals, previewRef }: ReceiptPreviewProps) {
  const qrDataUrl = useMemo(() => {
    if (!receipt.qrCode) return null
    const qr = qrcode(0, "M")
    qr.addData(receipt.qrCode)
    qr.make()
    return qr.createDataURL(4, 0)
  }, [receipt.qrCode])

  const separator = (char: string) => char.repeat(32)

  return (
    <div
      ref={previewRef}
      className="w-[300px] bg-white px-4 py-6 font-mono text-xs leading-relaxed text-black"
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      {/* Header */}
      <div className="text-center font-bold">{receipt.storeName}</div>
      <div className="text-center">{receipt.addressLine1}</div>
      <div className="text-center">{receipt.addressLine2}</div>
      <div className="text-center">Tel: {receipt.phone}</div>
      <div className="text-center">USt-IdNr: {receipt.vatNumber}</div>
      <div className="my-1 text-center">{separator("=")}</div>

      {/* Receipt details */}
      <div>Beleg-Nr: {receipt.receiptNumber}</div>
      <div>Datum: {receipt.date}</div>
      <div>Kasse: {receipt.cashier}</div>
      <div className="my-1">{separator("-")}</div>

      {/* Items */}
      {receipt.items.map((item, i) => (
        <div key={i}>
          <div>{item.name}</div>
          <div className="flex justify-between">
            <span>&nbsp;&nbsp;{item.quantity} x {formatNumber(item.unitPrice)}</span>
            <span>{formatNumber(item.quantity * item.unitPrice)}</span>
          </div>
        </div>
      ))}
      <div className="my-1">{separator("-")}</div>

      {/* Totals */}
      <div className="flex justify-between font-bold">
        <span>GESAMT</span>
        <span>{formatNumber(totals.total)} &euro;</span>
      </div>
      <div className="flex justify-between">
        <span>Netto</span>
        <span>{formatNumber(totals.net)} &euro;</span>
      </div>
      <div className="flex justify-between">
        <span>MwSt {receipt.vatRate}%</span>
        <span>{formatNumber(totals.vat)} &euro;</span>
      </div>
      <div className="my-1">{separator("-")}</div>

      {/* Payment */}
      <div className="flex justify-between">
        <span>Zahlungsart</span>
        <span>{receipt.paymentMethod}</span>
      </div>
      {receipt.paymentMethod === "Bar" && (
        <>
          <div className="flex justify-between">
            <span>Bezahlt</span>
            <span>{formatNumber(totals.paid)} &euro;</span>
          </div>
          <div className="flex justify-between">
            <span>Rückgeld</span>
            <span>{formatNumber(totals.change)} &euro;</span>
          </div>
        </>
      )}

      {/* QR Code */}
      {qrDataUrl && (
        <div className="my-2 flex justify-center">
          <img src={qrDataUrl} alt="QR Code" className="h-24 w-24" style={{ imageRendering: "pixelated" }} />
        </div>
      )}

      {/* Footer */}
      <div className="mt-2 text-center">{receipt.footer}</div>
    </div>
  )
}
