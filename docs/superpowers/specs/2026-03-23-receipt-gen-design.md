# Receipt Generator — Design Spec

## Overview

A standalone web application that provides a data entry form for receipt information, generates a live receipt preview, and creates realistic "fake photo" renders of receipts using Three.js with 3D effects. Extracted from the `thermal-printer` project as an independent tool.

**Target users:** Developers, designers, and product teams needing receipt imagery for testing, demos, or presentations.

## Architecture

Pure frontend SPA — no backend. Builds to static assets served by nginx in Docker.

**Stack:**
- React 19, TypeScript, Vite
- Tailwind CSS 4, Shadcn/UI, Lucide icons
- Three.js (direct, not R3F) for 3D photo generation
- html2canvas for capturing receipt DOM to texture
- qrcode-generator for inline QR codes

## Layout

Two-panel side-by-side layout:

- **Left panel (scrollable):** Data entry form with collapsible sections
- **Right panel (sticky):**
  - Live receipt preview (top) — HTML/CSS rendered, updates in real-time
  - Photo generation controls (bottom) — surface presets, angle presets, generate button

## Data Model

### ReceiptItem

| Field | Type |
|-------|------|
| name | string |
| quantity | number |
| unitPrice | number |

### ReceiptData

| Field | Type | Default |
|-------|------|---------|
| storeName | string | "Müller Lebensmittel" |
| addressLine1 | string | "Hauptstraße 42" |
| addressLine2 | string | "10115 Berlin" |
| phone | string | "+49 30 12345678" |
| vatNumber | string | "DE123456789" |
| receiptNumber | string | "00001" |
| date | string | randomized today 08:00-19:59 |
| cashier | string | "Anna K." |
| items | ReceiptItem[] | 4 German grocery items |
| vatRate | number | 19 |
| paymentMethod | string | "Karte" |
| amountPaid | string | "" |
| qrCode | string | "" |
| footer | string | "Vielen Dank für Ihren Einkauf!" |

**Default items:**
- Vollmilch 3,5% — qty 2 — 1,29 €
- Vollkornbrot — qty 1 — 2,49 €
- Deutsche Markenbutter — qty 1 — 2,19 €
- Orangensaft 1L — qty 2 — 1,99 €

**State management:** Single `useReducer` in App. Form sections dispatch actions, preview reads state directly. No external state library.

## Receipt Preview

Live HTML/CSS rendering mimicking thermal paper:

- Fixed width (~300px), white background, box-shadow for paper edge
- Monospace font (`Courier New` / system monospace), sized for ~32 chars per line
- Store header centered, separators with `=` and `-`, items with qty×price right-aligned, totals with flexbox space-between, footer centered
- QR code rendered inline via qrcode-generator
- German currency formatting via `Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })`
- All receipt text labels in German (Beleg-Nr, Datum, Kasse, GESAMT, Netto, MwSt, etc.)

The preview DOM is also the capture source for html2canvas, so styling avoids CSS features html2canvas can't handle (no backdrop-filter, complex gradients).

## Three.js Photo Generation

### Scene Setup

- Offscreen rendering — Three.js `WebGLRenderer` creates a canvas only during generation
- Output resolution: 1920x1440 (4:3 landscape)
- Camera: `PerspectiveCamera`, FOV ~40°, positioned above table

### Receipt Mesh

- Geometry: `PlaneGeometry` with subdivisions (32x64 segments) for vertex displacement
- Texture: html2canvas capture applied as `MeshStandardMaterial` map
- Paper curl: vertex displacement via sine wave along Y axis, intensity varies by angle preset

### Surface Presets

| Preset | Texture | Lighting |
|--------|---------|----------|
| **Wood** | Procedural wood grain (Canvas 2D generated) | Warm point light + ambient |
| **Marble** | Procedural marble with subtle veining | Cool white light + ambient |
| **Dark Desk** | Dark matte surface | Soft overhead spotlight + ambient |

Surface is a large `PlaneGeometry` beneath the receipt with texture applied. All textures are procedurally generated — no embedded images or CDN dependencies.

### Angle Presets

| Preset | Transform | Paper Curl | Description |
|--------|-----------|------------|-------------|
| **Flat** | Receipt flat, camera directly above | Minimal edge curl | Top-down photo |
| **Angled** | Receipt rotated ~15° Z, camera slightly off-center | Light curl | Casually placed |
| **Perspective** | Camera at ~30° from horizontal, receipt flat | Medium curl | Shot from an angle |
| **Crumpled** | Receipt rotated ~5° Z, camera slightly above | Heavy curl + wrinkle displacement | Looks pocket-worn |

### Post-Processing

- Soft shadow beneath receipt (shadow mapping or blurred dark plane)
- Depth-of-field blur at edges (BokehPass or vignette)
- Film grain noise overlay for photo realism

### Generation Flow

1. html2canvas captures `ReceiptPreview` DOM → Canvas → image data
2. Three.js scene created with selected surface + angle preset
3. Receipt texture applied to curved mesh
4. Scene rendered to offscreen canvas
5. Post-processing applied
6. Canvas exported as JPG blob → browser download triggered

## Project Structure

```
receipt-gen/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Dockerfile
├── .dockerignore
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types.ts
│   ├── defaults.ts
│   ├── reducer.ts
│   ├── components/
│   │   ├── receipt-form/
│   │   │   ├── receipt-form.tsx
│   │   │   ├── store-info-section.tsx
│   │   │   ├── receipt-details-section.tsx
│   │   │   ├── items-section.tsx
│   │   │   ├── payment-section.tsx
│   │   │   └── footer-section.tsx
│   │   ├── receipt-preview.tsx
│   │   └── photo-generator/
│   │       ├── photo-generator.tsx
│   │       ├── scene.ts
│   │       ├── presets.ts
│   │       └── textures.ts
│   ├── lib/
│   │   └── utils.ts
│   └── hooks/
│       └── use-receipt.ts
├── components/ui/
```

## Dependencies

| Package | Purpose |
|---------|---------|
| react, react-dom | UI framework |
| three, @types/three | 3D scene rendering |
| html2canvas | Capture receipt DOM → texture |
| qrcode-generator | QR code rendering |
| tailwindcss, @tailwindcss/vite | Styling |
| shadcn + components | Form inputs, buttons, cards, select |
| lucide-react | Icons |

## Dockerfile

Multi-stage build: `node:22-alpine` for build, `nginx:alpine` for serving static assets on port 80.

## Out of Scope

- Thermal printer hardware integration
- Receipt data persistence / saving
- Multi-language support (German only)
- Mobile-specific optimizations (desktop-first)
- User accounts or authentication
