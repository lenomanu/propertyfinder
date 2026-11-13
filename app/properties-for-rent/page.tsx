import type { Metadata } from "next";
import PropertiesListing from "@/components/properties/PropertiesListing";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Property for Rent in Kenya",
  description:
    "Find houses and apartments for rent across Kenya. Search rental listings by town, price, and property type on Property Team.",
  path: "/properties-for-rent",
  keywords: [
    "property for rent Kenya",
    "houses for rent",
    "apartments for rent Nairobi",
  ],
});

export const instant = false;

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function PropertiesForRentPage({ searchParams }: Props) {
  return (
    <PropertiesListing
      searchParams={searchParams}
      defaultListingType="rent"
    />
  );
}
