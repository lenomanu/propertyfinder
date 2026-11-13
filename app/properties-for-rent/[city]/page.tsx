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
  const title = `Property for Rent in ${name}, Kenya`;
  const description = `Find houses and apartments for rent in ${name}, Kenya. Browse verified rental listings on Property Team.`;

  return pageMetadata({
    title,
    description,
    path: `/properties-for-rent/${encodeURIComponent(city)}`,
    keywords: [
      `houses for rent ${name}`,
      `apartments for rent ${name}`,
      `property to rent ${name}`,
      "rent Kenya",
    ],
  });
}

export default async function CityPage({ params, searchParams }: Props) {
  const { city } = await params;
  return <CityPropertiesListing city={city} searchParams={searchParams} listingType="rent" />;
}
