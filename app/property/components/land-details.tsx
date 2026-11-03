
"use client";

import { useEffect, useState } from "react";

import {
  getLandDetails,
  type LandDetails as LandDetailsType,
} from "@/lib/land-details-actions";

import LandDetailsForm from "./land-details-form";
import PropertyDetailsSkeleton from "./property-details-skeleton";

type LandDetailsProps = {
  propertyId: string;
};

export default function LandDetails({
  propertyId,
}: LandDetailsProps) {
  const [landDetails, setLandDetails] =
    useState<LandDetailsType | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLandDetails() {
      setLoading(true);
      setError("");

      try {
        const data = await getLandDetails(propertyId);

        if (cancelled) {
          return;
        }

        setLandDetails(data);
      } catch (error) {
        console.error(
          "Failed to load land details:",
          error
        );

        if (cancelled) {
          return;
        }

        setError(
          "We couldn't load the land details. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (!propertyId) {
      setLoading(false);
      setError("We couldn't identify this property.");

      return;
    }

    loadLandDetails();

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
    <LandDetailsForm
      propertyId={propertyId}
      landDetails={landDetails}
    />
  );
}
