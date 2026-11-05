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
        broker_name: null,
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

export type PropertyImageRecord = {
  storage_path: string;
  is_primary: boolean | null;
  display_order: number | null;
};

export type PropertyAmenity = {
  name: string;
  description: string | null;
  icon: string | null;
  placement: "internal" | "external" | null;
};

export type ListingContact = {
  name: string;
  username: string | null;
  imageUrl: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  links: { label: string; href: string }[];
};

export type PropertyDetail = Property & {
  images: PropertyImageRecord[];
  broker_name: string | null;
  listing_contact: ListingContact | null;
};

type AgencyContactRow = {
  username: string | null;
  agency_name: string | null;
  profile_image_url: string | null;
  email: string | null;
  phone: string | null;
  town: string | null;
  location: string | null;
  instagram: string | null;
  tiktok: string | null;
  facebook: string | null;
};

function externalHref(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^@/, "")}`;
}

function listingContact(
  agency: AgencyContactRow | null,
  agentName: string | null
): ListingContact | null {
  const name = agency?.agency_name?.trim() || agentName?.trim() || "";
  if (!name) return null;

  const location =
    [agency?.location, agency?.town].filter(Boolean).join(", ") || null;

  const links = [
    ["Instagram", agency?.instagram],
    ["TikTok", agency?.tiktok],
    ["Facebook", agency?.facebook],
  ].flatMap(([label, value]) => {
    const href = value ? externalHref(value) : null;
    return href && label ? [{ label, href }] : [];
  });

  return {
    name,
    username: agency?.username?.trim() || null,
    imageUrl: agency?.profile_image_url?.trim() || null,
    phone: agency?.phone?.trim() || null,
    email: agency?.email?.trim() || null,
    location,
    links,
  };
}

function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export async function getPropertyBySlug(
  slug: string
): Promise<PropertyDetail | null> {
  const cleanSlug = slug.trim();
  if (!cleanSlug) return null;

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
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
            storage_path,
            is_primary,
            display_order
          ),

          agencies (
            username,
            agency_name,
            profile_image_url,
            email,
            phone,
            town,
            location,
            instagram,
            tiktok,
            facebook
          ),

          users:user_id (
            full_name
          )
        `
      )
      .eq("slug", cleanSlug)
      .in("status", ["approved", "sold"])
      .maybeSingle();

    if (error) {
      console.error("[getPropertyBySlug] Supabase error:", error);
      return null;
    }

    if (!data) return null;

    const row = data as unknown as Property & {
      property_images: PropertyImageRecord[] | null;
      agencies: AgencyContactRow | AgencyContactRow[] | null;
      users:
        | { full_name: string | null }
        | { full_name: string | null }[]
        | null;
    };

    const { property_images, agencies, users, ...property } = row;
    const agency = one(agencies);
    const agent = one(users);

    const images = [...(property_images ?? [])].sort((left, right) => {
      if (Boolean(left.is_primary) !== Boolean(right.is_primary)) {
        return left.is_primary ? -1 : 1;
      }

      return (left.display_order ?? 0) - (right.display_order ?? 0);
    });

    return {
      ...property,
      property_details: one(property.property_details),
      land_details: one(property.land_details),
      property_images: images,
      images,
      broker_name: agency?.agency_name ?? agent?.full_name ?? null,
      listing_contact: listingContact(agency, agent?.full_name ?? null),
    };
  } catch (error) {
    console.error("[getPropertyBySlug] Unexpected error:", error);
    return null;
  }
}

export async function getPropertyAmenities(
  propertyId: string
): Promise<PropertyAmenity[]> {
  if (!propertyId) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("property_amenities")
      .select("amenities(name, description, icon, placement)")
      .eq("property_id", propertyId);

    if (error) {
      console.error("[getPropertyAmenities] Supabase error:", error);
      return [];
    }

    const amenities = (data ?? []).flatMap((row) => {
      const amenity = one(
        (
          row as {
            amenities: PropertyAmenity | PropertyAmenity[] | null;
          }
        ).amenities
      );

      return amenity?.name ? [amenity] : [];
    });

    return amenities.sort((left, right) => left.name.localeCompare(right.name));
  } catch (error) {
    console.error("[getPropertyAmenities] Unexpected error:", error);
    return [];
  }
}
