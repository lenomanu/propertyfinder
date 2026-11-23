import type { Metadata } from "next";
import CityPropertiesListing from "@/components/properties/CityPropertiesListing";
import { redirectToCanonicalCityRoute } from "@/lib/seo/city-route";
import { listingSearchMetadata } from "@/lib/seo/listing-search-metadata";
import { cityPathSegmentFromRouteParam, cityTitleFromSlug } from "@/lib/seo/urls";

type Props = {
  params: Promise<{ city: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { city } = await params;
  const slug = cityPathSegmentFromRouteParam(city);
  const name = cityTitleFromSlug(city);

  return listingSearchMetadata(
    searchParams,
    "sale",
    `/properties-sold/${slug}`,
    name,
    true
  );
}

export default async function CityPage({ params, searchParams }: Props) {
  const { city } = await params;
  redirectToCanonicalCityRoute("/properties-sold", city);
  return (
    <CityPropertiesListing
      city={city}
      searchParams={searchParams}
      listingType="sale"
      sold
    />
  );
}