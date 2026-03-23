import { useRef, useState } from "react"
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
import { Moon, Sun, EllipsisVertical, FileText, Eye, Camera } from "lucide-react"
import { cn } from "@/lib/utils"

function SettingsMenu() {
  const { dark, toggle } = useDarkMode()
  return (
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
  )
}

type MobileTab = "form" | "preview" | "generate"

const tabs: { key: MobileTab; label: string; icon: React.ReactNode }[] = [
  { key: "form", label: "Form", icon: <FileText className="size-4" /> },
  { key: "preview", label: "Preview", icon: <Eye className="size-4" /> },
  { key: "generate", label: "Generate", icon: <Camera className="size-4" /> },
]

export default function App() {
  const { receipt, dispatch, totals } = useReceipt()
  const previewRef = useRef<HTMLDivElement>(null)
  const [mobileTab, setMobileTab] = useState<MobileTab>("form")

  return (
    <div className="bg-background text-foreground">
      {/* Desktop layout */}
      <div className="hidden h-screen md:flex">
        <div className="fixed right-3 top-3 z-10">
          <SettingsMenu />
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

      {/* Mobile layout */}
      <div className="flex h-screen flex-col md:hidden">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <h1 className="text-base font-semibold">Receipt Generator</h1>
          <SettingsMenu />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {mobileTab === "form" && (
            <div className="p-4">
              <ReceiptForm receipt={receipt} dispatch={dispatch} totals={totals} />
            </div>
          )}
          {mobileTab === "preview" && (
            <div className="flex justify-center bg-muted/30 p-4">
              <div className="rounded-md shadow-lg">
                <ReceiptPreview receipt={receipt} totals={totals} previewRef={previewRef} />
              </div>
            </div>
          )}
          {mobileTab === "generate" && (
            <div className="p-4">
              <div className="mb-4 flex justify-center rounded-lg bg-muted/30 p-4">
                <div className="origin-top scale-75 rounded-md shadow-lg">
                  <ReceiptPreview receipt={receipt} totals={totals} previewRef={previewRef} />
                </div>
              </div>
              <PhotoGenerator previewRef={previewRef} />
            </div>
          )}
        </div>

        {/* Bottom tab bar */}
        <div className="flex shrink-0 border-t border-border bg-background">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMobileTab(tab.key)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
                mobileTab === tab.key
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
