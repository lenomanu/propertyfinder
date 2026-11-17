import { markdownPageKey } from "@/lib/agent/markdown-pages";
import { updateSession } from "@/lib/supabase/proxy";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto");
  if (
    proto === "http" &&
    !host.startsWith("localhost") &&
    !host.startsWith("127.0.0.1")
  ) {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl, 308);
  }

  const accept = request.headers.get("accept") ?? "";
  const pathname = request.nextUrl.pathname;
  if (accept.toLowerCase().includes("text/markdown")) {
    const pageKey = markdownPageKey(pathname);
    if (pageKey) {
      const url = request.nextUrl.clone();
      url.pathname = `/api/agent-markdown/${pageKey}`;
      return NextResponse.rewrite(url);
    }
  }

  // Supabase can fall back to its Site URL when redirectTo is not allowlisted.
  // If that URL is the app root, send the PKCE code through the session exchange
  // route before rendering the homepage.
  if (
    pathname === "/" &&
    request.nextUrl.searchParams.has("code")
  ) {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = "/auth/callback";
    return NextResponse.redirect(callbackUrl);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};