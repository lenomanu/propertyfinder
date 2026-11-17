import { absoluteUrl } from "@/lib/seo/urls";

/** Same-origin preview image for Open Graph and native share sheets. */
export function propertyShareImagePath(slug: string): string {
  return `/api/share-image/${encodeURIComponent(slug)}`;
}

export function propertyShareImageUrl(slug: string): string {
  return absoluteUrl(propertyShareImagePath(slug));
}