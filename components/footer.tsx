import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  BUSINESS_ADDRESS,
  BUSINESS_NAME,
  contactEmail,
  contactEmailHref,
  contactPhoneDisplay,
  contactPhoneHref,
} from "@/lib/site/business";

const exploreLinks = [
  { title: "Homes for sale", href: "/properties-for-sale" },
  { title: "Homes for rent", href: "/properties-for-rent" },
  { title: "Sold property", href: "/properties-sold" },
  { title: "Find an agent", href: "/find-agent" },
];

const companyLinks = [
  { title: "About us", href: "/about" },
  { title: "List with us", href: "/sell" },
  { title: "Contact", href: "/contact" },
  { title: "Terms of use", href: "/terms" },
];

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { title: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground">
        {title}
      </h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="border-t border-primary/20 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo className="rounded-md bg-white px-1 py-0.5" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/80">
              {BUSINESS_NAME} connects buyers and renters with approved agencies
              listing property across Kenya.
            </p>
            <p className="mt-3 flex items-start gap-2 text-sm text-primary-foreground/80">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-primary-foreground/90"
                aria-hidden
              />
              {BUSINESS_ADDRESS.addressLocality}, {BUSINESS_ADDRESS.addressCountry}
            </p>
          </div>

          <div className="grid gap-10 sm:col-span-2 sm:grid-cols-2 lg:col-span-4">
            <FooterLinkGroup title="Explore" links={exploreLinks} />
            <FooterLinkGroup title="Company" links={companyLinks} />
          </div>

          <div className="lg:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground">
              Support
            </h2>
            <p className="mt-4 text-sm text-primary-foreground/80">
              Questions about a listing or agency? We&apos;re here to help.
            </p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={contactEmailHref()}
                  className="group flex items-center gap-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Mail className="size-4 shrink-0 opacity-80" aria-hidden />
                  <span className="min-w-0 break-all group-hover:underline">
                    {contactEmail()}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={contactPhoneHref()}
                  className="group flex items-center gap-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Phone className="size-4 shrink-0 opacity-80" aria-hidden />
                  <span className="group-hover:underline">{contactPhoneDisplay()}</span>
                </a>
              </li>
            </ul>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Link href="/contact">Send a message</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/15 pt-8 text-sm text-primary-foreground/70 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <Link
              href="/"
              className="font-medium text-primary-foreground hover:underline"
            >
              {BUSINESS_NAME}
            </Link>
            . All rights reserved.
          </p>
          <p className="text-xs">Property listings by approved agencies in Kenya.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;