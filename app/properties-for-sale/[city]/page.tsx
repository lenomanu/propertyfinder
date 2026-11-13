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
  const title = `Property for Sale in ${name}, Kenya`;
  const description = `Find houses, apartments and land for sale in ${name}, Kenya. Compare available properties and explore your next investment.`;

  return pageMetadata({
    title,
    description,
    path: `/properties-for-sale/${encodeURIComponent(city)}`,
    keywords: [
      `property for sale ${name}`,
      `houses for sale ${name}`,
      `land for sale ${name}`,
      "property Kenya",
    ],
  });
}

export default async function CityPage({ params, searchParams }: Props) {
  const { city } = await params;
  return <CityPropertiesListing city={city} searchParams={searchParams} listingType="sale" />;
}
