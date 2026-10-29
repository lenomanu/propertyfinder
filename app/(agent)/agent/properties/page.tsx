
import { Suspense } from "react";

import { parsePropertyQuery } from "@/lib/property-query";
import { getProperties } from "./actions/get-properties";
import PropertiesPage from "../components/properties/properties-page";

type PageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

async function PropertiesContent({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const query = parsePropertyQuery(params);

  const result = await getProperties({
    search: query.search,
    page: query.page,
  });

  console.log("PropertiesPage result:", result);

  return (
    <PropertiesPage
      initialData={result}
      search={query.search}
    />
  );
}

export default function Page({
  searchParams,
}: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-6" aria-live="polite">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded-md bg-muted" />
            <div className="h-32 w-full rounded-lg bg-muted" />
            <div className="h-32 w-full rounded-lg bg-muted" />
            <div className="h-32 w-full rounded-lg bg-muted" />
          </div>
        </div>
      }
    >
      <PropertiesContent searchParams={searchParams} />
    </Suspense>
  );
}
