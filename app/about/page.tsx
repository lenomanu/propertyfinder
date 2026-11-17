import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "@/lib/seo/metadata";
import { BUSINESS_NAME } from "@/lib/site/business";

export const metadata: Metadata = pageMetadata({
  title: "About Property Team",
  description:
    "Learn how Property Team helps buyers, renters, and agencies discover property across Kenya through verified listings, local search, and agency profiles.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-3xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">About {BUSINESS_NAME}</h1>
      <p className="leading-relaxed text-muted-foreground">
        {BUSINESS_NAME} is a Kenya property marketplace. Approved real estate agencies
        publish homes, apartments, land, and commercial listings; visitors search by
        town, price, property type, and features.
      </p>
      <p className="leading-relaxed text-muted-foreground">
        Our goal is to make property discovery transparent for buyers and renters while
        giving agencies a professional channel to showcase inventory and capture
        enquiries.
      </p>
      <Link href="/contact" className="text-primary font-medium hover:underline">
        Contact us
      </Link>
    </main>
  );
}