# Receipt Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone web app that provides a receipt data form, live receipt preview, and generates realistic "fake photo" JPG renders using Three.js.

**Architecture:** Pure frontend SPA (React 19 + TypeScript + Vite + Tailwind CSS 4 + Shadcn/UI). Three.js renders the 3D photo scene offscreen. html2canvas captures the receipt preview DOM as a texture. No backend — static assets served by nginx in Docker.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, Shadcn/UI (base-nova style, neutral base color), Three.js, html2canvas, qrcode-generator

**Spec:** `docs/superpowers/specs/2026-03-23-receipt-gen-design.md`

**Reference codebase:** `/home/kc/repos/thermal-printer/frontend/` — same stack, same Shadcn style. Copy config patterns from there.

---

## File Structure

```
receipt-gen/
├── index.html                          — Vite entry HTML
├── package.json                        — Dependencies and scripts
├── tsconfig.json                       — TS project references
├── tsconfig.app.json                   — App TS config
├── tsconfig.node.json                  — Node TS config (vite.config)
├── vite.config.ts                      — Vite + Tailwind plugin + @ alias
├── components.json                     — Shadcn/UI config
├── Dockerfile                          — Multi-stage nginx build
├── .dockerignore                       — Ignore node_modules, .git, etc.
├── .gitignore                          — Node/Vite ignores (already exists)
├── src/
│   ├── main.tsx                        — ReactDOM.createRoot entry
│   ├── App.tsx                         — Two-panel layout, useReducer state
│   ├── index.css                       — Tailwind imports + Shadcn theme vars
│   ├── types.ts                        — ReceiptItem, ReceiptData, SurfacePreset, AnglePreset
│   ├── defaults.ts                     — German default values, randomReceiptDate()
│   ├── reducer.ts                      — receiptReducer + action types
│   ├── lib/
│   │   └── utils.ts                    — cn() helper, formatCurrency()
│   ├── hooks/
│   │   └── use-receipt.ts              — useReceipt() hook wrapping useReducer
│   ├── components/
│   │   ├── receipt-form/
│   │   │   ├── receipt-form.tsx         — Form container with all sections
│   │   │   ├── store-info-section.tsx   — Store name, address, phone, VAT
│   │   │   ├── receipt-details-section.tsx — Receipt #, date, cashier
│   │   │   ├── items-section.tsx        — Dynamic line items list
│   │   │   ├── payment-section.tsx      — Payment method, VAT rate, amount paid, totals display
│   │   │   └── footer-section.tsx       — QR code, footer message
│   │   ├── receipt-preview.tsx          — Live HTML/CSS thermal receipt rendering
│   │   └── photo-generator/
│   │       ├── photo-generator.tsx      — Preset selectors + generate button UI
│   │       ├── scene.ts                — Three.js scene creation, rendering, JPG export
│   │       ├── presets.ts              — Surface + angle preset definitions
│   │       └── textures.ts            — Procedural texture generation (wood, marble, dark)
│   └── components/ui/                  — Shadcn/UI components (added via npx shadcn add)
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `components.json`, `src/main.tsx`, `src/index.css`, `src/App.tsx`
- Modify: `.gitignore`

- [ ] **Step 1: Initialize npm project and install dependencies**

```bash
cd /home/kc/repos/receipt-gen
npm init -y
npm install react@^19 react-dom@^19 tailwindcss@^4 @tailwindcss/vite@^4 lucide-react class-variance-authority clsx tailwind-merge tw-animate-css @fontsource-variable/geist three html2canvas
npm install -D @vitejs/plugin-react@^6 vite@^8 typescript@~5.9 @types/react@^19 @types/react-dom@^19 @types/three @types/node
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 3: Create tsconfig.app.json**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2023",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create tsconfig.node.json**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Create vite.config.ts**

```typescript
import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

- [ ] **Step 6: Create index.html**

```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Receipt Generator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create components.json**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
```

- [ ] **Step 8: Create src/index.css**

Copy the exact CSS from `/home/kc/repos/thermal-printer/frontend/src/index.css` — it contains the Shadcn theme variables (OKLCH neutral palette), Tailwind imports, font setup, and base layer styles. This is the same theme.

- [ ] **Step 9: Create src/lib/utils.ts**

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
})

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

const numberFormatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatNumber(amount: number): string {
  return numberFormatter.format(amount)
}
```

- [ ] **Step 10: Create src/main.tsx with a placeholder App**

```tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@fontsource-variable/geist"
import "./index.css"
import App from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <h1 className="text-2xl font-bold">Receipt Generator</h1>
    </div>
  )
}
```

- [ ] **Step 11: Add Shadcn/UI components**

```bash
npx shadcn@latest add input label button separator select card collapsible
```

- [ ] **Step 12: Update .gitignore**

Append standard Node/Vite ignores:

```
node_modules/
dist/
.superpowers/
*.local
```

- [ ] **Step 13: Verify the dev server starts**

```bash
npm run dev
```

Open `http://localhost:5173` — should show "Receipt Generator" centered on screen. Kill the dev server after verifying.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: scaffold project with React, Vite, Tailwind, Shadcn"
```

---

### Task 2: Types, Defaults, and Reducer

**Files:**
- Create: `src/types.ts`, `src/defaults.ts`, `src/reducer.ts`, `src/hooks/use-receipt.ts`

- [ ] **Step 1: Create src/types.ts**

```typescript
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
```

- [ ] **Step 2: Create src/defaults.ts**

```typescript
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
```

- [ ] **Step 3: Create src/reducer.ts**

```typescript
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
```

- [ ] **Step 4: Create src/hooks/use-receipt.ts**

```typescript
import { useReducer, useMemo } from "react"
import type { ReceiptData, Totals } from "@/types"
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
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc -b --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/types.ts src/defaults.ts src/reducer.ts src/hooks/use-receipt.ts
git commit -m "feat: add receipt data types, defaults, reducer, and hook"
```

---

### Task 3: Receipt Form

**Files:**
- Create: `src/components/receipt-form/receipt-form.tsx`, `src/components/receipt-form/store-info-section.tsx`, `src/components/receipt-form/receipt-details-section.tsx`, `src/components/receipt-form/items-section.tsx`, `src/components/receipt-form/payment-section.tsx`, `src/components/receipt-form/footer-section.tsx`
- Modify: `src/App.tsx`

Each form section receives `receipt`, `dispatch`, and (for payment) `totals` as props. Follow the same pattern as `/home/kc/repos/thermal-printer/frontend/src/components/receipt-card.tsx` but with German labels and no `disabled={!connected}` guards (there's no printer connection concept).

- [ ] **Step 1: Create src/components/receipt-form/store-info-section.tsx**

Props: `receipt: ReceiptData`, `dispatch: ReceiptDispatch`

Fields:
- `storeName` — Label: "Geschäftsname", placeholder: "Geschäftsname"
- `addressLine1` — Label: "Adresse", placeholder: "Straße und Hausnummer"
- `addressLine2` — Label: "Stadt", placeholder: "PLZ und Stadt"
- `phone` — Label: "Telefon", placeholder: "Telefonnummer"
- `vatNumber` — Label: "USt-IdNr.", placeholder: "USt-IdNr."

Use Shadcn `Input` and `Label` components. Each input dispatches `{ type: "SET_FIELD", field, value }`.

Phone and VAT number in a 2-column grid, same as thermal-printer.

- [ ] **Step 2: Create src/components/receipt-form/receipt-details-section.tsx**

Props: `receipt: ReceiptData`, `dispatch: ReceiptDispatch`

Fields:
- `receiptNumber` — Label: "Beleg-Nr.", placeholder: "Beleg-Nr."
- `date` — Label: "Datum", placeholder: "TT.MM.JJJJ HH:MM"
- `cashier` — Label: "Kassierer/in", placeholder: "Name"

Receipt # and date in a 2-column grid.

- [ ] **Step 3: Create src/components/receipt-form/items-section.tsx**

Props: `receipt: ReceiptData`, `dispatch: ReceiptDispatch`

Dynamic item list. Each row has:
- Item name input (flex-1), placeholder: "Artikelname"
- Quantity input (w-14, type number, min 1)
- Unit price input (w-20, type number, min 0, step 0.01)
- Delete button (Trash2 icon, disabled when only 1 item)

"+ Artikel hinzufügen" button at the bottom. Uses `ADD_ITEM`, `REMOVE_ITEM`, `SET_ITEM` actions.

- [ ] **Step 4: Create src/components/receipt-form/payment-section.tsx**

Props: `receipt: ReceiptData`, `dispatch: ReceiptDispatch`, `totals: Totals`

Fields:
- Payment method select — "Karte" / "Bar" (not "Card" / "Cash")
- VAT rate input — number, label "MwSt"
- Amount paid input — number, placeholder shows auto total

Totals display (read-only, same styled block as thermal-printer):
- ZWISCHENSUMME (subtotal)
- NETTO (net)
- MwSt {rate}% (vat)
- GESAMT (total) — bold
- Bezahlt (paid) and Rückgeld (change) — only shown when paymentMethod is "Bar"

All amounts formatted with `formatCurrency()`.

- [ ] **Step 5: Create src/components/receipt-form/footer-section.tsx**

Props: `receipt: ReceiptData`, `dispatch: ReceiptDispatch`

Fields:
- `qrCode` — placeholder: "QR-Code Inhalt (optional)"
- `footer` — placeholder: "Fußzeile"

- [ ] **Step 6: Create src/components/receipt-form/receipt-form.tsx**

Container component that renders all sections with `Separator` between them, wrapped in a scrollable div. Props: `receipt: ReceiptData`, `dispatch: ReceiptDispatch`, `totals: Totals`.

```tsx
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react"
import { StoreInfoSection } from "./store-info-section"
import { ReceiptDetailsSection } from "./receipt-details-section"
import { ItemsSection } from "./items-section"
import { PaymentSection } from "./payment-section"
import { FooterSection } from "./footer-section"
import type { ReceiptData, Totals } from "@/types"
import type { ReceiptDispatch } from "@/hooks/use-receipt"
import { cn } from "@/lib/utils"

interface ReceiptFormProps {
  receipt: ReceiptData
  dispatch: ReceiptDispatch
  totals: Totals
}

interface SectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function Section({ title, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
        <Label className="text-xs font-medium text-muted-foreground">{title}</Label>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  )
}

export function ReceiptForm({ receipt, dispatch, totals }: ReceiptFormProps) {
  return (
    <div className="space-y-2">
      <Section title="Geschäftsdaten">
        <StoreInfoSection receipt={receipt} dispatch={dispatch} />
      </Section>
      <Section title="Belegdetails">
        <ReceiptDetailsSection receipt={receipt} dispatch={dispatch} />
      </Section>
      <Section title="Artikel">
        <ItemsSection receipt={receipt} dispatch={dispatch} />
      </Section>
      <Section title="Zahlung">
        <PaymentSection receipt={receipt} dispatch={dispatch} totals={totals} />
      </Section>
      <Section title="Fußzeile & QR-Code">
        <FooterSection receipt={receipt} dispatch={dispatch} />
      </Section>
    </div>
  )
}
```

- [ ] **Step 7: Update src/App.tsx to render the form**

Wire up `useReceipt()` hook, render `ReceiptForm` in the left panel. Right panel shows a placeholder for now.

```tsx
import { useReceipt } from "@/hooks/use-receipt"
import { ReceiptForm } from "@/components/receipt-form/receipt-form"

export default function App() {
  const { receipt, dispatch, totals } = useReceipt()

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left panel: form */}
      <div className="w-[440px] shrink-0 overflow-y-auto border-r border-border p-6">
        <h1 className="mb-4 text-lg font-semibold">Belegdaten</h1>
        <ReceiptForm receipt={receipt} dispatch={dispatch} totals={totals} />
      </div>
      {/* Right panel: preview + photo (placeholder) */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-muted-foreground">Preview coming next...</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Verify in browser**

Run `npm run dev`, open `http://localhost:5173`. Verify:
- Form renders with all German-labeled sections
- Default values are populated
- Adding/removing items works
- Totals calculate correctly
- Payment method dropdown shows "Karte" / "Bar"

- [ ] **Step 9: Commit**

```bash
git add src/components/receipt-form/ src/App.tsx
git commit -m "feat: add receipt data entry form with German labels"
```

---

### Task 4: Receipt Preview

**Files:**
- Create: `src/components/receipt-preview.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Install qrcode-generator**

```bash
npm install qrcode-generator
```

Note: This package ships its own types. If not, `npm install -D @types/qrcode-generator`.

- [ ] **Step 2: Create src/components/receipt-preview.tsx**

Props: `receipt: ReceiptData`, `totals: Totals`, `previewRef: React.RefObject<HTMLDivElement>`

The `previewRef` is attached to the outermost receipt div so html2canvas can capture it later.

Render a thermal-paper-styled receipt using HTML/CSS:

```tsx
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
        <span>{formatNumber(totals.total)} €</span>
      </div>
      <div className="flex justify-between">
        <span>Netto</span>
        <span>{formatNumber(totals.net)} €</span>
      </div>
      <div className="flex justify-between">
        <span>MwSt {receipt.vatRate}%</span>
        <span>{formatNumber(totals.vat)} €</span>
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
            <span>{formatNumber(totals.paid)} €</span>
          </div>
          <div className="flex justify-between">
            <span>Rückgeld</span>
            <span>{formatNumber(totals.change)} €</span>
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
```

- [ ] **Step 3: Update src/App.tsx to render the preview**

Add a `useRef` for the preview DOM node. Render `ReceiptPreview` in the right panel with a paper-like container (shadow, centered).

```tsx
import { useRef } from "react"
import { useReceipt } from "@/hooks/use-receipt"
import { ReceiptForm } from "@/components/receipt-form/receipt-form"
import { ReceiptPreview } from "@/components/receipt-preview"

export default function App() {
  const { receipt, dispatch, totals } = useReceipt()
  const previewRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="w-[440px] shrink-0 overflow-y-auto border-r border-border p-6">
        <h1 className="mb-4 text-lg font-semibold">Belegdaten</h1>
        <ReceiptForm receipt={receipt} dispatch={dispatch} totals={totals} />
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Preview */}
        <div className="flex flex-1 justify-center bg-muted/30 p-6">
          <div className="self-start rounded-md shadow-lg">
            <ReceiptPreview receipt={receipt} totals={totals} previewRef={previewRef} />
          </div>
        </div>
        {/* Photo generator placeholder */}
        <div className="border-t border-border p-6">
          <p className="text-center text-muted-foreground">Photo generation coming next...</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify in browser**

Run `npm run dev`. Verify:
- Receipt preview renders with German text and proper formatting
- Preview updates in real-time as form fields change
- QR code appears when QR field has content
- Monospace font, proper alignment of amounts
- Totals show correctly with comma decimal separators

- [ ] **Step 5: Commit**

```bash
git add src/components/receipt-preview.tsx src/App.tsx package.json package-lock.json
git commit -m "feat: add live receipt preview with German formatting"
```

---

### Task 5: Procedural Textures

**Files:**
- Create: `src/components/photo-generator/textures.ts`

- [ ] **Step 1: Create src/components/photo-generator/textures.ts**

Three functions that each return a `THREE.CanvasTexture`:

```typescript
import * as THREE from "three"

export function createWoodTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")!

  // Base warm brown
  ctx.fillStyle = "#8B6914"
  ctx.fillRect(0, 0, width, height)

  // Wood grain lines — horizontal stripes with slight variation
  for (let y = 0; y < height; y += 2) {
    const lightness = 40 + Math.sin(y * 0.05) * 10 + Math.random() * 5
    ctx.fillStyle = `hsl(35, 60%, ${lightness}%)`
    ctx.fillRect(0, y, width, 2)
  }

  // Knot holes — a few darker ellipses
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.beginPath()
    ctx.ellipse(x, y, 20 + Math.random() * 30, 10 + Math.random() * 15, 0, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(60, 30, 0, 0.3)"
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

export function createMarbleTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")!

  // Light gray-white base
  ctx.fillStyle = "#f0ece4"
  ctx.fillRect(0, 0, width, height)

  // Veining — semi-transparent gray lines with curves
  ctx.strokeStyle = "rgba(180, 170, 160, 0.3)"
  ctx.lineWidth = 2
  for (let i = 0; i < 8; i++) {
    ctx.beginPath()
    const startX = Math.random() * width
    const startY = Math.random() * height
    ctx.moveTo(startX, startY)
    for (let j = 0; j < 5; j++) {
      ctx.quadraticCurveTo(
        startX + (Math.random() - 0.5) * 400,
        startY + (Math.random() - 0.5) * 400,
        startX + (Math.random() - 0.5) * 600,
        startY + (Math.random() - 0.5) * 600,
      )
    }
    ctx.stroke()
  }

  // Subtle noise overlay
  const imageData = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 10
    imageData.data[i] += noise
    imageData.data[i + 1] += noise
    imageData.data[i + 2] += noise
  }
  ctx.putImageData(imageData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

export function createDarkDeskTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")!

  // Near-black base
  ctx.fillStyle = "#1a1a1a"
  ctx.fillRect(0, 0, width, height)

  // Subtle grain noise
  const imageData = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 15
    imageData.data[i] += noise
    imageData.data[i + 1] += noise
    imageData.data[i + 2] += noise
  }
  ctx.putImageData(imageData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc -b --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/photo-generator/textures.ts
git commit -m "feat: add procedural texture generators for wood, marble, dark desk"
```

---

### Task 6: Scene Presets

**Files:**
- Create: `src/components/photo-generator/presets.ts`

- [ ] **Step 1: Create src/components/photo-generator/presets.ts**

Define the preset configurations — camera position, receipt rotation, paper curl intensity, lighting parameters:

```typescript
import type { SurfacePreset, AnglePreset } from "@/types"

export interface SurfaceConfig {
  label: string
  icon: string
  createLighting: () => LightingConfig
}

export interface LightingConfig {
  ambientColor: number
  ambientIntensity: number
  pointColor: number
  pointIntensity: number
  pointPosition: [number, number, number]
}

export interface AngleConfig {
  label: string
  cameraPosition: [number, number, number]
  cameraLookAt: [number, number, number]
  receiptRotationZ: number
  curlIntensity: number
  wrinkle: boolean
}

export const surfaceConfigs: Record<SurfacePreset, SurfaceConfig> = {
  wood: {
    label: "Holz",
    icon: "🪵",
    createLighting: () => ({
      ambientColor: 0xfff5e6,
      ambientIntensity: 0.4,
      pointColor: 0xffe4b5,
      pointIntensity: 0.8,
      pointPosition: [2, 4, 2],
    }),
  },
  marble: {
    label: "Marmor",
    icon: "🪨",
    createLighting: () => ({
      ambientColor: 0xf0f0ff,
      ambientIntensity: 0.5,
      pointColor: 0xffffff,
      pointIntensity: 0.7,
      pointPosition: [0, 5, 2],
    }),
  },
  dark: {
    label: "Dunkel",
    icon: "🖥️",
    createLighting: () => ({
      ambientColor: 0x222222,
      ambientIntensity: 0.3,
      pointColor: 0xffffff,
      pointIntensity: 1.0,
      pointPosition: [0, 4, 0],
    }),
  },
}

export const angleConfigs: Record<AnglePreset, AngleConfig> = {
  flat: {
    label: "Flach",
    cameraPosition: [0, 5, 0.01],
    cameraLookAt: [0, 0, 0],
    receiptRotationZ: 0,
    curlIntensity: 0.02,
    wrinkle: false,
  },
  angled: {
    label: "Schräg",
    cameraPosition: [1, 4.5, 1],
    cameraLookAt: [0, 0, 0],
    receiptRotationZ: -Math.PI / 12,
    curlIntensity: 0.05,
    wrinkle: false,
  },
  perspective: {
    label: "Perspektive",
    cameraPosition: [0, 3, 2.5],
    cameraLookAt: [0, 0, 0],
    receiptRotationZ: 0,
    curlIntensity: 0.08,
    wrinkle: false,
  },
  crumpled: {
    label: "Zerknittert",
    cameraPosition: [0.2, 4, 0.8],
    cameraLookAt: [0, 0, 0],
    receiptRotationZ: Math.PI / 36,
    curlIntensity: 0.12,
    wrinkle: true,
  },
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc -b --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/photo-generator/presets.ts
git commit -m "feat: add surface and angle preset configurations"
```

---

### Task 7: Three.js Scene

**Files:**
- Create: `src/components/photo-generator/scene.ts`

This is the core 3D rendering module. It exports a single function `generatePhoto()` that:
1. Takes a receipt texture (from html2canvas), surface preset, and angle preset
2. Creates an offscreen Three.js scene
3. Renders to a 1920x1440 canvas
4. Returns a JPG blob

- [ ] **Step 1: Create src/components/photo-generator/scene.ts**

```typescript
import * as THREE from "three"
import type { SurfacePreset, AnglePreset } from "@/types"
import { surfaceConfigs, angleConfigs } from "./presets"
import { createWoodTexture, createMarbleTexture, createDarkDeskTexture } from "./textures"

const OUTPUT_WIDTH = 1920
const OUTPUT_HEIGHT = 1440

function createSurfaceTexture(preset: SurfacePreset): THREE.CanvasTexture {
  switch (preset) {
    case "wood": return createWoodTexture()
    case "marble": return createMarbleTexture()
    case "dark": return createDarkDeskTexture()
  }
}

function applyPaperCurl(
  geometry: THREE.PlaneGeometry,
  curlIntensity: number,
  wrinkle: boolean,
): void {
  const positions = geometry.attributes.position
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    // Curl at edges — sine wave based on x position
    const edgeFactor = Math.abs(x) / 0.75 // Normalize to receipt half-width
    let z = curlIntensity * edgeFactor * edgeFactor * Math.sin(y * 3)
    // Wrinkle adds random high-frequency displacement
    if (wrinkle) {
      z += (Math.random() - 0.5) * curlIntensity * 0.3
      z += Math.sin(x * 15 + y * 10) * curlIntensity * 0.2
    }
    positions.setZ(i, z)
  }
  positions.needsUpdate = true
  geometry.computeVertexNormals()
}

function addFilmGrain(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const imageData = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 20
    imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + noise))
    imageData.data[i + 1] = Math.min(255, Math.max(0, imageData.data[i + 1] + noise))
    imageData.data[i + 2] = Math.min(255, Math.max(0, imageData.data[i + 2] + noise))
  }
  ctx.putImageData(imageData, 0, 0)
}

function addVignette(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, width * 0.3,
    width / 2, height / 2, width * 0.7,
  )
  gradient.addColorStop(0, "rgba(0,0,0,0)")
  gradient.addColorStop(1, "rgba(0,0,0,0.3)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

export async function generatePhoto(
  receiptCanvas: HTMLCanvasElement,
  surface: SurfacePreset,
  angle: AnglePreset,
): Promise<Blob> {
  const surfaceConfig = surfaceConfigs[surface]
  const angleConfig = angleConfigs[angle]
  const lighting = surfaceConfig.createLighting()

  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  renderer.setSize(OUTPUT_WIDTH, OUTPUT_HEIGHT)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // Scene
  const scene = new THREE.Scene()

  // Camera
  const camera = new THREE.PerspectiveCamera(40, OUTPUT_WIDTH / OUTPUT_HEIGHT, 0.1, 100)
  camera.position.set(...angleConfig.cameraPosition)
  camera.lookAt(new THREE.Vector3(...angleConfig.cameraLookAt))

  // Lighting
  const ambient = new THREE.AmbientLight(lighting.ambientColor, lighting.ambientIntensity)
  scene.add(ambient)

  const point = new THREE.PointLight(lighting.pointColor, lighting.pointIntensity)
  point.position.set(...lighting.pointPosition)
  point.castShadow = true
  point.shadow.mapSize.width = 2048
  point.shadow.mapSize.height = 2048
  scene.add(point)

  // Surface (table)
  const surfaceTexture = createSurfaceTexture(surface)
  const surfaceGeometry = new THREE.PlaneGeometry(10, 10)
  const surfaceMaterial = new THREE.MeshStandardMaterial({
    map: surfaceTexture,
    roughness: 0.8,
    metalness: 0.1,
  })
  const surfaceMesh = new THREE.Mesh(surfaceGeometry, surfaceMaterial)
  surfaceMesh.rotation.x = -Math.PI / 2
  surfaceMesh.position.y = -0.01
  surfaceMesh.receiveShadow = true
  scene.add(surfaceMesh)

  // Receipt
  const receiptTexture = new THREE.CanvasTexture(receiptCanvas)
  receiptTexture.minFilter = THREE.LinearFilter
  receiptTexture.magFilter = THREE.LinearFilter

  // Receipt dimensions — aspect ratio from the captured canvas
  const aspect = receiptCanvas.height / receiptCanvas.width
  const receiptWidth = 1.5
  const receiptHeight = receiptWidth * aspect

  const receiptGeometry = new THREE.PlaneGeometry(receiptWidth, receiptHeight, 32, 64)
  applyPaperCurl(receiptGeometry, angleConfig.curlIntensity, angleConfig.wrinkle)

  const receiptMaterial = new THREE.MeshStandardMaterial({
    map: receiptTexture,
    roughness: 0.9,
    metalness: 0.0,
    side: THREE.DoubleSide,
  })
  const receiptMesh = new THREE.Mesh(receiptGeometry, receiptMaterial)
  receiptMesh.rotation.x = -Math.PI / 2
  receiptMesh.rotation.z = angleConfig.receiptRotationZ
  receiptMesh.position.y = 0.01
  receiptMesh.castShadow = true
  scene.add(receiptMesh)

  // Render
  renderer.render(scene, camera)

  // Post-processing: copy WebGL canvas to a 2D canvas (WebGL canvas can't get a 2D context)
  const postCanvas = document.createElement("canvas")
  postCanvas.width = OUTPUT_WIDTH
  postCanvas.height = OUTPUT_HEIGHT
  const ctx = postCanvas.getContext("2d", { willReadFrequently: true })!
  ctx.drawImage(renderer.domElement, 0, 0)
  addVignette(ctx, OUTPUT_WIDTH, OUTPUT_HEIGHT)
  addFilmGrain(ctx, OUTPUT_WIDTH, OUTPUT_HEIGHT)

  // Export as JPG
  const blob = await new Promise<Blob>((resolve, reject) => {
    postCanvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to create blob"))),
      "image/jpeg",
      0.92,
    )
  })

  // Cleanup
  renderer.dispose()
  receiptTexture.dispose()
  surfaceTexture.dispose()
  receiptGeometry.dispose()
  receiptMaterial.dispose()
  surfaceGeometry.dispose()
  surfaceMaterial.dispose()

  return blob
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc -b --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/photo-generator/scene.ts
git commit -m "feat: add Three.js scene with receipt mesh, surfaces, lighting, post-processing"
```

---

### Task 8: Photo Generator UI

**Files:**
- Create: `src/components/photo-generator/photo-generator.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create src/components/photo-generator/photo-generator.tsx**

The component shows surface and angle preset selectors (as clickable pill/card groups), a "Generate" button, and handles the html2canvas capture → Three.js render → download flow.

```tsx
import { useState, useCallback } from "react"
import html2canvas from "html2canvas"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { SurfacePreset, AnglePreset } from "@/types"
import { surfaceConfigs, angleConfigs } from "./presets"
import { generatePhoto } from "./scene"
import { cn } from "@/lib/utils"

interface PhotoGeneratorProps {
  previewRef: React.RefObject<HTMLDivElement | null>
}

export function PhotoGenerator({ previewRef }: PhotoGeneratorProps) {
  const [surface, setSurface] = useState<SurfacePreset>("wood")
  const [angle, setAngle] = useState<AnglePreset>("flat")
  const [generating, setGenerating] = useState(false)

  const handleGenerate = useCallback(async () => {
    if (!previewRef.current || generating) return
    setGenerating(true)
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      })
      const blob = await generatePhoto(canvas, surface, angle)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "receipt.jpg"
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }, [previewRef, surface, angle, generating])

  return (
    <div className="space-y-4">
      {/* Surface presets */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Oberfläche</Label>
        <div className="flex gap-2">
          {(Object.entries(surfaceConfigs) as [SurfacePreset, typeof surfaceConfigs.wood][]).map(
            ([key, config]) => (
              <button
                key={key}
                onClick={() => setSurface(key)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors",
                  surface === key
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50",
                )}
              >
                <span className="text-lg">{config.icon}</span>
                <span>{config.label}</span>
              </button>
            ),
          )}
        </div>
      </div>

      {/* Angle presets */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Winkel</Label>
        <div className="flex gap-2">
          {(Object.entries(angleConfigs) as [AnglePreset, typeof angleConfigs.flat][]).map(
            ([key, config]) => (
              <button
                key={key}
                onClick={() => setAngle(key)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors",
                  angle === key
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50",
                )}
              >
                <span>{config.label}</span>
              </button>
            ),
          )}
        </div>
      </div>

      {/* Generate button */}
      <Button onClick={handleGenerate} disabled={generating} className="w-full" size="lg">
        {generating ? "Wird generiert..." : "Foto generieren & herunterladen"}
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Update src/App.tsx to render PhotoGenerator**

Replace the photo generation placeholder with the actual component. Pass `previewRef`.

```tsx
import { useRef } from "react"
import { useReceipt } from "@/hooks/use-receipt"
import { ReceiptForm } from "@/components/receipt-form/receipt-form"
import { ReceiptPreview } from "@/components/receipt-preview"
import { PhotoGenerator } from "@/components/photo-generator/photo-generator"

export default function App() {
  const { receipt, dispatch, totals } = useReceipt()
  const previewRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left panel: form */}
      <div className="w-[440px] shrink-0 overflow-y-auto border-r border-border p-6">
        <h1 className="mb-4 text-lg font-semibold">Belegdaten</h1>
        <ReceiptForm receipt={receipt} dispatch={dispatch} totals={totals} />
      </div>

      {/* Right panel: preview + photo generation */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-1 justify-center bg-muted/30 p-6">
          <div className="self-start rounded-md shadow-lg">
            <ReceiptPreview receipt={receipt} totals={totals} previewRef={previewRef} />
          </div>
        </div>
        <div className="border-t border-border p-6">
          <PhotoGenerator previewRef={previewRef} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`. Verify:
- Surface preset buttons render with icons and labels, selection highlights
- Angle preset buttons render with labels, selection highlights
- Clicking "Foto generieren & herunterladen" captures the receipt, generates a 3D photo, and triggers a JPG download
- The downloaded image shows the receipt on the selected surface with the selected angle
- Button shows "Wird generiert..." while processing

- [ ] **Step 4: Commit**

```bash
git add src/components/photo-generator/photo-generator.tsx src/App.tsx
git commit -m "feat: add photo generator UI with surface and angle presets"
```

---

### Task 9: Polish and Post-Processing Tuning

**Files:**
- Modify: `src/components/photo-generator/scene.ts`, `src/components/photo-generator/textures.ts`

This task is for visual tuning after seeing initial results. The procedural textures and post-processing values (curl intensity, grain amount, vignette radius, lighting positions) will likely need adjustment.

- [ ] **Step 1: Run the app and generate photos with each preset combination**

Test all 12 combinations (3 surfaces × 4 angles). Note which ones look unrealistic or have visual issues.

- [ ] **Step 2: Tune values**

Adjust the following based on visual inspection:
- **Textures:** Wood grain density, marble vein thickness, dark desk noise level
- **Paper curl:** `curlIntensity` values in `presets.ts` — too much curl looks cartoonish, too little looks flat
- **Lighting:** Position and intensity for each surface — ensure receipt text is readable in all combinations
- **Film grain:** Noise amplitude in `addFilmGrain()` — should be subtle
- **Vignette:** Gradient radii in `addVignette()` — should darken corners without obscuring receipt
- **Shadow:** Ensure shadow is visible but soft

- [ ] **Step 3: Verify all 12 combinations look acceptable**

Re-test each combination after tuning.

- [ ] **Step 4: Commit**

```bash
git add src/components/photo-generator/
git commit -m "fix: tune textures, lighting, and post-processing for realistic output"
```

---

### Task 10: Dockerfile

**Files:**
- Create: `Dockerfile`, `.dockerignore`

- [ ] **Step 1: Create Dockerfile**

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 2: Create .dockerignore**

```
node_modules
dist
.git
.superpowers
docs
*.md
```

- [ ] **Step 3: Verify Docker build**

```bash
docker build -t receipt-gen .
docker run --rm -p 8080:80 receipt-gen
```

Open `http://localhost:8080` — verify the app loads and works. Stop the container.

- [ ] **Step 4: Commit**

```bash
git add Dockerfile .dockerignore
git commit -m "feat: add Dockerfile for nginx-based deployment"
```
