import type { Metadata } from "next";
import CityPropertiesListing from "@/components/properties/CityPropertiesListing";
import { listingSearchMetadata } from "@/lib/seo/listing-search-metadata";
import { cityTitleFromSlug } from "@/lib/seo/urls";

type Props = {
  params: Promise<{ city: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { city } = await params;
  const name = cityTitleFromSlug(city);

  return listingSearchMetadata(
    searchParams,
    "sale",
    `/properties-for-sale/${encodeURIComponent(city)}`,
    name
  );
}

export default async function CityPage({ params, searchParams }: Props) {
  const { city } = await params;
  return <CityPropertiesListing city={city} searchParams={searchParams} listingType="sale" />;
}
