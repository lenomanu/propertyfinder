import { getURL } from "@/lib/site-url";

/** Absolute site URL for a path (path may be with or without leading slash). */
export function absoluteUrl(path: string = ""): string {
  if (!path || path === "/") {
    return getURL().replace(/\/$/, "") || getURL();
  }
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return new URL(normalized, getURL()).href;
}

function collapseHyphens(value: string): string {
  return value.replace(/-+/g, "-").replace(/^-|-$/g, "");
}

/** URL path segment for a DB locality (hyphenated, no percent-encoding). */
export function localityToCitySlug(locality: string): string {
  const normalized = locality
    .trim()
    .toLowerCase()
    .replace(/\s*,\s*/g, "-")
    .replace(/[^a-z0-9]+/g, "-");

  return collapseHyphens(normalized);
}

export function decodeCityRouteParam(city: string): string {
  try {
    return decodeURIComponent(city);
  } catch {
    return city;
  }
}

/** Undo repeated percent-encoding from bad internal links (e.g. `%252C`). */
export function fullyDecodeCityRouteParam(city: string): string {
  let value = city;
  for (let i = 0; i < 8; i += 1) {
    const next = decodeCityRouteParam(value);
    if (next === value) break;
    value = next;
  }
  return value;
}

/** Canonical city segment for `[city]` routes (handles legacy comma-encoded URLs). */
export function cityPathSegmentFromRouteParam(city: string): string {
  const decoded = fullyDecodeCityRouteParam(city).toLowerCase();
  const normalized = decoded.replace(/,/g, "-").replace(/[^a-z0-9]+/g, "-");
  return collapseHyphens(normalized);
}

export function cityTitleFromSlug(cityParam: string): string {
  const segment = cityPathSegmentFromRouteParam(cityParam);
  return segment
    .split("-")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(", ");
}

/** `ilike` pattern to match compound localities from a city route segment. */
export function localityPatternFromCityParam(city: string): string {
  const parts = cityPathSegmentFromRouteParam(city).split("-").filter(Boolean);
  if (parts.length === 0) return "";
  return `%${parts.join("%")}%`;
}

export function localityListingPath(
  locality: string,
  variant: "sale" | "rent" | "sold"
): string {
  const slug = localityToCitySlug(locality);
  const base =
    variant === "sold"
      ? "/properties-sold"
      : variant === "rent"
        ? "/properties-for-rent"
        : "/properties-for-sale";
  return `${base}/${slug}`;
}