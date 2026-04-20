import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(amount: number, locale = "de-DE"): string {
  const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  try {
    return new Intl.NumberFormat(locale, options).format(amount)
  } catch {
    return new Intl.NumberFormat("de-DE", options).format(amount)
  }
}

export function formatCurrency(
  amount: number,
  symbol = "€",
  position: "prefix" | "suffix" = "suffix",
  locale = "de-DE",
): string {
  const formatted = formatNumber(amount, locale)
  return position === "prefix" ? `${symbol}${formatted}` : `${formatted} ${symbol}`
}
