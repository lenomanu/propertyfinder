
import Image from "next/image";
import Link from "next/link";

import {
  Bath,
  BedDouble,
  CarFront,
  Heart,
  ImageIcon,
  MapPin,
  Ruler,
} from "lucide-react";

import type { PropertyResult } from "@/lib/properties/property.types";

type PropertyCardProps = {
  property: PropertyResult;
};

export default function PropertyCard({
  property,
}: PropertyCardProps) {
  const image = property.images?.[0] ?? null;

  const isForSale = property.listing_type === "sale";

  const isLand =
    property.property_type === "land" ||
    property.property_type === "plot";

  const details = property.property_details;
  const landDetails = property.land_details;

  // Land and plot properties use land_details.
  // Other property types use property_details.
  const landSize = isLand
    ? landDetails?.land_size
    : details?.land_size;

  const landSizeUnit = isLand
    ? landDetails?.land_size_unit
    : details?.land_size_unit;

  const propertySize =
    landSize != null
      ? `${landSize.toLocaleString()} ${landSizeUnit ?? ""}`
      : null;

  const formattedPrice = new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 0,
  }).format(property.price);

  const location = [
    property.locality,
    property.nearest_town,
    property.county,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">

      {/* Property Image */}
      <Link
        href={`/properties/${property.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        {image ? (
          <Image
            src={image}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {/* Favourite Button */}
        <button
          type="button"
          aria-label="Add property to favourites"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-sm transition hover:bg-white"
        >
          <Heart className="h-5 w-5" />
        </button>

        {/* Image Count */}
        {property.images?.length > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
            <ImageIcon className="h-3.5 w-3.5" />
            {property.images.length}
          </div>
        )}
      </Link>

      {/* Property Information */}
      <div className="space-y-3 p-4">

        {/* Listing Type */}
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {isForSale ? "Property for sale" : "Property for rent"}
        </p>

        {/* Price */}
        <div className="flex flex-wrap items-baseline gap-1">
          <h3 className="text-xl font-bold tracking-tight">
            {property.currency} {formattedPrice}
          </h3>

          {property.price_period && (
            <span className="text-sm text-muted-foreground">
              / {property.price_period}
            </span>
          )}
        </div>

        {/* Property Title */}
        <Link href={`/properties/${property.slug}`}>
          <h2 className="line-clamp-1 font-semibold hover:text-primary">
            {property.title}
          </h2>
        </Link>

        {/* Location */}
        {location && (
          <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}

        {/* Property Features */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 text-sm text-muted-foreground">

          {/* Bedrooms */}
          {details?.bedrooms != null && (
            <div className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" />
              <span>{details.bedrooms} Beds</span>
            </div>
          )}

          {/* Bathrooms */}
          {details?.bathrooms != null && (
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" />
              <span>{details.bathrooms} Baths</span>
            </div>
          )}

          {/* Parking */}
          {details?.car_ports != null && (
            <div className="flex items-center gap-1.5">
              <CarFront className="h-4 w-4" />
              <span>{details.car_ports} Parking</span>
            </div>
          )}

          {/* Plot Size / Land Size */}
          {propertySize && (
            <div className="flex items-center gap-1.5">
              <Ruler className="h-4 w-4" />
              <span>
                {propertySize} {isLand ? "Plot size" : "Land size"}
              </span>
            </div>
          )}

        </div>
      </div>
    </article>
  );
}
