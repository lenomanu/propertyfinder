import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <Link
    href="/"
    aria-label="Property Team home"
    className={cn("inline-flex shrink-0 items-center", className)}
  >
    <Image
      src="/property-team-logo-transparent.png"
      alt=""
      width={190}
      height={42}
      priority
      className="h-9 w-[164px] object-contain sm:h-10 sm:w-[182px]"
    />
  </Link>
);
