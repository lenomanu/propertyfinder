import { absoluteUrl } from "@/lib/seo/urls";
import { BUSINESS_NAME } from "@/lib/site/business";

export function GET() {
  const origin = absoluteUrl("/").replace(/\/$/, "");
  const card = {
    schema: "https://spec.modelcontextprotocol.io/server-card/v1",
    name: BUSINESS_NAME,
    version: "1.0.0",
    description:
      "Property Team marketplace API for searching Kenya property listings and agencies.",
    homepage: `${origin}/`,
    endpoints: [
      {
        type: "http",
        url: `${origin}/api/mcp`,
        transport: "json",
      },
    ],
    capabilities: {
      tools: [
        {
          name: "search_properties",
          description:
            "Search Property Team for sale or rent listings in Kenya by query string.",
        },
        {
          name: "list_agencies",
          description: "List approved real estate agencies on Property Team.",
        },
      ],
      resources: [
        { name: "sitemap", uri: `${origin}/sitemap.xml` },
        { name: "llms", uri: `${origin}/llms.txt` },
      ],
    },
  };

  return Response.json(card, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}