import { renderMarkdownPage } from "@/lib/agent/markdown-pages";

type Params = { params: Promise<{ page: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { page } = await params;
  const body = renderMarkdownPage(page);
  if (!body) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}