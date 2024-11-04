import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  const isDev = process.env.NODE_ENV === "development";
  const url =
    process.env.NEXT_PUBLIC_APP_DOMAIN && !isDev
      ? `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : "http://localhost:3000";

  return url;
}
