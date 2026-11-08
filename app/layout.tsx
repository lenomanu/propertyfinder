
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
import { getSiteOrigin } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: "Property Team",
  description:
    "Property Team helps you search for properties and view property details across Kenya.",
};

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
      <body className={`${geistSans.className} antialiased`}>
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
            {children}
            <Footer />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
