"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getSiteOrigin } from "@/lib/site-url";

export function GoogleAuthOption({ label = "Continue with Google" }: { label?: string }) {
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setNotice(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getSiteOrigin(window.location.origin)}/auth/callback`,
      },
    });

    if (error) {
      setNotice(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="h-12 w-full rounded-lg border-border bg-card hover:bg-muted"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.5 5.5 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.85 0-5.27-1.92-6.13-4.5H2.18v2.84A11 11 0 0 0 12 23Z" />
          <path fill="#FBBC05" d="M5.87 14.13a6.6 6.6 0 0 1 0-4.26V7.03H2.18a11 11 0 0 0 0 9.94l3.69-2.84Z" />
          <path fill="#EA4335" d="M12 4.38c1.62 0 3.06.56 4.2 1.66l3.15-3.15C17.45 1.09 14.97 0 12 0a11 11 0 0 0-9.82 7.03l3.69 2.84c.86-2.58 3.28-5.49 6.13-5.49Z" />
        </svg>
        {isLoading ? "Connecting to Google..." : label}
      </Button>
      {notice ? <p role="status" className="mt-2 text-center text-xs text-muted-foreground">{notice}</p> : null}
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or continue with email
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
