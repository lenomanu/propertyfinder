import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getPropertyLocalities } from "@/lib/properties/property-search";
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

export async function collectSitemapUrls(): Promise<SitemapUrl[]> {
  const supabase = await createClient();

  const [propertiesResult, agenciesResult, approvedLocalities, soldLocalities] =
    await Promise.all([
      supabase
        .from("properties")
        .select("slug, updated_at")
        .in("status", ["approved", "sold"])
        .not("slug", "is", null)
        .limit(50000),
      supabase
        .from("agencies")
        .select("username, updated_at")
        .eq("status", "approved")
        .not("username", "is", null)
        .limit(10000),
      getPropertyLocalities("approved"),
      getPropertyLocalities("sold"),
    ]);

  const urls: SitemapUrl[] = [...STATIC_ROUTES];

  const cityPaths = new Set<string>();
  for (const locality of approvedLocalities) {
    cityPaths.add(`/properties-for-sale/${localityToCitySlug(locality)}`);
    cityPaths.add(`/properties-for-rent/${localityToCitySlug(locality)}`);
  }
  for (const locality of soldLocalities) {
    cityPaths.add(`/properties-sold/${localityToCitySlug(locality)}`);
  }

  for (const path of cityPaths) {
    urls.push({ path, changeFrequency: "weekly", priority: 0.75 });
  }

  for (const row of propertiesResult.data ?? []) {
    const slug = row.slug?.trim();
    if (!slug) continue;
    urls.push({
      path: `/${encodeURIComponent(slug)}`,
      lastModified: row.updated_at ? new Date(row.updated_at) : undefined,
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
