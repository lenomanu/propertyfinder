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
  return listingSearchMetadata(searchParams, "sale", "/properties-sold", undefined, true);
}

export default function PropertiesSoldPage({ searchParams }: Props) {
  return (
    <PropertiesListing
      searchParams={searchParams}
      defaultListingType="sale"
      status="sold"
    />
  );
}