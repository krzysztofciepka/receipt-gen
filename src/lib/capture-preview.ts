import html2canvas from "html2canvas"

export async function capturePreview(el: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    onclone: (clonedDoc) => {
      // html2canvas cannot parse OKLCH color functions used by Tailwind CSS 4.
      // Strip stylesheets so only the inline styles on the preview remain.
      clonedDoc.querySelectorAll("style, link[rel='stylesheet']").forEach((e) => e.remove())
      const style = clonedDoc.createElement("style")
      style.textContent = `
        *, *::before, *::after { border-color: transparent; outline-color: transparent; }
        body { background: #ffffff; color: #000000; margin: 0; }
      `
      clonedDoc.head.appendChild(style)
    },
  })
}

export function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 3000)
}
