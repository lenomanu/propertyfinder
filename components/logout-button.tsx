"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signOutAction } from "@/app/auth/sign-out/actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [signedOut, setSignedOut] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function logout() {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setSignedOut(true);

    const supabase = createClient();
    await supabase.auth.signOut();
    await signOutAction();
    router.replace("/auth/logout");
    router.refresh();
    setIsSigningOut(false);
  }

  if (signedOut) {
    return (
      <Button variant="outline" asChild>
        <Link href="/auth/login">Sign in</Link>
      </Button>
    );
  }

  return (
    <Button type="button" onClick={logout} disabled={isSigningOut}>
      Logout
    </Button>
  );
}
