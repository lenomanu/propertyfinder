import type { MetadataRoute } from "next";

import { collectSitemapUrls } from "@/lib/seo/sitemap-data";
import { absoluteUrl } from "@/lib/seo/urls";
import { buildCalendarYear } from "@/lib/site/build-calendar-year";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await collectSitemapUrls();

  return entries.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified:
      entry.lastModified ?? new Date(buildCalendarYear(), 0, 1),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
