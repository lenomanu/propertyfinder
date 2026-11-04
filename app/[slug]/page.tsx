import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ImageIcon } from "lucide-react";

import PropertyAmenities from "@/components/properties/PropertyAmenities";
import PropertyAmenitiesSkeleton from "@/components/properties/PropertyAmenitiesSkeleton";
import { getPublicImageUrl } from "@/lib/cloudflare/public-image-url";
import { getPropertyBySlug } from "@/lib/properties/property";

type Props = {
  params: Promise<{ slug: string }>;
};

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
      ? { label: "Parking", value: String(details.car_ports) }
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

  return (
    <main className="container mx-auto space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
          {images[0] ? (
            <img
              src={images[0]}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {isSold && (
            <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-sm font-semibold text-white">
              Sold
            </span>
          )}
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-2 gap-3">
            {images.slice(1, 5).map((url) => (
              <div
                key={url}
                className="aspect-[4/3] overflow-hidden rounded-xl bg-muted"
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <div className="space-y-8">
          <div className="space-y-2">
            <p
              className={
                isSold
                  ? "text-sm font-medium text-orange-600"
                  : "text-sm text-muted-foreground"
              }
            >
              {listingLabel}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {property.title}
            </h1>
            <p className="text-muted-foreground">{location}</p>
            <p className="text-3xl font-bold tracking-tight">
              {formatPrice(property.price, property.currency)}
              {property.price_period && property.price_period !== "once" && (
                <span className="ml-1 text-base font-medium text-muted-foreground">
                  / {property.price_period}
                </span>
              )}
            </p>
          </div>

          {facts.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Details</h2>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {facts.map((fact) => (
                  <div key={fact.label} className="rounded-lg border p-3">
                    <dt className="text-xs text-muted-foreground">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 font-medium">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {property.description && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="whitespace-pre-line text-sm leading-6">
                {property.description}
              </p>
            </section>
          )}

          <Suspense fallback={<PropertyAmenitiesSkeleton />}>
            <PropertyAmenities propertyId={property.id} />
          </Suspense>
        </div>

        {property.broker_name && (
          <aside className="h-fit rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Listed by</p>
            <p className="mt-1 text-lg font-semibold">{property.broker_name}</p>
          </aside>
        )}
      </div>
    </main>
  );
}
