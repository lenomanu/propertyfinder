import { getURL } from "@/lib/site-url";

/** Absolute site URL for a path (path may be with or without leading slash). */
export function absoluteUrl(path: string = ""): string {
  if (!path || path === "/") {
    return getURL().replace(/\/$/, "") || getURL();
  }
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return new URL(normalized, getURL()).href;
}

export function localityToCitySlug(locality: string): string {
  return encodeURIComponent(locality.toLowerCase().replace(/\s+/g, "-"));
}

export function cityTitleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}
