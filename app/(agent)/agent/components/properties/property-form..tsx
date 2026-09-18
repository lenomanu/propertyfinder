"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import StepIndicator from "./steps/step-indicator";
import BasicDetails from "./steps/basic-information";
import PropertyDetails from "./steps/property-details";
import GpsLocation from "./steps/gps-location";
import PropertyImages from "./steps/images";

interface PropertyFormProps {
  propertyId?: string;
  step: number;
}

export default function PropertyForm({
  propertyId,
  step,
}: PropertyFormProps) {
  const router = useRouter();

  const [error, setError] = useState("");

  const nextStep = () => {
    // Steps after basic information require a property ID
    if (step >= 1 && !propertyId) {
      setError(
        "Please save the property first before continuing."
      );
      return;
    }

    setError("");

    if (step < 4) {
      router.push(
        `/agent/properties/${propertyId}/step/${step + 1}`
      );
    }
  };

  const previousStep = () => {
    if (step > 1 && propertyId) {
      router.push(
        `/agent/properties/${propertyId}/step/${step - 1}`
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {propertyId ? "Edit Property" : "Add Property"}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Complete the steps below to create your property
          listing.
        </p>
      </div>

      {/* Steps */}
      <StepIndicator currentStep={step} />

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Content */}
      <Card>
        <CardContent className="p-6 md:p-8">
          {step === 1 && (
            <BasicDetails propertyId={propertyId} />
          )}

          {step === 2 && propertyId && (
            <PropertyDetails propertyId={propertyId} />
          )}

          {step === 3 && propertyId && (
            <GpsLocation propertyId={propertyId} />
          )}

          {step === 4 && propertyId && (
            <PropertyImages propertyId={propertyId} />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={previousStep}
          disabled={step === 1}
        >
          Back
        </Button>

        {step < 4 && (
          <Button
            type="button"
            onClick={nextStep}
          >
            Continue
          </Button>
        )}

        {step === 4 && (
          <Button
            type="button"
            onClick={() =>
              router.push("/agent/properties")
            }
          >
            Finish
          </Button>
        )}
      </div>
    </div>
  );
}