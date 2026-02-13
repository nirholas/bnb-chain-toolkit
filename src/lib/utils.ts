/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Shared utilities for the toolkit
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
