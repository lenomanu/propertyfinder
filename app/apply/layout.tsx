import type { Metadata } from "next";
import type { ReactNode } from "react";

import { noIndexRobots } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  robots: noIndexRobots,
  title: "Agency application",
};

export default function ApplyLayout({ children }: { children: ReactNode }) {
  return children;
}