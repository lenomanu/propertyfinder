import Link from "next/link";
import { House } from "lucide-react";
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <Link href="/" aria-label="Property Finder home" className={cn("inline-flex shrink-0 items-center gap-2.5 text-foreground", className)}>
    <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      <House aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
    </span>
    <span className="text-[15px] font-semibold tracking-tight">Property Finder</span>
  </Link>
);
