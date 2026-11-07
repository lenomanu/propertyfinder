import { Suspense } from "react";

import Search from "@/components/properties/Search";
import PropertyGrid from "@/components/properties/PropertyGrid";
import PropertyGridSkeleton from "@/components/properties/PropertyGridSkeleton";
import PropertyPagination from "@/components/properties/PropertyPagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getPropertyLocalities,
  getSearchedProperties,
} from "@/lib/properties/property-search";
import {
  loadPropertySearchParamsFor,
  type ListingType,
} from "@/lib/properties/property-search-params";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type PropertiesListingProps = {
  searchParams: SearchParams;
  defaultListingType: ListingType;
  status?: "approved" | "sold";
};

async function PropertiesResults({
  searchParams,
  defaultListingType,
  status = "approved",
}: PropertiesListingProps) {
  const filters = await loadPropertySearchParamsFor(
    searchParams,
    defaultListingType
  );
  const { page, pageSize, ...searchFilters } = filters;

  const searchResult = await getSearchedProperties(
    searchFilters,
    { page, pageSize },
    { status }
  );
  const shouldShowRelated =
    searchFilters.search.trim().length > 0 &&
    searchResult.success &&
    searchResult.properties.length === 0;
  const result = shouldShowRelated
    ? await getSearchedProperties(
        { ...searchFilters, search: "" },
        { page, pageSize },
        { status }
      )
    : searchResult;

  const title =
    status === "sold"
      ? "Properties sold"
      : `Properties for ${filters.listingType === "sale" ? "sale" : "rent"}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">
          {result.total.toLocaleString()} properties found
        </p>
      </div>

      {shouldShowRelated ? (
        <div className="rounded-xl border bg-card px-4 py-3">
          <h2 className="font-semibold">No properties matched “{searchFilters.search}”</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Here are related properties matching your other filters.
          </p>
        </div>
      ) : null}

      {!result.success ? (
        <p role="status" className="rounded-xl border bg-card px-4 py-3 text-sm text-muted-foreground">
          We couldn’t load properties right now. Please try again shortly.
        </p>
      ) : null}

      <PropertyGrid properties={result.properties} />

      <PropertyPagination totalPages={result.totalPages} />
    </div>
  );
}

async function PropertySearch({
  defaultListingType,
  status = "approved",
}: {
  defaultListingType: ListingType;
  status?: "approved" | "sold";
}) {
  const localities = await getPropertyLocalities(status);
  return (
    <Search localities={localities} defaultListingType={defaultListingType} />
  );
}

export default function PropertiesListing({
  searchParams,
  defaultListingType,
  status = "approved",
}: PropertiesListingProps) {
  return (
    <main className="container mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex flex-col gap-3 md:flex-row">
            <Skeleton className="h-14 flex-1 rounded-full" />
            <Skeleton className="h-14 w-28 rounded-full" />
          </div>
        }
      >
        <PropertySearch
          defaultListingType={defaultListingType}
          status={status}
        />
      </Suspense>

      <Suspense fallback={<PropertyGridSkeleton showHeader count={8} />}>
        <PropertiesResults
          searchParams={searchParams}
          defaultListingType={defaultListingType}
          status={status}
        />
      </Suspense>
    </main>
  );
}
