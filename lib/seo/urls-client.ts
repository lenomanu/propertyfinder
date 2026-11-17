/** Client-safe absolute URL (uses window.origin in the browser). */
export function absoluteUrlClient(path: string): string {
  if (typeof window === "undefined") return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${window.location.origin}${normalized}`;
}