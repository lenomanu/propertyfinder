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
      },
    );

  /*
   * Search
   *
   * Searches:
   * - property title
   * - locality
   * - nearest town
   * - county
   */
  if (search) {
    const cleanSearch = search.replace(
      /[%_,]/g,
      "",
    );

    query = query.or(
      [
        `title.ilike.%${cleanSearch}%`,
        `locality.ilike.%${cleanSearch}%`,
        `nearest_town.ilike.%${cleanSearch}%`,
        `county.ilike.%${cleanSearch}%`,
      ].join(","),
    );
  }

  /*
   * Always use a deterministic order.
   *
   * This is not a user-facing sort feature.
   */
  query = query.order("created_at", {
    ascending: false,
  });

  /*
   * Pagination
   */
  const currentPage =
    Number.isInteger(page) && page > 0
      ? page
      : 1;

  const from =
    (currentPage - 1) * PAGE_SIZE;

  const to = from + PAGE_SIZE - 1;

  const {
    data,
    count,
    error,
  } = await query.range(from, to);

  if (error) {
    console.log(
      "Failed to fetch properties:",
      error,
    );
  }

  const properties = (data ?? []).map(
    (property) => {
      const row = property as Property & {
        users:
          | {
              full_name: string | null;
            }
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

      // Prefer the image explicitly flagged as primary,
      // otherwise fall back to the lowest display_order.
      const primaryImage =
        images.find((img) => img.is_primary) ??
        [...images].sort(
          (a, b) => a.display_order - b.display_order,
        )[0] ??
        null;

      const { users, property_images, ...rest } = row;

      return {
        ...rest,
        agent_name: users?.full_name ?? null,
        primary_image_path:
          primaryImage?.storage_path ?? null,
      };
    },
  );

  const total = count ?? 0;

  return {
    properties,
    total,
    totalPages: Math.ceil(
      total / PAGE_SIZE,
    ),
    currentPage,
    pageSize: PAGE_SIZE,
  };
}