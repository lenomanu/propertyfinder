import { NextResponse } from "next/server";

import { getPublicImageUrl } from "@/lib/cloudflare/public-image-url";
import { getPropertyBySlug } from "@/lib/properties/property";

function primaryStoragePath(property: NonNullable<Awaited<ReturnType<typeof getPropertyBySlug>>>) {
  return (
    property.images.find((image) => image.is_primary)?.storage_path ??
    property.images[0]?.storage_path ??
    null
  );
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const storagePath = primaryStoragePath(property);
  if (!storagePath) {
    return NextResponse.redirect(new URL("/nairobi-skyline.jpg", _request.url), 302);
  }

  let upstreamUrl: string;
  try {
    upstreamUrl = getPublicImageUrl(storagePath);
  } catch {
    return NextResponse.redirect(new URL("/nairobi-skyline.jpg", _request.url), 302);
  }

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      next: { revalidate: 3600 },
    });
  } catch {
    return NextResponse.json({ error: "Image unavailable" }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json({ error: "Image unavailable" }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  const body = await upstream.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}