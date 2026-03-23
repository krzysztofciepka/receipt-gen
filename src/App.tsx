import { useRef } from "react"
import { useReceipt } from "@/hooks/use-receipt"
import { useDarkMode } from "@/hooks/use-dark-mode"
import { ReceiptForm } from "@/components/receipt-form/receipt-form"
import { ReceiptPreview } from "@/components/receipt-preview"
import { PhotoGenerator } from "@/components/photo-generator/photo-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, EllipsisVertical, FileText, Eye, Camera } from "lucide-react"

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

function DesktopLayout({ receipt, dispatch, totals, previewRef }: {
  receipt: import("@/types").ReceiptData
  dispatch: import("@/hooks/use-receipt").ReceiptDispatch
  totals: import("@/types").Totals
  previewRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
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
  )
}

function MobileLayout({ receipt, dispatch, totals, previewRef }: {
  receipt: import("@/types").ReceiptData
  dispatch: import("@/hooks/use-receipt").ReceiptDispatch
  totals: import("@/types").Totals
  previewRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div className="flex h-screen flex-col md:hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h1 className="text-base font-semibold">Receipt Generator</h1>
        <SettingsMenu />
      </div>
      <Tabs defaultValue={0} className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <TabsContent value={0} className="mt-0 p-4">
            <ReceiptForm receipt={receipt} dispatch={dispatch} totals={totals} />
          </TabsContent>
          <TabsContent value={1} className="mt-0 flex justify-center bg-muted/30 p-4">
            <div className="rounded-md shadow-lg">
              <ReceiptPreview receipt={receipt} totals={totals} previewRef={previewRef} />
            </div>
          </TabsContent>
          <TabsContent value={2} className="mt-0 p-4">
            <div className="mb-4 flex justify-center bg-muted/30 rounded-lg p-4">
              <div className="rounded-md shadow-lg scale-75 origin-top">
                <ReceiptPreview receipt={receipt} totals={totals} previewRef={previewRef} />
              </div>
            </div>
            <PhotoGenerator previewRef={previewRef} />
          </TabsContent>
        </div>
        <TabsList className="w-full rounded-none border-t border-border bg-background p-0 h-14">
          <TabsTrigger value={0} className="flex-1 flex-col gap-0.5 rounded-none py-2 text-xs data-active:bg-muted">
            <FileText className="size-4" />
            Form
          </TabsTrigger>
          <TabsTrigger value={1} className="flex-1 flex-col gap-0.5 rounded-none py-2 text-xs data-active:bg-muted">
            <Eye className="size-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value={2} className="flex-1 flex-col gap-0.5 rounded-none py-2 text-xs data-active:bg-muted">
            <Camera className="size-4" />
            Generate
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

export default function App() {
  const { receipt, dispatch, totals } = useReceipt()
  const previewRef = useRef<HTMLDivElement>(null)

  return (
    <div className="bg-background text-foreground">
      <DesktopLayout receipt={receipt} dispatch={dispatch} totals={totals} previewRef={previewRef} />
      <MobileLayout receipt={receipt} dispatch={dispatch} totals={totals} previewRef={previewRef} />
    </div>
  )
}
