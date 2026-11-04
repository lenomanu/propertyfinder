"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PropertyResult } from "@/lib/properties/property.types";

type PropertyCardProps = {
  property: PropertyResult;
  imageBaseUrl: string;
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

const SLIDE_INTERVAL_MS = 3500;
const SLIDE_DURATION_MS = 650;

function relationValue(
  value: string | number | null | undefined,
  unit?: string | null
) {
  if (value == null) return null;
  const formatted =
    typeof value === "number" ? value.toLocaleString() : value;
  return unit ? `${formatted} ${unit}` : formatted;
}

function toPropertyImageUrl(path: string, baseUrl: string) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  if (!baseUrl) return null;

  const encodedKey = path.split("/").map(encodeURIComponent).join("/");
  return `${baseUrl.replace(/\/$/, "")}/${encodedKey}`;
}

function PropertyCardImages({
  images,
  alt,
  imageBaseUrl,
}: {
  images: string[];
  alt: string;
  imageBaseUrl: string;
}) {
  const urls = useMemo(
    () =>
      images
        .map((path) => toPropertyImageUrl(path, imageBaseUrl))
        .filter((url): url is string => Boolean(url)),
    [images, imageBaseUrl]
  );
  const [index, setIndex] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const nextReadyRef = useRef(false);
  const pendingAdvanceRef = useRef(false);
  const slidingRef = useRef(false);

  const currentUrl = urls[index] ?? null;
  const nextIndex = urls.length > 1 ? (index + 1) % urls.length : null;
  const nextUrl = nextIndex != null ? urls[nextIndex] : null;
  const shouldCycle = urls.length > 1 && inView && pageVisible;

  const startSlide = useCallback(() => {
    if (urls.length < 2 || slidingRef.current || !nextReadyRef.current) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    pendingAdvanceRef.current = false;

    if (reduceMotion) {
      setIndex((current) => (current + 1) % urls.length);
      return;
    }

    slidingRef.current = true;
    setSliding(true);
  }, [urls.length]);

  const finishSlide = useCallback(() => {
    if (!slidingRef.current) return;
    slidingRef.current = false;
    setSliding(false);
    setIndex((current) => (current + 1) % urls.length);
  }, [urls.length]);

  const markNextReady = useCallback(
    (img: HTMLImageElement) => {
      if (img.naturalWidth <= 0) return;
      nextReadyRef.current = true;
      if (pendingAdvanceRef.current) startSlide();
    },
    [startSlide]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      setPageVisible(document.visibilityState === "visible");
    };

    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    nextReadyRef.current = false;
    pendingAdvanceRef.current = false;
  }, [index, nextUrl]);

  useEffect(() => {
    if (!shouldCycle || !nextUrl) return;

    let cancelled = false;
    const img = new window.Image();
    const done = () => {
      if (!cancelled) markNextReady(img);
    };

    img.onload = done;
    img.src = nextUrl;
    if (img.complete) done();

    return () => {
      cancelled = true;
    };
  }, [shouldCycle, nextUrl, markNextReady]);

  useEffect(() => {
    if (!shouldCycle) return;

    const timeoutId = window.setTimeout(() => {
      if (nextReadyRef.current) {
        startSlide();
      } else {
        pendingAdvanceRef.current = true;
      }
    }, SLIDE_INTERVAL_MS);

    return () => {
      window.clearTimeout(timeoutId);
      pendingAdvanceRef.current = false;
    };
  }, [shouldCycle, index, urls.length, startSlide]);

  useEffect(() => {
    if (!sliding) return;

    const timeoutId = window.setTimeout(finishSlide, SLIDE_DURATION_MS + 80);
    return () => window.clearTimeout(timeoutId);
  }, [sliding, finishSlide]);

  if (!currentUrl) {
    return (
      <div className="flex h-full items-center justify-center">
        <ImageIcon className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 overflow-hidden transition-transform duration-300 group-hover:scale-105"
    >
      <div
        className={cn(
          "flex h-full",
          sliding && "transition-transform ease-in-out"
        )}
        style={{
          width: nextUrl ? "200%" : "100%",
          transform: sliding ? "translateX(-50%)" : "translateX(0%)",
          transitionDuration: sliding ? `${SLIDE_DURATION_MS}ms` : undefined,
        }}
        onTransitionEnd={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.propertyName !== "transform") return;
          finishSlide();
        }}
      >
        <img
          src={currentUrl}
          alt={alt}
          loading="eager"
          decoding="async"
          className="h-full w-full shrink-0 object-cover"
          style={{ width: nextUrl ? "50%" : "100%" }}
        />
        {nextUrl && (
          <img
            src={nextUrl}
            alt=""
            loading="eager"
            decoding="async"
            aria-hidden
            onLoad={(event) => markNextReady(event.currentTarget)}
            className="h-full shrink-0 object-cover"
            style={{ width: "50%" }}
          />
        )}
      </div>
    </div>
  );
}

export default function PropertyCard({
  property,
  imageBaseUrl,
}: PropertyCardProps) {
  const isSold = property.status === "sold";
  const isForSale = property.listing_type === "sale";
  const isLand =
    property.property_type === "land" || property.property_type === "plot";

  const details = property.property_details;
  const landDetails = property.land_details;

  const landSize = isLand ? landDetails?.land_size : details?.land_size;
  const landSizeUnit = isLand
    ? landDetails?.land_size_unit
    : details?.land_size_unit;

  const listingLabel = `${
    PROPERTY_TYPE_LABELS[property.property_type] ?? "Property"
  } for ${isForSale ? "sale" : "rent"}`;

  const formattedPrice = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: property.currency === "USD" ? "USD" : "KES",
    maximumFractionDigits: 0,
  }).format(property.price);

  const currentYear = new Date().getFullYear();
  const isNewConstruction =
    details?.year_built != null && details.year_built >= currentYear - 1;

  const specs: string[] = [];

  if (!isLand && details?.bedrooms != null) {
    specs.push(details.bedrooms === 0 ? "Studio" : `${details.bedrooms} bed`);
  }

  if (!isLand && details?.bathrooms != null) {
    specs.push(`${details.bathrooms} bath`);
  }

  const floorArea = relationValue(
    details?.floor_area,
    details?.floor_area_unit
  );
  if (floorArea) specs.push(floorArea);

  const lotSize = relationValue(landSize, landSizeUnit);
  if (lotSize) specs.push(`${lotSize} lot`);

  const href = `/${encodeURIComponent(property.slug)}`;

  return (
    <article className="group flex flex-col">
      <Link href={href} className="flex flex-col">
      {property.broker_name && (
        <p className="mb-2 truncate text-xs text-muted-foreground">
          Listed by {property.broker_name}
        </p>
      )}

      <div className="relative mb-3 block aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <PropertyCardImages
          images={property.images ?? []}
          alt={property.title}
          imageBaseUrl={imageBaseUrl}
        />

        {isSold ? (
          <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
            Sold
          </span>
        ) : (
          isNewConstruction && (
            <span className="absolute left-3 top-3 rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white">
              New construction
            </span>
          )
        )}
      </div>

      <div
        className={cn(
          "flex items-center gap-2 text-sm",
          isSold ? "font-medium text-orange-600" : "text-muted-foreground"
        )}
      >
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            isSold ? "bg-orange-500" : "bg-green-600"
          )}
          aria-hidden
        />
        <span>{isSold ? "Sold" : listingLabel}</span>
      </div>

      <div className="mt-1 flex flex-wrap items-baseline gap-1">
        <h3 className="text-2xl font-bold tracking-tight">{formattedPrice}</h3>
        {property.price_period && property.price_period !== "once" && (
          <span className="text-sm text-muted-foreground">
            / {property.price_period}
          </span>
        )}
      </div>

      {specs.length > 0 && (
        <p className="mt-1 text-sm font-medium">{specs.join("  ")}</p>
      )}

      <address className="mt-1 not-italic text-sm">
        <p className="line-clamp-2 font-medium">{property.title}</p>
        <p className="truncate text-muted-foreground">
          {[property.locality, property.nearest_town]
            .filter(Boolean)
            .join(", ")}
        </p>
      </address>
      </Link>
    </article>
  );
}
