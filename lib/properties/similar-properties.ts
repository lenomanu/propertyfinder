import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Property, PropertyResult } from "@/lib/properties/property.types";

const SIMILAR_LIMIT = 20;

const SELECT = `
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
  ),
  agencies (
    agency_name
  ),
  users:user_id (
    full_name
  )
`;

export type SimilarPropertySource = {
  id: string;
  property_type: string;
  listing_type: string;
  locality: string | null;
  nearest_town: string | null;
  county: string | null;
  price: number;
};

type PropertyRow = Property & {
  agencies:
    | { agency_name: string | null }
    | { agency_name: string | null }[]
    | null;
  users:
    | { full_name: string | null }
    | { full_name: string | null }[]
    | null;
};

function samePlace(left: string | null | undefined, right: string | null | undefined) {
  const a = left?.trim().toLowerCase();
  const b = right?.trim().toLowerCase();
  return Boolean(a && b && a === b);
}

function isLandType(propertyType: string) {
  return propertyType === "land" || propertyType === "plot";
}

function relatedTypes(propertyType: string) {
  return isLandType(propertyType) ? ["land", "plot"] : [propertyType];
}

function score(source: SimilarPropertySource, candidate: PropertyResult) {
  let value = 0;

  if (candidate.property_type === source.property_type) value += 8;
  else if (isLandType(candidate.property_type) && isLandType(source.property_type)) {
    value += 4;
  }

  if (samePlace(candidate.locality, source.locality)) value += 6;
  if (samePlace(candidate.nearest_town, source.nearest_town)) value += 4;
  if (samePlace(candidate.county, source.county)) value += 2;

  const sourcePrice = Number(source.price);
  const candidatePrice = Number(candidate.price);
  if (sourcePrice > 0 && candidatePrice > 0) {
    const ratio = Math.abs(candidatePrice - sourcePrice) / sourcePrice;
    value += Math.max(0, 3 - ratio);
  }

  return value;
}

function toResult(property: PropertyRow): PropertyResult {
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
}

async function loadCandidates(
  source: SimilarPropertySource,
  propertyTypes: string[] | null,
  excludeIds: string[]
) {
  const supabase = await createClient();
  let query = supabase
    .from("properties")
    .select(SELECT)
    .eq("status", "approved")
    .eq("listing_type", source.listing_type)
    .neq("id", source.id)
    .order("created_at", { ascending: false })
    .limit(60);

  if (propertyTypes) {
    query = query.in("property_type", propertyTypes);
  }

  if (excludeIds.length > 0) {
    query = query.not("id", "in", `(${excludeIds.join(",")})`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getSimilarProperties] Supabase error:", error);
    return [];
  }

  return ((data ?? []) as unknown as PropertyRow[]).map(toResult);
}

export async function getSimilarProperties(
  source: SimilarPropertySource
): Promise<PropertyResult[]> {
  const primary = await loadCandidates(source, relatedTypes(source.property_type), []);
  const seen = new Set(primary.map((property) => property.id));
  const extra =
    primary.length >= SIMILAR_LIMIT
      ? []
      : await loadCandidates(source, null, [...seen]);

  return [...primary, ...extra]
    .sort((left, right) => {
      const byScore = score(source, right) - score(source, left);
      if (byScore !== 0) return byScore;
      return right.created_at.localeCompare(left.created_at);
    })
    .slice(0, SIMILAR_LIMIT);
}
