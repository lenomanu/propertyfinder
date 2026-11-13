import type { Metadata } from "next";
import CityPropertiesListing from "@/components/properties/CityPropertiesListing";
import { pageMetadata } from "@/lib/seo/metadata";
import { cityTitleFromSlug } from "@/lib/seo/urls";

type Props = {
  params: Promise<{ city: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const name = cityTitleFromSlug(city);
  const title = `Sold Property in ${name}, Kenya`;
  const description = `See recently sold property in ${name}, Kenya. Explore sale prices and listing history on Property Team.`;

  return pageMetadata({
    title,
    description,
    path: `/properties-sold/${encodeURIComponent(city)}`,
  });
}

export default async function CityPage({ params, searchParams }: Props) {
  const { city } = await params;
  return (
    <CityPropertiesListing
      city={city}
      searchParams={searchParams}
      listingType="sale"
      sold
    />
  );
}
