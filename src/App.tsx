import { useRef } from "react"
import { useReceipt } from "@/hooks/use-receipt"
import { useDarkMode } from "@/hooks/use-dark-mode"
import { ReceiptForm } from "@/components/receipt-form/receipt-form"
import { ReceiptPreview } from "@/components/receipt-preview"
import { PhotoGenerator } from "@/components/photo-generator/photo-generator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, EllipsisVertical } from "lucide-react"

export default function App() {
  const { receipt, dispatch, totals } = useReceipt()
  const previewRef = useRef<HTMLDivElement>(null)
  const { dark, toggle } = useDarkMode()

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="fixed right-3 top-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <EllipsisVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={toggle}>
              {dark ? <Sun className="mr-2 size-4" /> : <Moon className="mr-2 size-4" />}
              {dark ? "Light Mode" : "Dark Mode"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-[440px] shrink-0 overflow-y-auto border-r border-border p-6">
        <h1 className="mb-4 text-lg font-semibold">Receipt Data</h1>
        <ReceiptForm receipt={receipt} dispatch={dispatch} totals={totals} />
      </div>
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
