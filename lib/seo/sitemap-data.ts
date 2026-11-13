import "server-only";

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
];

type SitemapPropertyRow = {
  slug: string;
  locality: string | null;
  property_status: string;
  updated_at: string | null;
};

export async function collectSitemapUrls(): Promise<SitemapUrl[]> {
  const supabase = await createClient();

  const [propertiesResult, agenciesResult] = await Promise.all([
    supabase.rpc("get_public_sitemap_properties"),
    supabase
      .from("agencies")
      .select("username, updated_at")
      .eq("status", "approved")
      .not("username", "is", null)
      .limit(10000),
  ]);

  if (propertiesResult.error) {
    console.error(
      "[sitemap] get_public_sitemap_properties failed:",
      propertiesResult.error.message,
      "— apply supabase/migrations/20261113100000_public_sitemap_properties.sql in the Supabase SQL editor."
    );
  }

  const urls: SitemapUrl[] = [...STATIC_ROUTES];
  const rows = (propertiesResult.data ?? []) as SitemapPropertyRow[];

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
    urls.push({
      path: `/properties-for-sale/${slug}`,
      changeFrequency: "weekly",
      priority: 0.75,
    });
    urls.push({
      path: `/properties-for-rent/${slug}`,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const locality of soldLocalities) {
    urls.push({
      path: `/properties-sold/${localityToCitySlug(locality)}`,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const [path, lastModified] of propertyPaths) {
    urls.push({
      path,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const row of agenciesResult.data ?? []) {
    const username = row.username?.trim();
    if (!username) continue;
    urls.push({
      path: `/agency/${encodeURIComponent(username)}`,
      lastModified: row.updated_at ? new Date(row.updated_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.65,
    });
  }

  return urls;
}
