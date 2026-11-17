import Link from "next/link";

import {
  contactEmail,
  contactEmailHref,
  contactPhone,
  contactPhoneHref,
} from "@/lib/site/business";

export default function SiteContactBar() {
  return (
    <section
      aria-label="Contact Property Team"
      className="border-y bg-muted/40 px-4 py-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          Questions about listings or agencies? Reach Property Team directly.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a href={contactEmailHref()} className="font-medium hover:underline">
            {contactEmail()}
          </a>
          <a href={contactPhoneHref()} className="font-medium hover:underline">
            {contactPhone()}
          </a>
          <Link href="/contact" className="text-primary hover:underline">
            Contact page
          </Link>
        </div>
      </div>
    </section>
  );
}