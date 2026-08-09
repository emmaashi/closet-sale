import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const money = (n: number) => "$" + n.toLocaleString();

/** Vite base-aware asset URL for a photo filename in /public/photos. */
export function photoUrl(file: string) {
  return `${import.meta.env.BASE_URL}photos/${file}`;
}
