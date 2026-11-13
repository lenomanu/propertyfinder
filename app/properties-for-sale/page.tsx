import type { Metadata } from "next";
import PropertiesListing from "@/components/properties/PropertiesListing";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Property for Sale in Kenya",
  description:
    "Browse homes, apartments, land, and commercial property for sale across Kenya. Filter by location, price, and property type on Property Team.",
  path: "/properties-for-sale",
  keywords: [
    "property for sale Kenya",
    "houses for sale",
    "land for sale",
    "apartments for sale Nairobi",
  ],
});

export const instant = false;

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function PropertiesForSalePage({ searchParams }: Props) {
  return (
    <PropertiesListing
      searchParams={searchParams}
      defaultListingType="sale"
    />
  );
}
