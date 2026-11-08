import { Building2 } from "lucide-react";
import Link from "next/link";

export const Logo = () => (
  <Link
    href="/"
    aria-label="Property Team home"
    className="inline-flex shrink-0 items-center gap-2.5"
  >
    <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
      <Building2 aria-hidden="true" className="size-5" strokeWidth={2.2} />
    </span>
    <span className="text-lg font-bold tracking-tight text-foreground">
      Property <span className="text-primary">Team</span>
    </span>
  </Link>
);
