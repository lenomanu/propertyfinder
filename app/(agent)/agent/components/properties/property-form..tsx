"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BasicInformation } from "./steps/basic-information";
import { PropertyDetails } from "./steps/property-details";
import { LocationAmenities } from "./steps/location-amenities";


export type Property = {
  id?: string;
  agent_id?: string;
  slug?: string;
  title?: string | null;

  property_type?: "house" | "apartment" | "land" | "commercial" | null;
  listing_type?: "sale" | "rent" | null;

  price?: number | null;
  price_period?:
    | "once"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | null;

  currency?: "KES" | "USD" | null;

  description?: string | null;

  locality?: string | null;
  nearest_town?: string | null;
  county?: string | null;

  latitude?: number | null;
  longitude?: number | null;
};

type PropertyFormProps = {
  property?: Property | null;
};

export type PropertyFormData = {
  title: string;
  propertyType: Property["property_type"];
  listingType: Property["listing_type"];

  price: string;
  pricePeriod: Property["price_period"];
  currency: Property["currency"];

  description: string;

  locality: string;
  nearestTown: string;
  county: string;

  latitude: string;
  longitude: string;

  bedrooms: string;
  bathrooms: string;
  carPorts: string;

  floorArea: string;
  floorAreaUnit: "sqm" | "sqft";

  landSize: string;
  landSizeUnit: "sqm" | "sqft" | "acre" | "hectare";

  landType: "residential" | "commercial" | "";

  amenities: string[];
};

const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Tell us about the property",
  },
  {
    id: 2,
    title: "Property Details",
    description: "Add property specifications",
  },
  {
    id: 3,
    title: "Location & Amenities",
    description: "Add location and features",
  },
];

function getInitialData(property?: Property | null): PropertyFormData {
  return {
    title: property?.title ?? "",
    propertyType: property?.property_type ?? null,
    listingType: property?.listing_type ?? null,

    price: property?.price?.toString() ?? "",
    pricePeriod: property?.price_period ?? null,
    currency: property?.currency ?? "KES",

    description: property?.description ?? "",

    locality: property?.locality ?? "",
    nearestTown: property?.nearest_town ?? "",
    county: property?.county ?? "",

    latitude: property?.latitude?.toString() ?? "",
    longitude: property?.longitude?.toString() ?? "",

    bedrooms: "",
    bathrooms: "",
    carPorts: "",

    floorArea: "",
    floorAreaUnit: "sqm",

    landSize: "",
    landSizeUnit: "sqm",

    landType: "",

    amenities: [],
  };
}

export function PropertyForm({ property }: PropertyFormProps) {
  const [step, setStep] = React.useState(1);

  const [formData, setFormData] = React.useState<PropertyFormData>(() =>
    getInitialData(property)
  );

  const currentStep = steps[step - 1];

  const updateForm = (values: Partial<PropertyFormData>) => {
    setFormData((current) => ({
      ...current,
      ...values,
    }));
  };

  const handleNext = () => {
    if (step < steps.length) {
      setStep((current) => current + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((current) => current - 1);
    }
  };

  const handleSaveDraft = async () => {
    console.log("Saving draft:", {
      propertyId: property?.id,
      formData,
    });

    // Call your Supabase server action here.
  };

  const handleSubmit = async () => {
    console.log("Submitting property:", {
      propertyId: property?.id,
      formData,
    });

    // Validate everything
    // Call your Supabase server action
    // Change property status to pending
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {property?.id ? "Edit Property" : "Create Property"}
        </h1>

        <p className="text-sm text-muted-foreground">
          Add the information needed to publish your property listing.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {steps.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2"
            >
              <div
                className={[
                  "flex size-8 items-center justify-center rounded-full border text-sm font-medium",
                  step >= item.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground",
                ].join(" ")}
              >
                {item.id}
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Progress value={(step / steps.length) * 100} />
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{currentStep.title}</CardTitle>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <BasicInformation
              data={formData}
              updateForm={updateForm}
            />
          )}

          {step === 2 && (
            <PropertyDetails
              data={formData}
              updateForm={updateForm}
            />
          )}

          {step === 3 && (
            <LocationAmenities
              data={formData}
              updateForm={updateForm}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
        >
          Back
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSaveDraft}
          >
            Save Draft
          </Button>

          {step < steps.length ? (
            <Button type="button" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit}>
              Submit Property
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}