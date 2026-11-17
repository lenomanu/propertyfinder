import type { PropertyDetail } from "@/lib/properties/property";
import { absoluteUrl } from "@/lib/seo/urls";

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

type BuildPropertyJsonLdOptions = {
  property: PropertyDetail;
  slug: string;
  primaryImageUrl: string | null;
};

function stripUndefined(
  value: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined && v !== null)
  );
}

export function buildPropertyJsonLd({
  property,
  slug,
  primaryImageUrl,
}: BuildPropertyJsonLdOptions): Record<string, unknown> {
  const typeLabel =
    PROPERTY_TYPE_LABELS[property.property_type] ?? "Property";
  const pageUrl = absoluteUrl(`/${encodeURIComponent(slug)}`);
  const description =
    property.description?.trim() ||
    `${typeLabel} ${
      property.listing_type === "rent" ? "for rent" : "for sale"
    } in ${[property.locality, property.county].filter(Boolean).join(", ") || "Kenya"}.`;

  const offer = stripUndefined({
    "@type": "Offer",
    price: String(property.price),
    priceCurrency: property.currency === "USD" ? "USD" : "KES",
    url: pageUrl,
    availability:
      property.status === "sold"
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
  });

  const postalAddress = stripUndefined({
    "@type": "PostalAddress",
    streetAddress: property.nearest_town ?? undefined,
    addressLocality: property.locality ?? undefined,
    addressRegion: property.county ?? undefined,
    addressCountry: "Kenya",
  });

  return stripUndefined({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description,
    url: pageUrl,
    ...(primaryImageUrl ? { image: [primaryImageUrl] } : {}),
    datePosted: property.created_at,
    dateModified: property.updated_at,
    ...(Object.keys(postalAddress).length > 1
      ? { address: postalAddress }
      : {}),
    ...(property.latitude != null && property.longitude != null
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: property.latitude,
            longitude: property.longitude,
          },
        }
      : {}),
    offers: offer,
  });
}

export function buildWebsiteJsonLd(): Record<string, unknown> {
  const searchUrl = absoluteUrl("/properties-for-sale");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Property Team",
    alternateName: "Propertyteam",
    url: absoluteUrl("/"),
    description:
      "Search property for sale and rent across Kenya with Property Team.",
    inLanguage: "en-KE",
    publisher: {
      "@type": "Organization",
      name: "Property Team",
      url: absoluteUrl("/"),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${searchUrl}?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}