
import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  Property,
  PropertyResult,
  FetchResult,
  PropertyPagination,
} from "@/lib/properties/property.types";

import type {
  PropertySearchFilters,
} from "@/lib/properties/property-search-params";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

type SearchFilters = Omit<
  PropertySearchFilters,
  "page" | "pageSize"
>;

export async function getSearchedProperties(
  filters: SearchFilters,
  pagination: PropertyPagination = {}
): Promise<FetchResult> {
  try {
    const supabase = await createClient();

    // -----------------------------------------
    // 1. Pagination
    // -----------------------------------------

    const page = Math.max(
      1,
      Math.floor(pagination.page ?? 1)
    );

    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(
        1,
        Math.floor(pagination.pageSize ?? DEFAULT_PAGE_SIZE)
      )
    );

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // -----------------------------------------
    // 2. Determine required relationships
    // -----------------------------------------

    const needsPropertyDetails =
      filters.bedrooms !== null ||
      filters.bathrooms !== null;

    const propertyDetailsJoin = needsPropertyDetails
      ? "property_details!inner"
      : "property_details";

    // -----------------------------------------
    // 3. Select property information
    // -----------------------------------------

    const selectQuery = `
      id,
      user_id,
      agency_id,
      slug,
      title,
      property_type,
      listing_type,
      price,
      price_period,
      currency,
      description,
      locality,
      nearest_town,
      county,
      latitude,
      longitude,
      status,
      created_at,
      updated_at,

      ${propertyDetailsJoin} (
        id,
        land_size,
        land_size_unit,
        bedrooms,
        bathrooms,
        car_ports,
        floor_area,
        floor_area_unit,
        floors,
        year_built,
        furnished
      ),

      land_details (
        id,
        land_size,
        land_size_unit,
        land_use
      ),

      property_images (
        storage_path
      )
    `;

    // -----------------------------------------
    // 4. Base query
    // -----------------------------------------

    let query: any = supabase
      .from("properties")
      .select(selectQuery, {
        count: "exact",
      })
      .eq("status", "approved");

    // -----------------------------------------
    // 5. Search
    // -----------------------------------------

    const searchTerm = filters.search
      ?.trim()
      .replace(/[,%()]/g, " ");

    if (searchTerm) {
      query = query.or(
        [
          `title.ilike.%${searchTerm}%`,
          `locality.ilike.%${searchTerm}%`,
          `nearest_town.ilike.%${searchTerm}%`,
          `county.ilike.%${searchTerm}%`,
        ].join(",")
      );
    }

    // -----------------------------------------
    // 6. Listing type
    // -----------------------------------------

    if (filters.listingType) {
      query = query.eq(
        "listing_type",
        filters.listingType
      );
    }

    // -----------------------------------------
    // 7. Property type
    // -----------------------------------------

    if (filters.propertyType) {
      query = query.eq(
        "property_type",
        filters.propertyType
      );
    }

    // -----------------------------------------
    // 8. Price filters
    // -----------------------------------------

    if (filters.minPrice !== null) {
      query = query.gte(
        "price",
        filters.minPrice
      );
    }

    if (filters.maxPrice !== null) {
      query = query.lte(
        "price",
        filters.maxPrice
      );
    }

    // -----------------------------------------
    // 9. Property details filters
    // -----------------------------------------

    if (filters.bedrooms !== null) {
      query = query.gte(
        "property_details.bedrooms",
        filters.bedrooms
      );
    }

    if (filters.bathrooms !== null) {
      query = query.gte(
        "property_details.bathrooms",
        filters.bathrooms
      );
    }

    // -----------------------------------------
    // 10. Sorting
    // -----------------------------------------

    switch (filters.sort) {
      case "price_asc":
        query = query.order("price", {
          ascending: true,
        });
        break;

      case "price_desc":
        query = query.order("price", {
          ascending: false,
        });
        break;

      case "oldest":
        query = query.order("created_at", {
          ascending: true,
        });
        break;

      case "newest":
      default:
        query = query.order("created_at", {
          ascending: false,
        });
        break;
    }

    // Stable ordering for pagination
    query = query.order("id", {
      ascending: true,
    });

    // -----------------------------------------
    // 11. Pagination
    // -----------------------------------------

    query = query.range(from, to);

    // -----------------------------------------
    // 12. Execute query
    // -----------------------------------------

    const {
      data,
      error,
      count,
    } = await query;

    if (error) {
      console.error(
        "[getSearchedProperties] Supabase error:",
        error
      );

      throw error;
    }

    // -----------------------------------------
    // 13. Transform images
    // -----------------------------------------

    const properties: PropertyResult[] = (
      (data ?? []) as unknown as Property[]
    ).map((property) => ({
      ...property,

      images: (property.property_images ?? [])
        .map((image) => image.storage_path)
        .filter(Boolean),
    }));

    // -----------------------------------------
    // 14. Pagination metadata
    // -----------------------------------------

    const total = count ?? 0;

    const totalPages = Math.ceil(
      total / pageSize
    );

    return {
      success: true,
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      properties,
    };

  } catch (error) {
    console.error(
      "[getSearchedProperties] Error:",
      error
    );

    return {
      success: false,
      total: 0,
      page: pagination.page ?? 1,
      pageSize: pagination.pageSize ?? DEFAULT_PAGE_SIZE,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      properties: [],
      error: "Unable to retrieve properties.",
    };
  }
}
