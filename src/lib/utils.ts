import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function money(value: number, currency = "USD") {
  if (value === 0) return "Free";

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Vite base-aware asset URL for a photo filename in /public/photos. */
export function photoUrl(file: string) {
  return `${import.meta.env.BASE_URL}photos/${file}`;
}
