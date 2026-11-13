import type { Metadata } from "next";
import PropertiesListing from "@/components/properties/PropertiesListing";
import { listingSearchMetadata } from "@/lib/seo/listing-search-metadata";

export const instant = false;

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return listingSearchMetadata(
    searchParams,
    "rent",
    "/properties-for-rent"
  );
}

export default function PropertiesForRentPage({ searchParams }: Props) {
  return (
    <PropertiesListing
      searchParams={searchParams}
      defaultListingType="rent"
    />
  );
}
