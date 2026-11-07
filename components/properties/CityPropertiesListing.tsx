import Link from "next/link";
import PropertyGrid from "@/components/properties/PropertyGrid";
import { getSearchedProperties } from "@/lib/properties/property-search";
import {
  loadPropertySearchParamsFor,
  type ListingType,
} from "@/lib/properties/property-search-params";

type Props = {
  city: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  listingType: ListingType;
  sold?: boolean;
};

function formatCity(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function CityPropertiesListing({
  city,
  searchParams,
  listingType,
  sold = false,
}: Props) {
  const cityName = formatCity(city);
  const rawParams = await searchParams;
  const filters = await loadPropertySearchParamsFor(
    Promise.resolve({ ...rawParams, locality: cityName }),
    listingType,
  );
  const { page, pageSize, ...searchFilters } = filters;
  const result = await getSearchedProperties(
    searchFilters,
    { page, pageSize },
    { status: sold ? "sold" : "approved" },
  );
  const heading = sold
    ? `Property sold in ${cityName}`
    : `Property for ${listingType === "rent" ? "rent" : "sale"} in ${cityName}`;

  return (
    <main className="container mx-auto min-h-[55vh] space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="px-2">/</span>
        <span>{cityName}</span>
      </nav>
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
        <p className="mt-2 text-muted-foreground">
          Browse {result.total.toLocaleString()} {sold ? "sold properties" : "homes and properties"} in {cityName}, Kenya.
        </p>
      </header>
      {result.properties.length ? (
        <PropertyGrid properties={result.properties} />
      ) : (
        <div className="rounded-2xl border bg-card px-6 py-12 text-center">
          <h2 className="text-xl font-semibold">No matching properties found yet</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Try another neighbourhood or broaden your bedroom and bathroom filters.
          </p>
          <Link href={`/properties-for-${sold ? "sale" : listingType}`} className="mt-5 inline-flex font-medium text-primary hover:underline">
            Browse all {sold ? "properties for sale" : `properties for ${listingType === "rent" ? "rent" : "sale"}`}
          </Link>
        </div>
      )}
    </main>
  );
}
