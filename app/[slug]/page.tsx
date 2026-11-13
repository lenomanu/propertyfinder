import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  CarFront,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import PropertyAmenities from "@/components/properties/PropertyAmenities";
import PropertyAmenitiesSkeleton from "@/components/properties/PropertyAmenitiesSkeleton";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyShareButton from "@/components/properties/PropertyShareButton";
import SimilarProperties from "@/components/properties/SimilarProperties";
import SimilarPropertiesSkeleton from "@/components/properties/SimilarPropertiesSkeleton";
import { getPublicImageUrl } from "@/lib/cloudflare/public-image-url";
import { getURL } from "@/lib/site-url";
import {
  getPropertyBySlug,
  type ListingContact,
} from "@/lib/properties/property";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildPropertyJsonLd } from "@/lib/seo/property-json-ld";
import {
  primaryPropertyImageUrl,
  propertyPageMetadata,
} from "@/lib/seo/property-page-metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) {
    return { title: "Property not found" };
  }
  return propertyPageMetadata(property, slug);
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house: "House",
  apartment: "Apartment",
  condo: "Condo",
  "multi-family": "Multi-family home",
  land: "Land",
  plot: "Plot",
  villa: "Villa",
  office: "Office",
  warehouse: "Warehouse",
  commercial: "Commercial",
};

function imageUrl(path: string) {
  try {
    return getPublicImageUrl(path);
  } catch {
    return null;
  }
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-KE", { maximumFractionDigits: 2 }).format(
    value
  );
}

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

function labelFor(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function PropertyDetailsPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main className="container mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="aspect-[4/3] animate-pulse rounded-xl bg-muted" />
          <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        </main>
      }
    >
      <PropertyDetails params={params} />
    </Suspense>
  );
}

async function PropertyDetails({ params }: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) notFound();

  const isSold = property.status === "sold";
  const isLand =
    property.property_type === "land" || property.property_type === "plot";
  const details = property.property_details;
  const land = property.land_details;
  const landSize = isLand ? land?.land_size : details?.land_size;
  const landSizeUnit = isLand ? land?.land_size_unit : details?.land_size_unit;
  const typeLabel = PROPERTY_TYPE_LABELS[property.property_type] ?? "Property";
  const listingLabel = isSold
    ? "Sold"
    : `${typeLabel} for ${property.listing_type === "sale" ? "sale" : "rent"}`;

  const images = property.images
    .map((image) => imageUrl(image.storage_path))
    .filter((url): url is string => Boolean(url));

  const facts = [
    !isLand && details?.bedrooms != null
      ? {
          label: "Bedrooms",
          value: details.bedrooms === 0 ? "Studio" : String(details.bedrooms),
        }
      : null,
    !isLand && details?.bathrooms != null
      ? { label: "Bathrooms", value: String(details.bathrooms) }
      : null,
    details?.car_ports != null
      ? { label: "Carport", value: String(details.car_ports) }
      : null,
    details?.floor_area != null
      ? {
          label: "Floor area",
          value: `${formatAmount(details.floor_area)} ${details.floor_area_unit ?? ""}`.trim(),
        }
      : null,
    landSize != null
      ? {
          label: "Land size",
          value: `${formatAmount(landSize)} ${landSizeUnit ?? ""}`.trim(),
        }
      : null,
    details?.floors != null
      ? { label: "Floors", value: String(details.floors) }
      : null,
    details?.year_built != null
      ? { label: "Year built", value: String(details.year_built) }
      : null,
    details?.furnished != null
      ? { label: "Furnished", value: details.furnished ? "Yes" : "No" }
      : null,
    land?.land_use
      ? { label: "Land use", value: labelFor(land.land_use) }
      : null,
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  const location = [property.locality, property.nearest_town, property.county]
    .filter(Boolean)
    .join(", ");
  const propertyUrl = new URL(`/${encodeURIComponent(slug)}`, getURL()).toString();
  const primaryImage = primaryPropertyImageUrl(property);

  const headlineFacts = facts.filter((fact) =>
    ["Bedrooms", "Bathrooms", "Carport"].includes(fact.label),
  );
  const extraFacts = facts.filter(
    (fact) => !["Bedrooms", "Bathrooms", "Carport"].includes(fact.label),
  );

  return (
    <main className="bg-background">
      <JsonLd
        data={buildPropertyJsonLd({
          property,
          slug,
          primaryImageUrl: primaryImage,
        })}
      />
      <div className="container mx-auto px-4 pb-6 pt-2 sm:px-6 lg:px-8">
        <div className="p-4 pt-2 sm:px-6 sm:pb-6 sm:pt-3 lg:px-8 lg:pb-8 lg:pt-4">
          <PropertyGallery
            images={images}
            title={property.title}
            badge={isSold ? "Sold" : listingLabel}
            sold={isSold}
          />

      <div className="mt-8">
        <div className="min-w-0 space-y-8">
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="max-w-xl text-3xl font-semibold tracking-tight">
                  {property.title}
                </h1>
                {location && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {location}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                <PropertyShareButton title={property.title} />
                <div className="sm:text-right">
                  <p className="text-3xl font-semibold tracking-tight">
                    {formatPrice(property.price, property.currency)}
                  </p>
                  {property.price_period && property.price_period !== "once" && (
                    <p className="text-sm text-muted-foreground">
                      / {property.price_period}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {headlineFacts.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-4 border-y py-5 sm:grid-cols-3 sm:gap-6">
                {headlineFacts.map((fact) => {
                  const Icon = fact.label === "Bedrooms"
                    ? BedDouble
                    : fact.label === "Bathrooms"
                      ? Bath
                      : CarFront;

                  return (
                    <div key={fact.label} className="flex items-center gap-3">
                      <Icon
                        aria-hidden="true"
                        className="size-5 shrink-0 text-primary"
                      />
                      <div>
                        <dt className="text-sm text-muted-foreground">
                          {fact.label}
                        </dt>
                        <dd className="text-xl font-semibold">{fact.value}</dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            )}

            {extraFacts.length > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                {extraFacts
                  .map((fact) => `${fact.label}: ${fact.value}`)
                  .join(" · ")}
              </p>
            )}
          </div>

          <div className="grid items-start gap-x-8 gap-y-6 md:grid-cols-[minmax(0,1fr)_18rem] lg:grid-cols-[minmax(0,1fr)_20rem]">
            {property.listing_contact && (
              <div className="self-start md:col-start-2 md:row-start-1">
                <ListingContactCard
                  contact={property.listing_contact}
                  propertyTitle={property.title}
                  propertyUrl={propertyUrl}
                />
              </div>
            )}

            {property.description && (
              <section className="min-w-0 space-y-3 md:col-start-1 md:row-start-1">
                <h2 className="text-lg font-semibold">Property details</h2>
                <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                  {property.description}
                </p>
              </section>
            )}
          </div>

          <Suspense fallback={<PropertyAmenitiesSkeleton />}>
            <PropertyAmenities propertyId={property.id} />
          </Suspense>

          <Suspense fallback={<SimilarPropertiesSkeleton />}>
            <SimilarProperties
              property={{
                id: property.id,
                property_type: property.property_type,
                listing_type: property.listing_type,
                locality: property.locality,
                nearest_town: property.nearest_town,
                county: property.county,
                price: property.price,
              }}
            />
          </Suspense>
        </div>

      </div>
        </div>
      </div>
    </main>
  );
}

function ListingContactCard({
  contact,
  propertyTitle,
  propertyUrl,
}: {
  contact: ListingContact;
  propertyTitle: string;
  propertyUrl: string;
}) {
  const phoneHref = contact.phone
    ? `tel:${contact.phone.replace(/\s/g, "")}`
    : null;
  const whatsappNumber = contact.phone?.replace(/\D/g, "");
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm interested in ${propertyTitle}. Could you please share more details?\n${propertyUrl}`)}`
    : null;

  return (
    <aside className="flex min-w-0 flex-col gap-4 rounded-xl border bg-card p-4">
      <div className="min-w-0 space-y-1">
        <p className="text-xs text-muted-foreground">Listed by</p>
        {contact.username ? (
          <Link
            href={`/agency/${encodeURIComponent(contact.username)}`}
            className="block truncate font-semibold hover:underline"
          >
            {contact.name}
          </Link>
        ) : (
          <p className="truncate font-semibold">{contact.name}</p>
        )}
        {contact.phone && phoneHref && (
          <a href={phoneHref} className="block text-sm text-muted-foreground hover:underline">
            {contact.phone}
          </a>
        )}
        {contact.email && (
          <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:underline">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="break-all">{contact.email}</span>
          </a>
        )}
        {contact.location && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {contact.location}
          </p>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-center text-sm font-medium hover:bg-muted"
          >
            <MessageCircle className="h-4 w-4" />
            Message us on WhatsApp
          </a>
        )}
        {phoneHref && (
          <a
            href={phoneHref}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        )}
      </div>
    </aside>
  );
}
