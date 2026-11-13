import type { Metadata } from "next";
import PropertiesListing from "@/components/properties/PropertiesListing";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Sold Property in Kenya",
  description:
    "Browse sold property listings across Kenya. See what homes and land have sold and compare neighbourhoods on Property Team.",
  path: "/properties-sold",
});

export const instant = false;

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function PropertiesSoldPage({ searchParams }: Props) {
  return (
    <PropertiesListing
      searchParams={searchParams}
      defaultListingType="sale"
      status="sold"
    />
  );
}
