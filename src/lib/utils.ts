import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const money = (n: number) => "$" + n.toLocaleString();

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function fmtDate(s?: string) {
  if (!s) return "";
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return s;
  return `${MONTHS[m - 1]} ${d}`;
}

/** Vite base-aware asset URL for a photo filename in /public/photos. */
export function photoUrl(file: string) {
  return `${import.meta.env.BASE_URL}photos/${file}`;
}
