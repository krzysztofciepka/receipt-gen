import { useMemo, type CSSProperties } from "react"
import qrcode from "qrcode-generator"
import type { ReceiptData, Totals } from "@/types"
import { formatCurrency, formatNumber } from "@/lib/utils"

interface ReceiptPreviewProps {
  receipt: ReceiptData
  totals: Totals
  previewRef?: React.RefObject<HTMLDivElement | null>
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
  const money = (v: number) =>
    formatCurrency(v, receipt.currencySymbol, receipt.currencyPosition, receipt.locale)
  const num = (v: number) => formatNumber(v, receipt.locale)

  return (
    <div ref={previewRef} style={root}>
      {/* Header */}
      <div style={centerBold}>{receipt.storeName}</div>
      <div style={center}>{receipt.addressLine1}</div>
      <div style={center}>{receipt.addressLine2}</div>
      <div style={center}>{receipt.phoneLabel} {receipt.phone}</div>
      <div style={center}>{receipt.vatNumberLabel} {receipt.vatNumber}</div>
      <div style={sep}>{separator("=")}</div>

      {/* Receipt details */}
      <div>{receipt.receiptNumberLabel} {receipt.receiptNumber}</div>
      <div>{receipt.dateLabel} {receipt.date}</div>
      <div>{receipt.cashierLabel} {receipt.cashier}</div>
      <div style={sep}>{separator("-")}</div>

      {/* Items */}
      {receipt.items.map((item, i) => (
        <div key={i}>
          <div>{item.name}</div>
          <div style={row}>
            <span>&nbsp;&nbsp;{item.quantity} x {num(item.unitPrice)}</span>
            <span>{num(item.quantity * item.unitPrice)}</span>
          </div>
        </div>
      ))}
      <div style={sep}>{separator("-")}</div>

      {/* Totals */}
      <div style={rowBold}>
        <span>{receipt.totalLabel}</span>
        <span>{money(totals.total)}</span>
      </div>
      <div style={row}>
        <span>{receipt.netLabel}</span>
        <span>{money(totals.net)}</span>
      </div>
      <div style={row}>
        <span>{receipt.vatLabel} {receipt.vatRate}%</span>
        <span>{money(totals.vat)}</span>
      </div>
      <div style={sep}>{separator("-")}</div>

      {/* Payment */}
      <div style={row}>
        <span>{receipt.paymentMethodLabel}</span>
        <span>{receipt.paymentMethod}</span>
      </div>
      {receipt.isCashPayment && (
        <>
          <div style={row}>
            <span>{receipt.paidLabel}</span>
            <span>{money(totals.paid)}</span>
          </div>
          <div style={row}>
            <span>{receipt.changeLabel}</span>
            <span>{money(totals.change)}</span>
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
