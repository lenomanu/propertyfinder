import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/error?error=Google%20sign-in%20could%20not%20be%20completed", requestUrl.origin)
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/auth/error?error=Google%20sign-in%20could%20not%20be%20completed", requestUrl.origin)
    );
  }

  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
