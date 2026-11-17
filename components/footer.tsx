import Link from "next/link";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { title: "Homes for sale", href: "/properties-for-sale" },
  { title: "Homes for rent", href: "/properties-for-rent" },
  { title: "Sold property", href: "/properties-sold" },
  { title: "Find an agent", href: "/find-agent" },
  { title: "List with us", href: "/sell" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
  { title: "Terms", href: "/terms" },
];

const Footer = () => {
  return (
    <footer className="border-t border-primary/20 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-(--breakpoint-xl)">
        <div className="flex flex-col items-start justify-between gap-x-8 gap-y-10 px-6 py-12 sm:flex-row">
          <div>
            <Logo className="rounded-md bg-white px-1 py-0.5" />
            <p className="mt-4 max-w-md text-sm text-primary-foreground/80">
              Property Team helps buyers, renters, and agents discover property
              across Kenya with verified listings and local expertise.
            </p>
            <ul className="mt-6 flex flex-wrap items-center gap-4">
              {footerLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    className="text-primary-foreground/70 hover:text-primary-foreground"
                    href={href}
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Separator />
        <div className="my-4 flex justify-center">
          <span className="text-primary-foreground/70">
            &copy; 2026{" "}
            <Link href="/" className="text-primary-foreground">
              Property Team
            </Link>
            . All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;