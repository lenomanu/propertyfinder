
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

import "./globals.css";
import "leaflet/dist/leaflet.css";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import NavBarSkeleton from "@/components/nav-bar-skeleton";
import { rootLayoutMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = rootLayoutMetadata();

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} flex min-h-dvh flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <Suspense fallback={<NavBarSkeleton />}>
              <Navbar />
            </Suspense>
            <div className="flex-1">{children}</div>
            <Footer />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
