import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublicImageUrl } from "@/lib/cloudflare/public-image-url";

import AgencyListingTabs from "@/components/properties/AgencyListingTabs";
import AgencyProfileHeader from "@/components/properties/AgencyProfileHeader";
import PropertyGrid from "@/components/properties/PropertyGrid";
import PropertyPagination from "@/components/properties/PropertyPagination";
import Search from "@/components/properties/Search";
import { getApprovedAgencyByUsername } from "@/lib/properties/agency-profile";
import {
  getPropertyLocalities,
  getSearchedProperties,
} from "@/lib/properties/property-search";
import { loadPropertySearchParamsFor } from "@/lib/properties/property-search-params";
import { pageMetadata } from "@/lib/seo/metadata";

export const instant = false;

type Props = {
  params: Promise<{ username: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const agency = await getApprovedAgencyByUsername(username);

  if (!agency) {
    return { title: "Agency not found" };
  }

  const location = [agency.town, agency.location].filter(Boolean).join(", ");
  const title = `${agency.name} – Real estate agency in Kenya`;
  const description = location
    ? `${agency.name} lists property for sale and rent in ${location}, Kenya. View active listings on Property Team.`
    : `${agency.name} lists property for sale and rent across Kenya. View active listings on Property Team.`;

  let image: string | null = null;
  if (agency.profileImageUrl) {
    try {
      image = getPublicImageUrl(agency.profileImageUrl);
    } catch {
      image = null;
    }
  }

  return pageMetadata({
    title,
    description,
    path: `/agency/${encodeURIComponent(username)}`,
    image,
  });
}

function requestedStatus(value: string | string[] | undefined) {
  return value === "sold" || (Array.isArray(value) && value[0] === "sold")
    ? "sold"
    : "approved";
}

export default async function AgencyProfilePage({
  params,
  searchParams,
}: Props) {
  const [{ username }, query] = await Promise.all([params, searchParams]);
  const agency = await getApprovedAgencyByUsername(username);

  if (!agency) notFound();

  const status = requestedStatus(query.status);
  const filters = await loadPropertySearchParamsFor(Promise.resolve(query), "sale");
  const { page, pageSize, ...searchFilters } = filters;
  const scope = { agencyId: agency.id, agencyUserId: agency.userId };

  const [localities, result] = await Promise.all([
    getPropertyLocalities(status, scope),
    getSearchedProperties(
      searchFilters,
      { page, pageSize },
      { status, ...scope }
    ),
  ]);

  return (
    <main className="container mx-auto space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <AgencyProfileHeader agency={agency} />

      <section className="space-y-6" aria-labelledby="agency-properties-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="agency-properties-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              {status === "sold" ? "Sold properties" : "Available properties"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.total.toLocaleString()} properties found
            </p>
          </div>
          <AgencyListingTabs />
        </div>

        <Search localities={localities} defaultListingType="sale" />

        {result.error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            We couldn&apos;t load this agency&apos;s properties. Please try again.
          </p>
        ) : (
          <>
            <PropertyGrid properties={result.properties} />
            <PropertyPagination totalPages={result.totalPages} />
          </>
        )}
      </section>
    </main>
  );
}
