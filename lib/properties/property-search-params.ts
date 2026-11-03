
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const propertySearchParams = {
  search: parseAsString.withDefault(""),

  listingType: parseAsStringLiteral([
    "sale",
    "rent",
  ]).withDefault("sale"),

  propertyType: parseAsString.withDefault(""),

  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,

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

export type PropertySearchFilters = {
  search: string;
  listingType: "sale" | "rent";
  propertyType: string;
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sort: "newest" | "oldest" | "price_asc" | "price_desc";
  page: number;
  pageSize: number;
};
