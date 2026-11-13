import type { Metadata } from "next";

import {
  LAND_SIZE_PRESETS,
  loadPropertySearchParamsFor,
  type ListingType,
  type PropertySearchFilters,
} from "@/lib/properties/property-search-params";
import { pageMetadata, truncateMetaDescription } from "@/lib/seo/metadata";

const PROPERTY_TYPE_LABELS: Record<
  string,
  { label: string; listingPhrase: string }
> = {
  house: { label: "Houses", listingPhrase: "houses" },
  apartment: { label: "Apartments", listingPhrase: "apartments" },
  land: { label: "Land", listingPhrase: "land" },
  plot: { label: "Plots", listingPhrase: "plots" },
  villa: { label: "Villas", listingPhrase: "villas" },
  office: { label: "Offices", listingPhrase: "office space" },
  warehouse: { label: "Warehouses", listingPhrase: "warehouses" },
  home: { label: "Homes", listingPhrase: "homes" },
  condo: { label: "Condos", listingPhrase: "condos" },
  "multi-family": { label: "Multi-family homes", listingPhrase: "multi-family homes" },
  commercial: { label: "Commercial property", listingPhrase: "commercial property" },
};

type ListingSeoContext = {
  listingType: ListingType;
  /** Canonical path without query, e.g. `/properties-for-sale` or `/properties-for-sale/nairobi`. */
  basePath: string;
  /** When set (city route), locality is fixed in the title and omitted from the query string when unchanged. */
  fixedLocality?: string;
};

export type ListingSearchSeo = {
  title: string;
  description: string;
  keywords: string[];
  pathWithQuery: string;
};

function listingIntent(listingType: ListingType) {
  return listingType === "rent" ? "for rent" : "for sale";
}

function formatKes(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

function landSizeLabel(value: PropertySearchFilters["minLandSize"]): string | null {
  if (!value) return null;
  const preset = LAND_SIZE_PRESETS.find((item) => item.value === value);
  return preset?.label ?? `${value} acre${value === "1" ? "" : "s"}`;
}

function bedroomPhrase(count: number | null): string | null {
  if (count === null) return null;
  if (count === 0) return "studio";
  if (count === 1) return "1 bedroom";
  return `${count}+ bedroom`;
}

function bathroomPhrase(count: number | null): string | null {
  if (count === null) return null;
  if (count === 1) return "1 bathroom";
  return `${count}+ bathroom`;
}

function pricePhrase(min: number | null, max: number | null): string | null {
  if (min !== null && max !== null) {
    return `${formatKes(min)} – ${formatKes(max)}`;
  }
  if (min !== null) return `from ${formatKes(min)}`;
  if (max !== null) return `up to ${formatKes(max)}`;
  return null;
}

function propertySubject(propertyType: string, listingType: ListingType): string {
  const config = PROPERTY_TYPE_LABELS[propertyType];
  if (config) return config.listingPhrase;
  return listingType === "rent" ? "property to rent" : "property for sale";
}

function propertyTitleLead(propertyType: string): string {
  const config = PROPERTY_TYPE_LABELS[propertyType];
  if (config) return config.label;
  return "Property";
}

function isLandType(propertyType: string) {
  return propertyType === "land" || propertyType === "plot";
}

function hasFilterQuery(filters: PropertySearchFilters, context: ListingSeoContext): boolean {
  const fixed = context.fixedLocality?.trim();
  const locality = filters.locality?.trim();
  const localityCountsAsFilter = Boolean(locality) && !(fixed && (!locality || locality === fixed));

  return (
    Boolean(filters.search.trim()) ||
    Boolean(filters.propertyType) ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.minLandSize !== null ||
    localityCountsAsFilter ||
    filters.bedrooms !== null ||
    filters.bathrooms !== null ||
    filters.page > 1
  );
}

function buildCanonicalQuery(
  filters: PropertySearchFilters,
  context: ListingSeoContext
): string {
  const params = new URLSearchParams();
  const fixed = context.fixedLocality?.trim();

  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.propertyType) params.set("propertyType", filters.propertyType);
  if (filters.minPrice !== null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.minLandSize) params.set("minLandSize", filters.minLandSize);
  if (filters.bedrooms !== null) params.set("bedrooms", String(filters.bedrooms));
  if (filters.bathrooms !== null) params.set("bathrooms", String(filters.bathrooms));

  const locality = filters.locality?.trim();
  if (locality && locality !== fixed) {
    params.set("locality", locality);
  }

  if (filters.page > 1) params.set("page", String(filters.page));

  return params.toString();
}

export function buildListingSearchSeo(
  filters: PropertySearchFilters,
  context: ListingSeoContext
): ListingSearchSeo {
  const intent = listingIntent(context.listingType);
  const locality =
    filters.locality?.trim() || context.fixedLocality?.trim() || "";
  const land = isLandType(filters.propertyType);

  const defaultTitle =
    context.listingType === "rent"
      ? locality
        ? `Property for rent in ${locality}, Kenya`
        : "Property for rent in Kenya"
      : locality
        ? `Property for sale in ${locality}, Kenya`
        : "Property for sale in Kenya";

  if (!hasFilterQuery(filters, context)) {
    const description = locality
      ? context.listingType === "rent"
        ? `Find houses and apartments for rent in ${locality}, Kenya. Filter by price, bedrooms, bathrooms, and property type on Property Team.`
        : `Find houses, apartments, and land for sale in ${locality}, Kenya. Compare prices and explore listings on Property Team.`
      : context.listingType === "rent"
        ? "Find houses and apartments for rent across Kenya. Filter by locality, price, bedrooms, and property type on Property Team."
        : "Browse homes, apartments, land, and commercial property for sale across Kenya. Filter by location, price, and property type on Property Team.";

    return {
      title: defaultTitle,
      description,
      keywords: defaultKeywords(context.listingType, locality),
      pathWithQuery: context.basePath,
    };
  }

  const lead = filters.propertyType
    ? propertyTitleLead(filters.propertyType)
    : "Property";

  const titleParts: string[] = [];
  const bedroom = !land ? bedroomPhrase(filters.bedrooms) : null;
  const bathroom = !land ? bathroomPhrase(filters.bathrooms) : null;
  const landSize = land ? landSizeLabel(filters.minLandSize) : null;
  const price = pricePhrase(filters.minPrice, filters.maxPrice);

  if (filters.search.trim()) {
    titleParts.push(`Properties matching “${filters.search.trim()}”`);
  }

  if (filters.propertyType) {
    const subject = propertySubject(filters.propertyType, context.listingType);
    if (bedroom) {
      titleParts.push(`${bedroom} ${subject} ${intent}`);
    } else {
      titleParts.push(`${lead} ${intent}`);
    }
  } else if (bedroom) {
    titleParts.push(`${bedroom} property ${intent}`);
  } else {
    titleParts.push(`Property ${intent}`);
  }

  if (locality) {
    titleParts.push(`in ${locality}`);
  } else if (!context.fixedLocality) {
    titleParts.push("in Kenya");
  }

  if (landSize) {
    titleParts.push(`from ${landSize}`);
  }

  if (price) {
    titleParts.push(price);
  }

  if (bathroom) {
    titleParts.push(bathroom);
  }

  if (filters.page > 1) {
    titleParts.push(`page ${filters.page}`);
  }

  let title = titleParts.join(" ");

  if (!title.includes("Kenya")) {
    title = `${title}, Kenya`;
  }

  title = title.replace(/\s+/g, " ").trim();

  const descriptionBits = [
    truncateMetaDescription(
      `Browse ${lead.toLowerCase()} ${intent}${
        locality ? ` in ${locality}` : " across Kenya"
      } on Property Team.`,
      80
    ),
  ];

  if (price) descriptionBits.push(price);
  if (landSize) descriptionBits.push(`Minimum land size: ${landSize}.`);
  if (bedroom) descriptionBits.push(`Filter: ${bedroom}.`);
  if (bathroom) descriptionBits.push(`Filter: ${bathroom}.`);
  if (filters.search.trim()) {
    descriptionBits.push(`Results matching “${filters.search.trim()}”.`);
  }

  const description = truncateMetaDescription(descriptionBits.join(" "));

  const query = buildCanonicalQuery(filters, context);
  const pathWithQuery = query ? `${context.basePath}?${query}` : context.basePath;

  return {
    title,
    description,
    keywords: buildKeywords(filters, context, locality),
    pathWithQuery,
  };
}

function defaultKeywords(listingType: ListingType, locality: string): string[] {
  const intent = listingType === "rent" ? "rent" : "sale";
  const base =
    listingType === "rent"
      ? ["property for rent Kenya", "houses for rent", "apartments for rent"]
      : ["property for sale Kenya", "houses for sale", "land for sale"];

  if (locality) {
    base.push(
      `property for ${intent} ${locality}`,
      `houses for ${intent} ${locality}`
    );
  }

  return base;
}

function buildKeywords(
  filters: PropertySearchFilters,
  context: ListingSeoContext,
  locality: string
): string[] {
  const keywords = defaultKeywords(context.listingType, locality);
  const intent = listingTypeKeyword(context.listingType);

  if (filters.propertyType) {
    const subject = propertySubject(filters.propertyType, context.listingType);
    keywords.push(
      `${subject} for ${intent} Kenya`,
      locality ? `${subject} for ${intent} ${locality}` : `${subject} for ${intent}`
    );
  }

  if (filters.bedrooms !== null) {
    const bed =
      filters.bedrooms === 0
        ? "studio"
        : `${filters.bedrooms} bedroom`;
    keywords.push(
      `${bed} for ${intent} Kenya`,
      locality ? `${bed} for ${intent} ${locality}` : bed
    );
  }

  if (filters.minLandSize && isLandType(filters.propertyType)) {
    const size = landSizeLabel(filters.minLandSize);
    if (size) {
      keywords.push(`land for ${intent} ${size}`, `plots for ${intent} Kenya`);
    }
  }

  return [...new Set(keywords)].slice(0, 12);
}

function listingTypeKeyword(listingType: ListingType) {
  return listingType === "rent" ? "rent" : "sale";
}

/** Visible H1 for listing results — aligned with SEO titles where possible. */
export function listingSearchHeadline(
  filters: PropertySearchFilters,
  context: Omit<ListingSeoContext, "basePath"> & { basePath?: string }
): string {
  const seo = buildListingSearchSeo(filters, {
    basePath: context.basePath ?? "",
    listingType: context.listingType,
    fixedLocality: context.fixedLocality,
  });

  return seo.title.replace(/, Kenya$/i, "").replace(/\s+page \d+$/i, "");
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function listingSearchMetadata(
  searchParams: SearchParams,
  defaultListingType: ListingType,
  basePath: string,
  fixedLocality?: string
): Promise<Metadata> {
  const raw = await searchParams;
  const merged = fixedLocality
    ? { ...raw, locality: fixedLocality }
    : raw;

  const filters = await loadPropertySearchParamsFor(
    Promise.resolve(merged),
    defaultListingType
  );

  const seo = buildListingSearchSeo(filters, {
    basePath,
    listingType: defaultListingType,
    fixedLocality,
  });

  return pageMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.pathWithQuery,
    keywords: seo.keywords,
  });
}
