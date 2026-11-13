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

export function buildPropertyJsonLd({
  property,
  slug,
  primaryImageUrl,
}: BuildPropertyJsonLdOptions): Record<string, unknown> {
  const typeLabel =
    PROPERTY_TYPE_LABELS[property.property_type] ?? "Property";
  const location = [property.locality, property.county]
    .filter(Boolean)
    .join(", ");

  const offer: Record<string, unknown> = {
    "@type": "Offer",
    price: property.price,
    priceCurrency: property.currency === "USD" ? "USD" : "KES",
    availability:
      property.status === "sold"
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
  };

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description ?? undefined,
    url: absoluteUrl(`/${encodeURIComponent(slug)}`),
    ...(primaryImageUrl ? { image: [primaryImageUrl] } : {}),
    datePosted: property.created_at,
    ...(property.updated_at ? { dateModified: property.updated_at } : {}),
    ...(location
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: property.locality ?? undefined,
            addressRegion: property.county ?? undefined,
            addressCountry: "KE",
          },
        }
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
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Property type",
      value: typeLabel,
    },
  };
}

export function buildWebsiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Property Team",
    url: absoluteUrl("/"),
    description:
      "Search property for sale and rent across Kenya with Property Team.",
    inLanguage: "en-KE",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/properties-for-sale")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
