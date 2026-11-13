import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import HomePropertySearch from "@/components/home-property-search";
import { getPropertyLocalities } from "@/lib/properties/property-search";
import { JsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { buildWebsiteJsonLd } from "@/lib/seo/property-json-ld";

export const metadata: Metadata = pageMetadata({
  title: "Find Property in Kenya | Homes for Sale and Rent",
  description:
    "Search property for sale or rent across Kenya. Find property in Nairobi, Mombasa, Kiambu and more with Property Team.",
  path: "/",
  titleAbsolute: true,
  keywords: [
    "property in Kenya",
    "houses for sale in Kenya",
    "houses for rent in Kenya",
    "apartments in Nairobi",
    "land for sale in Kenya",
  ],
});

export const instant = false;

export default function Home() {
  return (
    <main>
      <JsonLd data={buildWebsiteJsonLd()} />
      <Suspense fallback={<HomeFallback />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}

async function HomeContent() {
  const localities = await getPropertyLocalities();
  const popularLocalities = localities.slice(0, 4);
  return (
    <>
      <section className="px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center justify-center overflow-hidden rounded-[2rem] bg-slate-950 px-5 py-16 text-white sm:min-h-[570px] sm:px-10">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/nairobi-skyline.jpg')" }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-slate-950/45" />
          <div className="relative z-10 w-full max-w-4xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-teal-200">
              Your next move starts here
            </p>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find property across Kenya
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/90 sm:text-lg">
              Search property for sale or rent in Nairobi, Mombasa and
              neighbourhoods across Kenya.
            </p>
            <div className="mx-auto mt-9 max-w-3xl text-left">
              <HomePropertySearch localities={localities} />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto space-y-10 px-4 pb-16 sm:px-6 lg:px-8">
        <LocationRow
          title="Land for sale in popular locations"
          description="Browse land listings in locations with the most approved property listings."
          localities={popularLocalities}
          hrefFor={(locality) => `/properties-for-sale/${encodeURIComponent(locality.toLowerCase().replace(/\s+/g, "-"))}?propertyType=land`}
          eyebrow="Land for sale in"
          action="Explore land"
        />
        <LocationRow
          title="Homes for sale in popular locations"
          description="Explore houses, apartments and villas available to buy."
          localities={popularLocalities}
          hrefFor={(locality) => `/properties-for-sale/${encodeURIComponent(locality.toLowerCase().replace(/\s+/g, "-"))}?propertyType=home`}
          eyebrow="Homes for sale in"
          action="Explore homes"
        />
        <LocationRow
          title="Houses for rent in popular locations"
          description="Find houses to rent in the locations with the most approved listings."
          localities={popularLocalities}
          hrefFor={(locality) => `/properties-for-rent/${encodeURIComponent(locality.toLowerCase().replace(/\s+/g, "-"))}?propertyType=house`}
          eyebrow="Houses for rent in"
          action="Explore houses"
        />
      </section>
    </>
  );
}

function HomeFallback() {
  return (
    <>
      <section className="px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center justify-center overflow-hidden rounded-[2rem] bg-slate-950 px-5 py-16 text-white sm:min-h-[570px] sm:px-10">
          <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/nairobi-skyline.jpg')" }} />
          <div aria-hidden="true" className="absolute inset-0 bg-slate-950/45" />
          <div className="relative z-10 w-full max-w-4xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-teal-200">Your next move starts here</p>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Find property across Kenya</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/90 sm:text-lg">Search property for sale or rent in Nairobi, Mombasa and neighbourhoods across Kenya.</p>
            <div className="mx-auto mt-9 max-w-3xl text-left">
              <HomePropertySearch localities={[]} />
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Popular property locations</h2>
        <div className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 rounded-2xl border bg-card" />)}
        </div>
      </section>
    </>
  );
}

function LocationRow({
  title,
  description,
  localities,
  hrefFor,
  eyebrow,
  action,
}: {
  title: string;
  description: string;
  localities: string[];
  hrefFor: (locality: string) => string;
  eyebrow: string;
  action: string;
}) {
  return (
    <section>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Explore Kenya</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          </div>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-right">
            {description}
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {localities.map((locality) => (
            <Link
              key={locality}
              href={hrefFor(locality)}
              className="group rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
            >
              <span className="text-sm text-muted-foreground">{eyebrow}</span>
              <span className="mt-2 block text-xl font-semibold group-hover:text-primary">{locality}</span>
              <span className="mt-4 inline-block text-sm font-medium text-primary">{action} →</span>
            </Link>
          ))}
        </div>
        {localities.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">Property locations will appear here as listings are added.</p>
        ) : null}
    </section>
  );
}
