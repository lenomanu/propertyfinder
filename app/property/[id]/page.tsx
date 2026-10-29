import { Suspense } from "react";

import BasicDetailsSkeleton from "../components/basic-details-skeleton";
import PropertyForm from "../components/property-form.";

async function PropertyContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PropertyForm propertyId={id} />;
}

export default function UpdateProperty({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<BasicDetailsSkeleton />}>
      <PropertyContent params={params} />
    </Suspense>
  );
}