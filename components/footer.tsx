import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  {
    title: "Overview",
    href: "#",
  },
  {
    title: "Features",
    href: "#",
  },
  {
    title: "Pricing",
    href: "#",
  },
  {
    title: "Agent admin",
    href: "/agent",
  },
  {
    title: "Help 2 Support",
    href: "#",
  },
  {
    title: "Privacy",
    href: "#",
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-primary/20 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-(--breakpoint-xl)">
        <div className="flex flex-col items-start justify-between gap-x-8 gap-y-10 px-6 py-12 sm:flex-row">
          <div>
            <Logo className="text-primary-foreground" />

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

          {/* Subscribe Newsletter */}
          <div className="w-full max-w-xs">
          <h6 className="font-medium">Stay up to date</h6>
            <form className="mt-6 flex items-center gap-2">
              <Input placeholder="Enter your email" type="email" />
              <Button variant="secondary" className="shrink-0">Subscribe</Button>
            </form>
          </div>
        </div>
        <Separator />
        <div className="flex justify-center my-4">
          {/* Copyright */}
          <span className="text-primary-foreground/70">
            &copy; 2026{" "}
            <Link href="/" className="text-primary-foreground">
              Property Finder
            </Link>
            . All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
