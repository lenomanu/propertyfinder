import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "@/lib/seo/metadata";
import { BUSINESS_NAME, contactEmail } from "@/lib/site/business";

export const metadata: Metadata = pageMetadata({
  title: "Terms of use",
  description:
    "Terms of use for the Property Team marketplace in Kenya, including listing accuracy, agency responsibilities, and limitations of liability.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-3xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of use</h1>
      <p className="text-sm text-muted-foreground">Last updated: November 2026</p>
      <section className="space-y-4 text-muted-foreground leading-relaxed">
        <p>
          {BUSINESS_NAME} hosts property listings submitted by approved agencies. We do
          not guarantee availability, pricing, condition, or legal title of any property.
        </p>
        <p>
          Visitors should verify details directly with the listing agency before
          payments or contracts. Agencies are responsible for accurate listing content
          and lawful marketing.
        </p>
        <p>
          Questions: {contactEmail()}. See also our{" "}
          <Link href="/about" className="text-primary hover:underline">
            about page
          </Link>
          .
        </p>
      </section>
    </main>
  );
}