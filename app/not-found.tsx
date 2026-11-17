import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
export const metadata: Metadata = {
  title: { absolute: "Page not found" },
  description:
    "The page you requested could not be found on Property Team. Return to the homepage to search property for sale and rent across Kenya.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="container mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-6 px-4 py-16 text-center sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground">
        This URL may have moved or no longer exists. Try searching from the
        homepage or browse properties for sale and rent.
      </p>
      <Button asChild>
        <Link href="/">Go to homepage</Link>
      </Button>
    </main>
  );
}