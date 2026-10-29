
import { parsePropertyQuery } from "@/lib/property-query";
import { getProperties } from "./actions/get-properties";
import PropertiesPage from "@/app/(agent)/agent/components/properties/properties-page";



type PageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

export default async function Page({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const query = parsePropertyQuery(params);

  const result = await getProperties({
    search: query.search,
    page: query.page,
  });

  return (
    <PropertiesPage
      initialData={result}
      search={query.search}
    />
  );
}