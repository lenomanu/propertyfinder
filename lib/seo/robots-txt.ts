import { absoluteUrl } from "@/lib/seo/urls";

export function buildRobotsTxt(): string {
  const sitemap = absoluteUrl("/sitemap.xml");
  const host = absoluteUrl("/").replace(/\/$/, "");

  return `Content-Signal: search=yes, ai-train=no

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /agent/
Disallow: /auth/
Disallow: /protected/
Disallow: /debug/
Disallow: /apply
Disallow: /property/

User-agent: GPTBot
Allow: /
Disallow: /admin/
Disallow: /agent/
Disallow: /auth/
Disallow: /property/

Sitemap: ${sitemap}
Host: ${host}
`;
}