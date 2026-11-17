import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "@/lib/seo/metadata";
import {
  BUSINESS_ADDRESS,
  BUSINESS_NAME,
  contactEmail,
  contactEmailHref,
  contactPhone,
  contactPhoneHref,
} from "@/lib/site/business";

export const metadata: Metadata = pageMetadata({
  title: "Contact Property Team",
  description:
    "Contact Property Team for help with property search, agency listings, and marketplace support in Kenya. Email or phone our team during business hours.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="container mx-auto max-w-3xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Contact {BUSINESS_NAME}</h1>
      <p className="text-muted-foreground">
        Reach us about listings, agencies, or technical support.
      </p>
      <dl className="space-y-4 rounded-2xl border bg-card p-6 text-sm">
        <div>
          <dt className="font-medium">Email</dt>
          <dd className="mt-1">
            <a href={contactEmailHref()} className="text-primary hover:underline">
              {contactEmail()}
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-medium">Phone</dt>
          <dd className="mt-1">
            <a href={contactPhoneHref()} className="text-primary hover:underline">
              {contactPhone()}
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-medium">Office</dt>
          <dd className="mt-1 text-muted-foreground">
            {BUSINESS_ADDRESS.addressLocality}, {BUSINESS_ADDRESS.addressCountry}
          </dd>
        </div>
      </dl>
      <Link href="/terms" className="text-primary hover:underline">
        Terms of use
      </Link>
    </main>
  );
}