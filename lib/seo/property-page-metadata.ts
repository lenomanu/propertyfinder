import type { Metadata } from "next";

import { getPublicImageUrl } from "@/lib/cloudflare/public-image-url";
import type { PropertyDetail } from "@/lib/properties/property";
import { pageMetadata, truncateMetaDescription } from "@/lib/seo/metadata";

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house: "House",
  apartment: "Apartment",
  condo: "Condo",
  "multi-family": "Multi-family home",
  land: "Land",
  plot: "Plot",
  villa: "Villa",
  office: "Office",
  warehouse: "Warehouse",
  commercial: "Commercial",
};

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function primaryPropertyImageUrl(
  property: PropertyDetail
): string | null {
  const path =
    property.images.find((image) => image.is_primary)?.storage_path ??
    property.images[0]?.storage_path;

  if (!path) return null;

  try {
    return getPublicImageUrl(path);
  } catch {
    return null;
  }
}

export function propertyPageMetadata(
  property: PropertyDetail,
  slug: string
): Metadata {
  const typeLabel =
    PROPERTY_TYPE_LABELS[property.property_type] ?? "Property";
  const listing =
    property.listing_type === "rent" ? "for rent" : "for sale";
  const location = [property.locality, property.county]
    .filter(Boolean)
    .join(", ");
  const price = formatPrice(property.price, property.currency);

  const title =
    property.status === "sold"
      ? `${property.title} – Sold in ${location || "Kenya"}`
      : `${property.title} – ${typeLabel} ${listing} in ${location || "Kenya"}`;

  const description = truncateMetaDescription(
    property.description?.trim() ||
      `${typeLabel} ${listing} in ${location || "Kenya"} at ${price}. View photos, features, and contact the listing agent on Property Team.`
  );

  const image = primaryPropertyImageUrl(property);

  return pageMetadata({
    title,
    description,
    path: `/${encodeURIComponent(slug)}`,
    image,
    ...(property.status === "sold"
      ? { robots: { index: true, follow: true } }
      : {}),
  });
}
