import { absoluteUrl } from "@/lib/seo/urls";
import { BUSINESS_NAME } from "@/lib/site/business";

/** Minimal MCP-style discovery response for agents (not a full MCP transport). */
export async function GET() {
  return Response.json({
    name: BUSINESS_NAME,
    version: "1.0.0",
    serverCard: absoluteUrl("/.well-known/mcp/server-card.json"),
    tools: [
      {
        name: "search_properties",
        description: "Search listings for sale or rent in Kenya.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            listingType: { type: "string", enum: ["sale", "rent"] },
          },
          required: ["query"],
        },
        href: `${absoluteUrl("/properties-for-sale")}?search={query}`,
      },
      {
        name: "list_agencies",
        description: "List approved agencies.",
        inputSchema: { type: "object", properties: {} },
        href: absoluteUrl("/find-agent"),
      },
    ],
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    tool?: string;
    arguments?: Record<string, unknown>;
  } | null;

  if (body?.tool === "search_properties") {
    const query = String(body.arguments?.query ?? "").trim();
    const listingType =
      body.arguments?.listingType === "rent" ? "rent" : "sale";
    const path =
      listingType === "rent" ? "/properties-for-rent" : "/properties-for-sale";
    const url = query
      ? `${absoluteUrl(path)}?search=${encodeURIComponent(query)}`
      : absoluteUrl(path);
    return Response.json({ ok: true, url });
  }

  if (body?.tool === "list_agencies") {
    return Response.json({ ok: true, url: absoluteUrl("/find-agent") });
  }

  return Response.json({ ok: false, error: "Unknown tool" }, { status: 400 });
}