import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { title: "Buy", href: "/properties-for-sale" },
  { title: "Rent", href: "/properties-for-rent" },
  { title: "Agent portal", href: "/agent" },
];

const Footer = () => (
  <footer className="border-t">
    <div className="mx-auto max-w-(--breakpoint-xl)">
      <div className="flex flex-col items-start justify-between gap-x-8 gap-y-10 px-6 py-12 sm:flex-row">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Find your place with Property Team.
          </p>
          <ul className="mt-6 flex flex-wrap items-center gap-4">
            {footerLinks.map(({ title, href }) => (
              <li key={title}>
                <Link
                  className="text-sm text-muted-foreground hover:text-foreground"
                  href={href}
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full max-w-xs">
          <h6 className="font-medium">Stay up to date</h6>
          <form className="mt-6 flex items-center gap-2">
            <Input placeholder="Enter your email" type="email" />
            <Button>Subscribe</Button>
          </form>
        </div>
      </div>
      <Separator />
      <div className="my-4 flex justify-center">
        <span className="text-sm text-muted-foreground">
          &copy; 2026 Property Team. All rights reserved.
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
