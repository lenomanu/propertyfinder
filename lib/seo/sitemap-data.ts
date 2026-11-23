import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { localityToCitySlug } from "@/lib/seo/urls";

export type SitemapUrl = {
  path: string;
  lastModified?: Date;
  changeFrequency?: "daily" | "weekly" | "monthly";
  priority?: number;
};

const STATIC_ROUTES: SitemapUrl[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/properties-for-sale", changeFrequency: "daily", priority: 0.9 },
  { path: "/properties-for-rent", changeFrequency: "daily", priority: 0.9 },
  { path: "/properties-sold", changeFrequency: "weekly", priority: 0.6 },
  { path: "/find-agent", changeFrequency: "weekly", priority: 0.7 },
  { path: "/sell", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.4 },
];

type SitemapPropertyRow = {
  slug: string;
  locality: string | null;
  property_status: string;
  updated_at: string | null;
};

const SITEMAP_PROPERTY_PAGE_SIZE = 1000;

/** Prefer the SQL function when present; otherwise use the same public read path as property search. */
async function loadSitemapPropertyRows(
  supabase: SupabaseClient
): Promise<SitemapPropertyRow[]> {
  const rpc = await supabase.rpc("get_public_sitemap_properties");

  if (!rpc.error && rpc.data) {
    return rpc.data as SitemapPropertyRow[];
  }

  const rows: SitemapPropertyRow[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("properties")
      .select("slug, locality, status, updated_at")
      .in("status", ["approved", "sold"])
      .not("slug", "is", null)
      .order("updated_at", { ascending: false })
      .range(from, from + SITEMAP_PROPERTY_PAGE_SIZE - 1);

    if (error) {
      console.error(
        "[sitemap] Could not load listing URLs:",
        error.message,
        rpc.error
          ? `(RPC also failed: ${rpc.error.message})`
          : ""
      );
      break;
    }

    const batch = data ?? [];
    for (const row of batch) {
      const slug = row.slug?.trim();
      if (!slug) continue;
      rows.push({
        slug,
        locality: row.locality,
        property_status: row.status,
        updated_at: row.updated_at,
      });
    }

    if (batch.length < SITEMAP_PROPERTY_PAGE_SIZE) break;
    from += SITEMAP_PROPERTY_PAGE_SIZE;
  }

  if (rows.length > 0 && rpc.error) {
    console.warn(
      "[sitemap] get_public_sitemap_properties missing or failed; built URLs from properties select."
    );
  }

  return rows;
}

export async function collectSitemapUrls(): Promise<SitemapUrl[]> {
  const supabase = await createClient();

  const [propertyRows, agenciesResult] = await Promise.all([
    loadSitemapPropertyRows(supabase),
    supabase
      .from("agencies")
      .select("username, updated_at")
      .eq("status", "approved")
      .not("username", "is", null)
      .limit(10000),
  ]);

  const urlByPath = new Map<string, SitemapUrl>();
  for (const route of STATIC_ROUTES) {
    urlByPath.set(route.path, route);
  }

  const rows = propertyRows;

  function addUrl(entry: SitemapUrl) {
    const existing = urlByPath.get(entry.path);
    if (existing?.lastModified && entry.lastModified) {
      if (entry.lastModified > existing.lastModified) {
        urlByPath.set(entry.path, entry);
      }
      return;
    }
    urlByPath.set(entry.path, entry);
  }

  const approvedLocalities = new Set<string>();
  const soldLocalities = new Set<string>();
  const propertyPaths = new Map<string, Date | undefined>();

  for (const row of rows) {
    const slug = row.slug?.trim();
    if (!slug) continue;

    const lastModified = row.updated_at ? new Date(row.updated_at) : undefined;
    propertyPaths.set(`/${encodeURIComponent(slug)}`, lastModified);

    const locality = row.locality?.trim();
    if (!locality) continue;

    if (row.property_status === "sold") {
      soldLocalities.add(locality);
    } else {
      approvedLocalities.add(locality);
    }
  }

  for (const locality of approvedLocalities) {
    const slug = localityToCitySlug(locality);
    addUrl({
      path: `/properties-for-sale/${slug}`,
      changeFrequency: "weekly",
      priority: 0.75,
    });
    addUrl({
      path: `/properties-for-rent/${slug}`,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const locality of soldLocalities) {
    addUrl({
      path: `/properties-sold/${localityToCitySlug(locality)}`,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const [path, lastModified] of propertyPaths) {
    addUrl({
      path,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const row of agenciesResult.data ?? []) {
    const username = row.username?.trim();
    if (!username) continue;
    addUrl({
      path: `/agency/${encodeURIComponent(username)}`,
      lastModified: row.updated_at ? new Date(row.updated_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.65,
    });
  }

  return [...urlByPath.values()];
}
