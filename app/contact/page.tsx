import type { Metadata } from "next";
import Link from "next/link";

import ContactForm from "@/components/contact/contact-form";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  BUSINESS_ADDRESS,
  BUSINESS_NAME,
  contactEmail,
  contactPhoneDisplay,
  contactPhoneHref,
} from "@/lib/site/business";

export const metadata: Metadata = pageMetadata({
  title: "Contact Property Team",
  description:
    "Contact Property Team for property search help, agency onboarding, and marketplace support in Kenya. Call +61450968182 or send a message through our contact form.",
  path: "/contact",
});

const contactTopics = [
  "Finding property for sale or rent across Kenya",
  "Questions about an agency or listing",
  "Agency applications and onboarding",
  "Technical issues with the Property Team website",
];

export default function ContactPage() {
  return (
    <main className="container mx-auto max-w-3xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Contact {BUSINESS_NAME}
        </h1>
        <p className="leading-relaxed text-muted-foreground">
          We help buyers, renters, and agencies use Property Team in Kenya. For
          urgent enquiries, call or email us directly. For everything else, use
          the form below — we aim to reply within one business day.
        </p>
      </header>

      <section aria-labelledby="contact-details-heading">
        <h2 id="contact-details-heading" className="text-lg font-semibold">
          Contact details
        </h2>
        <dl className="mt-4 space-y-4 rounded-2xl border bg-card p-6 text-sm">
          <div>
            <dt className="font-medium">Phone</dt>
            <dd className="mt-1">
              <a
                href={contactPhoneHref()}
                className="text-primary text-base font-medium hover:underline"
              >
                {contactPhoneDisplay()}
              </a>
            </dd>
            <dd className="mt-1 text-muted-foreground">
              International support line — available for calls and WhatsApp where
              applicable.
            </dd>
          </div>
          <div id="email">
            <dt className="font-medium">Email</dt>
            <dd className="mt-1 text-primary text-base font-medium">{contactEmail()}</dd>
            <dd className="mt-1 text-muted-foreground">
              Copy the address into your email app, or send a message with the form below.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Market focus</dt>
            <dd className="mt-1 text-muted-foreground">
              {BUSINESS_ADDRESS.addressLocality}, {BUSINESS_ADDRESS.addressCountry}{" "}
              — property listings and agencies across the country.
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="contact-help-heading">
        <h2 id="contact-help-heading" className="text-lg font-semibold">
          What we can help with
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {contactTopics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border bg-card p-6">
        <ContactForm />
      </section>

      <p className="text-sm text-muted-foreground">
        <Link href="/terms" className="text-primary hover:underline">
          Terms of use
        </Link>
        {" · "}
        <Link href="/about" className="text-primary hover:underline">
          About Property Team
        </Link>
      </p>
    </main>
  );
}