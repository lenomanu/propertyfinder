
import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  PaginatedProperties,
  Property,
} from "@/app/(agent)/agent/properties/property";

const PAGE_SIZE = 25;

type GetPropertiesParams = {
  search?: string;
  page?: number;
};

export async function getProperties({
  search = "",
  page = 1,
}: GetPropertiesParams): Promise<PaginatedProperties> {
  const supabase = await createClient();

  const emptyResult = (
    currentPage = 1
  ): PaginatedProperties => ({
    properties: [],
    total: 0,
    totalPages: 0,
    currentPage,
    pageSize: PAGE_SIZE,
  });

  // 1. Verify the authenticated user.
  const {
    data: claimsData,
    error: claimsError,
  } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (claimsError || typeof userId !== "string") {
    console.error(
      "Failed to verify authenticated user:",
      claimsError
    );

    return emptyResult();
  }

  // 2. Retrieve the user's agency ID.
  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("users")
    .select("agency_id")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    console.error("Failed to fetch user profile:", {
      userId,
      error: profileError,
    });

    return emptyResult();
  }

  const agencyId = profile?.agency_id ?? null;

  console.log("Property access context:", {
    userId,
    agencyId,
  });

  // 3. Build the properties query.
  let query = supabase
    .from("properties")
    .select(
      `
        *,
        users:user_id (
          full_name
        ),
        property_images (
          storage_path,
          is_primary,
          display_order
        )
      `,
      {
        count: "exact",
      }
    );

  // 4. Include properties owned by this user OR assigned
  // to their agency. User-owned listings with NULL
  // agency_id will still be included.
  if (agencyId) {
    query = query.or(
      `user_id.eq.${userId},agency_id.eq.${agencyId}`
    );
  } else {
    query = query.eq("user_id", userId);
  }

  // 5. Search by title and location.
  const cleanSearch = search
    .trim()
    .replace(/[%_,]/g, "");

  if (cleanSearch) {
    query = query.or(
      [
        `title.ilike.%${cleanSearch}%`,
        `locality.ilike.%${cleanSearch}%`,
        `nearest_town.ilike.%${cleanSearch}%`,
        `county.ilike.%${cleanSearch}%`,
      ].join(",")
    );
  }

  // 6. Stable ordering.
  query = query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  // 7. Pagination.
  const currentPage =
    Number.isInteger(page) && page > 0 ? page : 1;

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const {
    data,
    count,
    error,
  } = await query.range(from, to);

  if (error) {
    console.error("Failed to fetch properties:", {
      userId,
      agencyId,
      search,
      currentPage,
      error,
    });

    return emptyResult(currentPage);
  }

  // 8. Format properties and select primary images.
  const properties = (data ?? []).map((property) => {
    const row = property as Property & {
      users:
        | { full_name: string | null }
        | null;
      property_images:
        | {
            storage_path: string;
            is_primary: boolean;
            display_order: number;
          }[]
        | null;
    };

    const images = row.property_images ?? [];

    const primaryImage =
      images.find((image) => image.is_primary) ??
      [...images].sort(
        (a, b) => a.display_order - b.display_order
      )[0] ??
      null;

    const {
      users,
      property_images,
      ...rest
    } = row;

    return {
      ...rest,
      agent_name: users?.full_name ?? null,
      primary_image_path:
        primaryImage?.storage_path ?? null,
    };
  });

  const total = count ?? 0;

  console.log("Properties fetched successfully:", {
    userId,
    agencyId,
    returned: properties.length,
    total,
    currentPage,
  });

  // 9. Return paginated results.
  return {
    properties,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    currentPage,
    pageSize: PAGE_SIZE,
  };
}
