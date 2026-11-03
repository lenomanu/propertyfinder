import Search from "@/components/properties/Search";
import { getSearchedProperties } from "@/lib/properties/property-search";
import { loadPropertySearchParams } from "@/lib/properties/property-search-params";

import PropertyGrid from "@/components/properties/PropertyGrid";
import PropertyPagination from "@/components/properties/PropertyPagination";

type Props = {
  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
};

export default async function PropertiesPage({
  searchParams,
}: Props) {
  const filters = await loadPropertySearchParams(searchParams);

  const {
    page,
    pageSize,
    ...searchFilters
  } = filters;

  const result = await getSearchedProperties(
    searchFilters,
    { page, pageSize }
  );

  return (
    <main className="container mx-auto space-y-6 py-6">
      <Search />

      <div>
        <h1 className="text-xl font-semibold">
          Properties for {filters.listingType === "sale" ? "sale" : "rent"}
        </h1>

        <p className="text-sm text-muted-foreground">
          {result.total.toLocaleString()} properties found
        </p>
      </div>

      <PropertyGrid properties={result.properties} />

      {/* Connect your pagination component here */}
      <PropertyPagination
  totalPages={result.totalPages}
/>
    </main>
  );
}