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
