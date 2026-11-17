import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Sell or list property in Kenya",
  description:
    "List residential, commercial, or land property in Kenya with Property Team. Partner with approved agencies, reach serious buyers, and manage listings with professional tools.",
  path: "/sell",
});

export default function SellPage() {
  return (
    <main className="container mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Sell or list property in Kenya
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Property Team connects property owners and agencies with buyers and
          renters across Kenya. Whether you are marketing a home, apartment,
          plot, or commercial space, our approved agents can publish listings,
          manage enquiries, and showcase your property to a national audience.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-lg font-semibold">How listing works</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Work with an approved agency on Property Team.</li>
          <li>
            Your agent publishes photos, pricing, and location details on your
            behalf.
          </li>
          <li>
            Buyers and renters discover listings through search, city pages, and
            agency profiles.
          </li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/find-agent">Find an agency</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/auth/sign-up">Create an account</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/properties-for-sale">Browse listings</Link>
        </Button>
      </div>
    </main>
  );
}