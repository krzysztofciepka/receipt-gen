import { useMemo, type CSSProperties } from "react"
import qrcode from "qrcode-generator"
import type { ReceiptData, Totals } from "@/types"
import { formatNumber } from "@/lib/utils"

interface ReceiptPreviewProps {
  receipt: ReceiptData
  totals: Totals
  previewRef: React.RefObject<HTMLDivElement | null>
}

// All styles are inline so html2canvas can capture without Tailwind stylesheets
// (html2canvas cannot parse OKLCH colors from Tailwind CSS 4)

const root: CSSProperties = {
  width: 300,
  padding: "24px 16px",
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: 12,
  lineHeight: 1.6,
  backgroundColor: "#ffffff",
  color: "#000000",
}

const center: CSSProperties = { textAlign: "center" }
const bold: CSSProperties = { fontWeight: "bold" }
const centerBold: CSSProperties = { ...center, ...bold }
const sep: CSSProperties = { margin: "4px 0" }
const row: CSSProperties = { display: "flex", justifyContent: "space-between" }
const rowBold: CSSProperties = { ...row, ...bold }

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
    <div ref={previewRef} style={root}>
      {/* Header */}
      <div style={centerBold}>{receipt.storeName}</div>
      <div style={center}>{receipt.addressLine1}</div>
      <div style={center}>{receipt.addressLine2}</div>
      <div style={center}>Tel: {receipt.phone}</div>
      <div style={center}>USt-IdNr: {receipt.vatNumber}</div>
      <div style={sep}>{separator("=")}</div>

      {/* Receipt details */}
      <div>Beleg-Nr: {receipt.receiptNumber}</div>
      <div>Datum: {receipt.date}</div>
      <div>Kasse: {receipt.cashier}</div>
      <div style={sep}>{separator("-")}</div>

      {/* Items */}
      {receipt.items.map((item, i) => (
        <div key={i}>
          <div>{item.name}</div>
          <div style={row}>
            <span>&nbsp;&nbsp;{item.quantity} x {formatNumber(item.unitPrice)}</span>
            <span>{formatNumber(item.quantity * item.unitPrice)}</span>
          </div>
        </div>
      ))}
      <div style={sep}>{separator("-")}</div>

      {/* Totals */}
      <div style={rowBold}>
        <span>GESAMT</span>
        <span>{formatNumber(totals.total)} &euro;</span>
      </div>
      <div style={row}>
        <span>Netto</span>
        <span>{formatNumber(totals.net)} &euro;</span>
      </div>
      <div style={row}>
        <span>MwSt {receipt.vatRate}%</span>
        <span>{formatNumber(totals.vat)} &euro;</span>
      </div>
      <div style={sep}>{separator("-")}</div>

      {/* Payment */}
      <div style={row}>
        <span>Zahlungsart</span>
        <span>{receipt.paymentMethod}</span>
      </div>
      {receipt.paymentMethod === "Bar" && (
        <>
          <div style={row}>
            <span>Bezahlt</span>
            <span>{formatNumber(totals.paid)} &euro;</span>
          </div>
          <div style={row}>
            <span>Rückgeld</span>
            <span>{formatNumber(totals.change)} &euro;</span>
          </div>
        </>
      )}

      {/* QR Code */}
      {qrDataUrl && (
        <div style={{ margin: "8px 0", display: "flex", justifyContent: "center" }}>
          <img src={qrDataUrl} alt="QR Code" style={{ width: 96, height: 96, imageRendering: "pixelated" }} />
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 8, textAlign: "center" }}>{receipt.footer}</div>
    </div>
  )
}
