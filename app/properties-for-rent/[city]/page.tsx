import type { Metadata } from "next";
import CityPropertiesListing from "@/components/properties/CityPropertiesListing";

type Props = {
  params: Promise<{ city: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const cityTitle = (slug: string) => slug.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const name = cityTitle(city);
  return {
    title: `Property for Rent in ${name}, Kenya | Property Team`,
    description: `Find houses and apartments for rent in ${name}, Kenya. Browse available rental properties and explore your next home.`,
  };
}

export default async function CityPage({ params, searchParams }: Props) {
  const { city } = await params;
  return <CityPropertiesListing city={city} searchParams={searchParams} listingType="rent" />;
}
