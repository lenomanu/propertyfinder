"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function GoogleAuthButton() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function signInWithGoogle() {
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Unable to sign in with Google."
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={signInWithGoogle}
        disabled={isLoading}
      >
        <GoogleMark />
        {isLoading ? "Redirecting to Google…" : "Continue with Google"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15Z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.7-5.1c-1.8 1.2-4 1.9-6.8 1.9-5.2 0-9.7-3.5-11.3-8.2H5.8v5.2A20 20 0 0 0 24 44Z"
      />
      <path
        fill="#FBBC05"
        d="M12.7 27.8a12 12 0 0 1 0-7.6V15H5.8a20 20 0 0 0 0 17.9l6.9-5.1Z"
      />
      <path
        fill="#EA4335"
        d="M24 12c3 0 5.7 1 7.8 3l5.9-5.9A19.7 19.7 0 0 0 24 4 20 20 0 0 0 5.8 15l6.9 5.2C14.3 15.5 18.8 12 24 12Z"
      />
    </svg>
  );
}
