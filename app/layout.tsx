import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Suspense } from "react";
import NavBarSkeleton from "@/components/nav-bar-skeleton";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Property Finder",
  description: "The Property Finder is a web application that allows users to search for properties and view property details.",
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
        <Suspense fallback={<NavBarSkeleton />}>
          <Navbar />
        </Suspense>
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
