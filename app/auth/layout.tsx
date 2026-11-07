import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div data-auth-shell>
      <header className="border-b border-border/80 bg-card">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <Link href="/" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
            Back to home
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
