
import "server-only";

import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

import type {
  Property,
  PropertyResult,
  FetchResult,
  PropertyPagination,
} from "@/lib/properties/property.types";

import type { PropertySearchFilters } from "@/lib/properties/property-search-params";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const SQM_PER_ACRE = 4046.8564224;
const HECTARES_PER_ACRE = 0.40468564224;

function isLandPropertyType(propertyType: string) {
  return propertyType === "land" || propertyType === "plot";
}

function formatFilterNumber(value: number) {
  return String(Number(value.toFixed(6)));
}

function landSizeFilter(acres: number) {
  const units = [
    { unit: "acre", factor: 1 },
    { unit: "sqm", factor: SQM_PER_ACRE },
    { unit: "hectare", factor: HECTARES_PER_ACRE },
  ];

  return units
    .map(({ unit, factor }) => {
      const min = formatFilterNumber(acres * factor);

      if (acres >= 5) {
        return `and(land_size.gte.${min},land_size_unit.eq.${unit})`;
      }

      if (acres >= 1) {
        const max = formatFilterNumber((acres + 1) * factor);
        return `and(land_size.gte.${min},land_size.lt.${max},land_size_unit.eq.${unit})`;
      }

      return `and(land_size.eq.${min},land_size_unit.eq.${unit})`;
    })
    .join(",");
}

type SearchFilters = Omit<
  PropertySearchFilters,
  "page" | "pageSize"
>;

export async function getSearchedProperties(
  filters: SearchFilters,
  pagination: PropertyPagination = {},
  options: {
    status?: "approved" | "sold";
    agencyId?: string;
    agencyUserId?: string;
  } = {}
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

    const landType = isLandPropertyType(filters.propertyType);

    const needsPropertyDetails =
      !landType &&
      (filters.bedrooms !== null || filters.bathrooms !== null);

    const propertyDetailsJoin = needsPropertyDetails
      ? "property_details!inner"
      : "property_details";

    const landSizeAcres =
      filters.minLandSize !== null && landType
        ? Number(filters.minLandSize)
        : null;

    const landDetailsJoin =
      landSizeAcres !== null ? "land_details!inner" : "land_details";

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

      ${landDetailsJoin} (
        id,
        land_size,
        land_size_unit,
        land_use
      ),

      property_images (
        storage_path
      ),

      agencies (
        agency_name
      ),

      users:user_id (
        full_name
      )
    `;

    // -----------------------------------------
    // 4. Base query
    // -----------------------------------------

    let query = supabase
      .from("properties")
      .select(selectQuery, {
        count: "exact",
      })
      .eq("status", options.status ?? "approved");

    // -----------------------------------------
    // 5. Search
    // -----------------------------------------

    const searchTerm = filters.search
      ?.trim()
      .replace(/[,%()]/g, " ");

    const searchConditions = searchTerm
      ? [
          `title.ilike.%${searchTerm}%`,
          `locality.ilike.%${searchTerm}%`,
          `nearest_town.ilike.%${searchTerm}%`,
          `county.ilike.%${searchTerm}%`,
        ]
      : [];

    const ownershipConditions = [
      options.agencyId ? `agency_id.eq.${options.agencyId}` : null,
      options.agencyUserId ? `user_id.eq.${options.agencyUserId}` : null,
    ].filter((condition): condition is string => Boolean(condition));

    if (ownershipConditions.length > 0) {
      const scopedConditions = ownershipConditions.map((ownership) =>
        searchConditions.length > 0
          ? `and(${ownership},or(${searchConditions.join(",")}))`
          : ownership
      );

      query = query.or(scopedConditions.join(","));
    } else if (searchConditions.length > 0) {
      query = query.or(searchConditions.join(","));
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
      query = filters.propertyType === "home"
        ? query.in("property_type", ["house", "apartment", "villa"])
        : query.eq("property_type", filters.propertyType);
    }

    const locality = filters.locality?.trim();

    if (locality) {
      query = query.ilike("locality", locality);
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

    if (!landType && filters.bedrooms !== null) {
      query = query.gte(
        "property_details.bedrooms",
        filters.bedrooms
      );
    }

    if (!landType && filters.bathrooms !== null) {
      query = query.gte(
        "property_details.bathrooms",
        filters.bathrooms
      );
    }

    // -----------------------------------------
    // 9b. Land size (plot and land only)
    // -----------------------------------------

    if (landSizeAcres !== null) {
      query = query.or(landSizeFilter(landSizeAcres), {
        referencedTable: "land_details",
      });
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
      (data ?? []) as unknown as (Property & {
        agencies:
          | { agency_name: string | null }
          | { agency_name: string | null }[]
          | null;
        users:
          | { full_name: string | null }
          | { full_name: string | null }[]
          | null;
      })[]
    ).map((property) => {
      const { agencies, users, property_images, ...rest } = property;

      const agency = Array.isArray(agencies) ? agencies[0] : agencies;
      const agent = Array.isArray(users) ? users[0] : users;

      return {
        ...rest,
        images: (property_images ?? [])
          .map((image) => image.storage_path)
          .filter(Boolean),
        broker_name: agency?.agency_name ?? agent?.full_name ?? null,
      };
    });

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

export async function getPropertyLocalities(
  status: "approved" | "sold" = "approved",
  scope: { agencyId?: string; agencyUserId?: string } = {}
): Promise<string[]> {
  await connection();

  try {
    const supabase = await createClient();

    let query = supabase
      .from("properties")
      .select("locality")
      .eq("status", status)
      .limit(1000);

    const ownershipConditions = [
      scope.agencyId ? `agency_id.eq.${scope.agencyId}` : null,
      scope.agencyUserId ? `user_id.eq.${scope.agencyUserId}` : null,
    ].filter((condition): condition is string => Boolean(condition));

    if (ownershipConditions.length > 0) {
      query = query.or(ownershipConditions.join(","));
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getPropertyLocalities] Supabase error:", error);
      return [];
    }

    const counts = new Map<string, number>();

    for (const row of data ?? []) {
      const name = row.locality?.trim();
      if (!name) continue;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }

    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([name]) => name);
  } catch (error) {
    console.error("[getPropertyLocalities] Error:", error);
    return [];
  }
}
