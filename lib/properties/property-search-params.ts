
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const LAND_SIZE_VALUES = [
  "0.125",
  "0.25",
  "0.5",
  "0.75",
  "1",
  "2",
  "3",
  "4",
  "5",
] as const;

export const LAND_SIZE_PRESETS = [
  { label: "1/8 Acre", value: "0.125" },
  { label: "1/4 Acre", value: "0.25" },
  { label: "1/2 Acre", value: "0.5" },
  { label: "3/4 Acre", value: "0.75" },
  { label: "1 Acre", value: "1" },
  { label: "2 Acres", value: "2" },
  { label: "3 Acres", value: "3" },
  { label: "4 Acres", value: "4" },
  { label: "5 Acres+", value: "5" },
] as const satisfies readonly {
  label: string;
  value: (typeof LAND_SIZE_VALUES)[number];
}[];

export const LISTING_TYPES = ["sale", "rent"] as const;

export type ListingType = (typeof LISTING_TYPES)[number];

export function listingTypeParser(defaultListingType: ListingType = "sale") {
  return parseAsStringLiteral(LISTING_TYPES).withDefault(defaultListingType);
}

export const propertySearchParams = {
  search: parseAsString.withDefault(""),

  listingType: listingTypeParser("sale"),

  propertyType: parseAsString.withDefault(""),

  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,

  minLandSize: parseAsStringLiteral(LAND_SIZE_VALUES),

  locality: parseAsString,

  bedrooms: parseAsInteger,
  bathrooms: parseAsInteger,

  sort: parseAsStringLiteral([
    "newest",
    "oldest",
    "price_asc",
    "price_desc",
  ]).withDefault("newest"),

  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(20),
};

export const loadPropertySearchParams = createLoader(
  propertySearchParams
);

export function loadPropertySearchParamsFor(
  searchParams: Parameters<typeof loadPropertySearchParams>[0],
  defaultListingType: ListingType
) {
  return createLoader({
    ...propertySearchParams,
    listingType: listingTypeParser(defaultListingType),
  })(searchParams);
}

export type PropertySearchFilters = {
  search: string;
  listingType: "sale" | "rent";
  propertyType: string;
  minPrice: number | null;
  maxPrice: number | null;
  minLandSize: (typeof LAND_SIZE_VALUES)[number] | null;
  locality: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sort: "newest" | "oldest" | "price_asc" | "price_desc";
  page: number;
  pageSize: number;
};
