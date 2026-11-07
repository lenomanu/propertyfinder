import type { Metadata } from "next";
import Link from "next/link";

import { HouseIllustration } from "@/components/auth/house-illustration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Signed out | Property Finder",
  robots: { index: false, follow: false },
};

export default function LogoutPage() {
  return (
    <main className="flex min-h-[calc(100svh-68px)] items-center justify-center px-4 py-10 sm:px-6">
      <Card className="w-full max-w-md rounded-2xl border-border/80 bg-card p-4 shadow-sm sm:p-5">
        <HouseIllustration />
        <CardHeader className="px-1 pb-4 pt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">See you next time</p>
          <CardTitle className="pt-1 text-2xl tracking-tight">You’re signed out</CardTitle>
          <CardDescription className="text-[15px] leading-relaxed">
            You have safely signed out of your Property Finder account.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-1 pb-2">
          <Button asChild className="h-12 w-full rounded-lg">
            <Link href="/auth/login">Log in again</Link>
          </Button>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Looking for property? <Link href="/" className="font-medium text-primary hover:underline">Return to home</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
