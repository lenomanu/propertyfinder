import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  FetchResult,
  Property,
  PropertyResult,
} from "./property.types";

const PAGE_SIZE = 20;

/**
 * Return up to 3 random image storage paths.
 */
function getRandomImages(
  images: { storage_path: string }[] = []
): string[] {
  const shuffled = [...images];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, 3).map((image) => image.storage_path);
}

/**
 * Shared paginated property retrieval.
 */
async function fetchProperties(
  page: number = 1,
  city?: string
): Promise<FetchResult> {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const emptyResult: FetchResult = {
    success: false,
    total: 0,
    page: safePage,
    pageSize: PAGE_SIZE,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: safePage > 1,
    properties: [],
    ...(city ? { city } : {}),
  };

  try {
    console.log("[Properties] Starting retrieval:", {
      page: safePage,
      pageSize: PAGE_SIZE,
      city: city ?? "All cities",
      from,
      to,
    });

    const supabase = await createClient();

    let query = supabase
      .from("properties")
      .select(
        `
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

          property_details (
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
        `,
        { count: "exact" }
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (city?.trim()) {
      query = query.ilike(
        "nearest_town",
        city.trim().replace(/-/g, " ")
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("[Properties] Supabase error:", error);

      return {
        ...emptyResult,
        error: error.message,
      };
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    const batch = (data ?? []) as unknown as Property[];

    const properties: PropertyResult[] = batch.map(
      ({ property_images, ...property }) => ({
        ...property,
        images: getRandomImages(property_images ?? []),
      })
    );

    console.log("[Properties] Retrieval completed:", {
      total,
      page: safePage,
      totalPages,
      retrieved: properties.length,
    });

    return {
      success: true,
      total,
      page: safePage,
      pageSize: PAGE_SIZE,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1 && safePage <= totalPages,
      properties,
      ...(city ? { city } : {}),
    };
  } catch (error) {
    console.error("[Properties] Unexpected error:", error);

    return {
      ...emptyResult,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
}

/**
 * Get all approved properties.
 *
 * Usage: getAllProperties(1)
 */
export async function getAllProperties(
  page: number = 1
): Promise<FetchResult> {
  console.log("[Properties] Fetching all approved properties:", page);

  return fetchProperties(page);
}

/**
 * Get approved properties by nearest town.
 *
 * Usage: getPropertiesByCity("Nairobi", 1)
 */
export async function getPropertiesByCity(
  city: string,
  page: number = 1
): Promise<FetchResult> {
  if (!city?.trim()) {
    return {
      success: false,
      total: 0,
      page: 1,
      pageSize: PAGE_SIZE,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      properties: [],
      error: "City is required",
    };
  }

  console.log("[Properties] Fetching city properties:", {
    city,
    page,
  });

  return fetchProperties(page, city);
}