import PropertiesListing from "@/components/properties/PropertiesListing";

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
