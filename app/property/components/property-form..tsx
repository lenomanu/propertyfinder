"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";





import GpsLocation from "./steps/gps-location";

import StepIndicator from "./steps/step-indicator";
import BasicDetails from "./steps/basic-information";
import PropertyImages from "./steps/images";
import Details from "./steps/details";


interface PropertyFormProps {
  propertyId?: string | null;
}

export default function PropertyForm({ propertyId }: PropertyFormProps) {
  const [step, setStep] = useState(1);
  const [propertyIdState, setPropertyIdState] = useState<string>(propertyId ?? "");
  const [propertyType, setPropertyType] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
  if (!error) return;

  const timer = setTimeout(() => setError(""), 5000);

  // Cleanup: cancels the old timer if a new error is set or the component unmounts
  return () => clearTimeout(timer);
}, [error]);

  

  const nextStep = () => {
  if (!propertyIdState.trim() || !propertyType.trim()) {
    setError("Please fill all required fields and add property before proceeding.");
    return;
  }

  setError("");

  if (step < 4) {
    setStep((current) => current + 1);
  }
};

  const previousStep = () => {
    if (step > 1) {
      setStep((current) => current - 1);
    }
  };

  const saveDraft = () => {
    // Save draft logic will go here
  };

  const submitProperty = () => {
    // Submit property logic will go here
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Add Property
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Complete the steps below to create your property listing.
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={step} />

      {/* Step Content */}
      <Card>
        <CardContent className="p-6 md:p-8">
          {step === 1 && <BasicDetails propertyId={propertyIdState} setPropertyId={setPropertyIdState} propertyType={propertyType} setPropertyType={setPropertyType} />}

          {step === 2 && <Details propertyId={propertyIdState} propertyType={propertyType} />}

          {step === 3 && <GpsLocation />}

          {step === 4 && <PropertyImages propertyId={propertyIdState} />}
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

        <div className="flex items-center gap-3">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="button"
            variant="outline"
            onClick={saveDraft}
          >
            Save Draft
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              onClick={submitProperty}
            >
              Submit Property
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}