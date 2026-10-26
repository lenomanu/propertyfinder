"use client";

import { useEffect, useState } from "react";

import {
  getPropertyDetails,
  type PropertyDetails as PropertyDetailsType,
} from "@/lib/property-details-actions";

import PropertyDetailsForm from "./property-details-form";
import PropertyDetailsSkeleton from "./property-details-skeleton";


type PropertyDetailsProps = {
  propertyId: string;
};

export default function PropertyDetails({
  propertyId,
}: PropertyDetailsProps) {
  const [propertyDetails, setPropertyDetails] =
    useState<PropertyDetailsType | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPropertyDetails() {
      setLoading(true);
      setError("");

      try {
        const data =
          await getPropertyDetails(
            propertyId
          );

        if (cancelled) {
          return;
        }

        setPropertyDetails(data);
      } catch (error) {
        console.error(
          "Failed to load property details:",
          error
        );

        if (cancelled) {
          return;
        }

        setError(
          "We couldn't load the property details. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (!propertyId) {
      setLoading(false);

      setError(
        "We couldn't identify this property."
      );

      return;
    }

    loadPropertyDetails();

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  if (loading) {
    return <PropertyDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <PropertyDetailsForm
      propertyId={propertyId}
      propertyDetails={propertyDetails}
    />
  );
}