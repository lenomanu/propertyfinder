
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";
import "leaflet/dist/leaflet.css";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Suspense } from "react";
import NavBarSkeleton from "@/components/nav-bar-skeleton";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Property Team",
    template: "%s | Property Team",
  },
  description:
    "Find properties for sale and rent, explore neighborhoods, and connect with trusted agents on Property Team.",
  openGraph: {
    type: "website",
    siteName: "Property Team",
    title: "Property Team",
    description:
      "Find your place and connect with trusted property professionals.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Team",
    description:
      "Find your place and connect with trusted property professionals.",
    images: ["/opengraph-image"],
  },
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
