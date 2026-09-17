import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Splits plain multi-line text into paragraphs for simple, safe rendering
 * without pulling in a full markdown/rich-text dependency. */
export function paragraphs(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function formatDate(date: string | null | undefined): string | null {
  if (!date) return null;
  try {
    return new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(date));
  } catch {
    return null;
  }
}
