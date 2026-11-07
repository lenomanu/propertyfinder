"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signOutAction } from "@/app/auth/sign-out/actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function NavAuth({ signedIn }: { signedIn: boolean }) {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(signedIn);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const signingOutRef = useRef(false);

  useEffect(() => {
    if (!signingOutRef.current) {
      setIsSignedIn(signedIn);
    }
  }, [signedIn]);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (signingOutRef.current) {
        setIsSignedIn(false);
        return;
      }

      setIsSignedIn(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  async function logout() {
    if (signingOutRef.current) return;

    signingOutRef.current = true;
    setIsSigningOut(true);
    setIsSignedIn(false);

    const supabase = createClient();
    await supabase.auth.signOut();
    await signOutAction();
    router.replace("/auth/logout");
    router.refresh();

    signingOutRef.current = false;
    setIsSigningOut(false);
  }

  if (!isSignedIn) {
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
