"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";

import BasicDetailsSkeleton from "../components/basic-details-skeleton";
import PropertyForm from "../components/property-form.";

function UpdateProperty() {
  const params = useParams();

  const id = params.id;

  if (!id || typeof id !== "string") {
    return <BasicDetailsSkeleton />;
  }

  return (
    <Suspense fallback={<BasicDetailsSkeleton />}>
      <PropertyForm propertyId={id} />
    </Suspense>
  );
}

export default UpdateProperty;