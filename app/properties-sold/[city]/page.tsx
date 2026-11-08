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
    title: `Recently Sold Property in ${name}, Kenya | Property Team`,
    description: `Explore recently sold homes and property in ${name}, Kenya, and see what is happening in the local property market.`,
  };
}

export default async function CityPage({ params, searchParams }: Props) {
  const { city } = await params;
  return <CityPropertiesListing city={city} searchParams={searchParams} listingType="sale" sold />;
}
