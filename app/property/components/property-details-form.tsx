"use client";

import { useState } from "react";

import {
  savePropertyDetails,
  type PropertyDetails,
  type PropertyDetailsFormData,
} from "@/lib/property-details-actions";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PropertyDetailsFormProps = {
  propertyId: string;
  propertyDetails: PropertyDetails | null;
};

function getInitialData(
  propertyDetails: PropertyDetails | null
): PropertyDetailsFormData {
  if (!propertyDetails) {
    return {
      land_size: "",
      land_size_unit: "",
      bedrooms: "",
      bathrooms: "",
      car_ports: "",
      floor_area: "",
      floor_area_unit: "",
      floors: "",
      year_built: "",
      furnished: false,
    };
  }

  return {
    land_size: String(
      propertyDetails.land_size
    ),

    land_size_unit:
      propertyDetails.land_size_unit,

    bedrooms: String(
      propertyDetails.bedrooms
    ),

    bathrooms: String(
      propertyDetails.bathrooms
    ),

    car_ports: String(
      propertyDetails.car_ports
    ),

    floor_area: String(
      propertyDetails.floor_area
    ),

    floor_area_unit:
      propertyDetails.floor_area_unit,

    floors: String(
      propertyDetails.floors
    ),

    year_built: String(
      propertyDetails.year_built
    ),

    furnished:
      propertyDetails.furnished,
  };
}

export default function PropertyDetailsForm({
  propertyId,
  propertyDetails,
}: PropertyDetailsFormProps) {
  const [data, setData] =
    useState<PropertyDetailsFormData>(
      getInitialData(propertyDetails)
    );

  const [submitting, setSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string>>({});

  const isExisting =
    propertyDetails !== null;

  function updateData(
    field: keyof PropertyDetailsFormData,
    value: string | boolean
  ) {
    setData((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => {
      const updated = { ...current };

      delete updated[field];

      return updated;
    });

    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors({});

    try {
      const result =
        await savePropertyDetails(
          propertyId,
          data
        );

      if (!result.success) {
        setErrorMessage(result.message);

        if (result.errors) {
          setFieldErrors(result.errors);
        }

        return;
      }

      setSuccessMessage(result.message);
    } catch (error) {
      console.error(
        "Property details form submission failed:",
        error
      );

      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Property Details
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {successMessage && (
            <Alert>
              <AlertDescription>
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Land Size */}
            <div className="space-y-2">
              <Label htmlFor="land_size">
                Land Size
              </Label>

              <div className="flex gap-2">
                <Input
                  id="land_size"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 500"
                  value={data.land_size}
                  onChange={(event) =>
                    updateData(
                      "land_size",
                      event.target.value
                    )
                  }
                  aria-invalid={
                    !!fieldErrors.land_size
                  }
                />

                <Select
                  value={
                    data.land_size_unit
                  }
                  onValueChange={(value) =>
                    updateData(
                      "land_size_unit",
                      value
                    )
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="sqm">
                      Square metres
                    </SelectItem>

                    <SelectItem value="acre">
                      Acres
                    </SelectItem>

                    <SelectItem value="hectare">
                      Hectares
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {fieldErrors.land_size && (
                <p className="text-sm text-destructive">
                  {fieldErrors.land_size}
                </p>
              )}

              {fieldErrors.land_size_unit && (
                <p className="text-sm text-destructive">
                  {fieldErrors.land_size_unit}
                </p>
              )}
            </div>

            {/* Floor Area */}
            <div className="space-y-2">
              <Label htmlFor="floor_area">
                Floor Area
              </Label>

              <div className="flex gap-2">
                <Input
                  id="floor_area"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 180"
                  value={data.floor_area}
                  onChange={(event) =>
                    updateData(
                      "floor_area",
                      event.target.value
                    )
                  }
                  aria-invalid={
                    !!fieldErrors.floor_area
                  }
                />

                <Select
                  value={
                    data.floor_area_unit
                  }
                  onValueChange={(value) =>
                    updateData(
                      "floor_area_unit",
                      value
                    )
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="sqm">
                      Square metres
                    </SelectItem>

                    <SelectItem value="sqft">
                      Square feet
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {fieldErrors.floor_area && (
                <p className="text-sm text-destructive">
                  {fieldErrors.floor_area}
                </p>
              )}

              {fieldErrors.floor_area_unit && (
                <p className="text-sm text-destructive">
                  {fieldErrors.floor_area_unit}
                </p>
              )}
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <Label>
                Bedrooms
              </Label>

              <Select
                value={data.bedrooms}
                onValueChange={(value) =>
                  updateData(
                    "bedrooms",
                    value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bedrooms" />
                </SelectTrigger>

                <SelectContent>
                  {Array.from(
                    { length: 11 },
                    (_, index) => (
                      <SelectItem
                        key={index}
                        value={String(index)}
                      >
                        {index === 0
                          ? "None"
                          : index}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              {fieldErrors.bedrooms && (
                <p className="text-sm text-destructive">
                  {fieldErrors.bedrooms}
                </p>
              )}
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <Label>
                Bathrooms
              </Label>

              <Select
                value={data.bathrooms}
                onValueChange={(value) =>
                  updateData(
                    "bathrooms",
                    value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bathrooms" />
                </SelectTrigger>

                <SelectContent>
                  {Array.from(
                    { length: 11 },
                    (_, index) => (
                      <SelectItem
                        key={index}
                        value={String(index)}
                      >
                        {index === 0
                          ? "None"
                          : index}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              {fieldErrors.bathrooms && (
                <p className="text-sm text-destructive">
                  {fieldErrors.bathrooms}
                </p>
              )}
            </div>

            {/* Car Ports */}
            <div className="space-y-2">
              <Label>
                Car Ports
              </Label>

              <Select
                value={data.car_ports}
                onValueChange={(value) =>
                  updateData(
                    "car_ports",
                    value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select car ports" />
                </SelectTrigger>

                <SelectContent>
                  {Array.from(
                    { length: 7 },
                    (_, index) => (
                      <SelectItem
                        key={index}
                        value={String(index)}
                      >
                        {index === 0
                          ? "None"
                          : index}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              {fieldErrors.car_ports && (
                <p className="text-sm text-destructive">
                  {fieldErrors.car_ports}
                </p>
              )}
            </div>

            {/* Floors */}
            <div className="space-y-2">
              <Label>
                Number of Floors
              </Label>

              <Select
                value={data.floors}
                onValueChange={(value) =>
                  updateData(
                    "floors",
                    value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select floors" />
                </SelectTrigger>

                <SelectContent>
                  {Array.from(
                    { length: 20 },
                    (_, index) => (
                      <SelectItem
                        key={index + 1}
                        value={String(
                          index + 1
                        )}
                      >
                        {index + 1}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              {fieldErrors.floors && (
                <p className="text-sm text-destructive">
                  {fieldErrors.floors}
                </p>
              )}
            </div>

            {/* Year Built */}
            <div className="space-y-2">
              <Label htmlFor="year_built">
                Year Built
              </Label>

              <Input
                id="year_built"
                type="number"
                min="1000"
                max={
                  new Date().getFullYear()
                }
                placeholder="e.g. 2020"
                value={data.year_built}
                onChange={(event) =>
                  updateData(
                    "year_built",
                    event.target.value
                  )
                }
                aria-invalid={
                  !!fieldErrors.year_built
                }
              />

              {fieldErrors.year_built && (
                <p className="text-sm text-destructive">
                  {fieldErrors.year_built}
                </p>
              )}
            </div>

            {/* Furnished */}
            <div className="space-y-2">
              <Label>
                Furnished
              </Label>

              <Select
                value={
                  data.furnished
                    ? "true"
                    : "false"
                }
                onValueChange={(value) =>
                  updateData(
                    "furnished",
                    value === "true"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="false">
                    No
                  </SelectItem>

                  <SelectItem value="true">
                    Yes
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : isExisting
                  ? "Update Details"
                  : "Save Details"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}