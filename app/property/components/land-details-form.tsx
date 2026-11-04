
"use client";

import { useState } from "react";

import {
  saveLandDetails,
  type LandDetails,
  type LandDetailsFormData,
} from "@/lib/land-details-actions";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
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

import { Ruler, MapPinned, Loader2 } from "lucide-react";

type LandDetailsFormProps = {
  propertyId: string;
  landDetails: LandDetails | null;
};

const LAND_SIZE_PRESETS = [
  { label: "1/8 Acre", value: "0.125" },
  { label: "1/4 Acre", value: "0.25" },
  { label: "1/2 Acre", value: "0.5" },
  { label: "3/4 Acre", value: "0.75" },
  { label: "1 Acre", value: "1" },
  { label: "2 Acres", value: "2" },
  { label: "3 Acres", value: "3" },
  { label: "4 Acres", value: "4" },
  { label: "5 Acres+", value: "5" },
];

function getInitialData(
  landDetails: LandDetails | null
): LandDetailsFormData {
  if (!landDetails) {
    return {
      land_size: "",
      land_size_unit: "acre",
      land_use: "",
    };
  }

  return {
    land_size: String(landDetails.land_size),
    land_size_unit: landDetails.land_size_unit,
    land_use: landDetails.land_use,
  };
}

function getInitialPreset(landDetails: LandDetails | null) {
  if (!landDetails || landDetails.land_size_unit !== "acre") {
    return "custom";
  }

  const matchingPreset = LAND_SIZE_PRESETS.find(
    (preset) => Number(preset.value) === Number(landDetails.land_size)
  );

  return matchingPreset?.value ?? "custom";
}

export default function LandDetailsForm({
  propertyId,
  landDetails,
}: LandDetailsFormProps) {
  const [data, setData] = useState<LandDetailsFormData>(
    getInitialData(landDetails)
  );

  const [selectedPreset, setSelectedPreset] = useState(
    getInitialPreset(landDetails)
  );

  const [submitting, setSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string>
  >({});

  const isExisting = landDetails !== null;

  function updateData(
    field: keyof LandDetailsFormData,
    value: string
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

  /**
   * Select an acre preset and populate the decimal value.
   */
  function handlePresetChange(value: string) {
    setSelectedPreset(value);

    if (value === "custom") {
      updateData("land_size", "");
      return;
    }

    const preset = LAND_SIZE_PRESETS.find(
      (item) => item.value === value
    );

    if (preset) {
      setData((current) => ({
        ...current,
        land_size: preset.value,
        land_size_unit: "acre",
      }));

      setFieldErrors((current) => {
        const updated = { ...current };
        delete updated.land_size;
        delete updated.land_size_unit;
        return updated;
      });

      setSuccessMessage("");
      setErrorMessage("");
    }
  }

  /**
   * Manual editing switches the preset to custom.
   */
  function handleLandSizeChange(value: string) {
    setSelectedPreset("custom");
    updateData("land_size", value);
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
      const result = await saveLandDetails(propertyId, data);

      if (!result.success) {
        setErrorMessage(result.message);

        if (result.errors) {
          setFieldErrors(result.errors);
        }

        return;
      }

      setSuccessMessage(result.message);
    } catch (error) {
      console.error("Land details submission failed:", error);

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
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <MapPinned className="h-5 w-5" />
          </div>

          <div>
            <CardTitle>Land Details</CardTitle>
            <CardDescription>
              Specify the land size, measurement unit and intended use.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

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

            {/* Land Size Preset */}
            <div className="space-y-2 md:col-span-2">
              <Label>Land Size Preset</Label>

              <Select
                value={selectedPreset}
                onValueChange={handlePresetChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select land size" />
                </SelectTrigger>

                <SelectContent>
                  {LAND_SIZE_PRESETS.map((preset) => (
                    <SelectItem
                      key={preset.value}
                      value={preset.value}
                    >
                      {preset.label}
                    </SelectItem>
                  ))}

                  <SelectItem value="custom">
                    Custom Size
                  </SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">
                Select a preset or choose custom to enter your own size.
              </p>
            </div>

            {/* Land Size */}
            <div className="space-y-2">
              <Label htmlFor="land_size">
                Land Size
              </Label>

              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="land_size"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 0.125"
                  className="pl-10"
                  value={data.land_size}
                  onChange={(event) =>
                    handleLandSizeChange(event.target.value)
                  }
                  aria-invalid={!!fieldErrors.land_size}
                />
              </div>

              {fieldErrors.land_size && (
                <p className="text-sm text-destructive">
                  {fieldErrors.land_size}
                </p>
              )}
            </div>

            {/* Land Size Unit */}
            <div className="space-y-2">
              <Label>Measurement Unit</Label>

              <Select
                value={data.land_size_unit}
                onValueChange={(value) => {
                  setSelectedPreset("custom");
                  updateData("land_size_unit", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="sqm">
                    Square Metres (sqm)
                  </SelectItem>

                  <SelectItem value="acre">
                    Acres
                  </SelectItem>

                  <SelectItem value="hectare">
                    Hectares
                  </SelectItem>
                </SelectContent>
              </Select>

              {fieldErrors.land_size_unit && (
                <p className="text-sm text-destructive">
                  {fieldErrors.land_size_unit}
                </p>
              )}
            </div>

            {/* Land Use */}
            <div className="space-y-2 md:col-span-2">
              <Label>Land Use</Label>

              <Select
                value={data.land_use}
                onValueChange={(value) =>
                  updateData("land_use", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select intended land use" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="residential">
                    Residential
                  </SelectItem>

                  <SelectItem value="commercial">
                    Commercial
                  </SelectItem>
                </SelectContent>
              </Select>

              {fieldErrors.land_use && (
                <p className="text-sm text-destructive">
                  {fieldErrors.land_use}
                </p>
              )}
            </div>

          </div>

          {/* Selected Land Size Preview */}
          {data.land_size && Number(data.land_size) > 0 && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
              <p className="text-sm text-muted-foreground">
                Land size to be saved
              </p>

              <p className="mt-1 text-xl font-semibold text-emerald-700 dark:text-emerald-400">
                {Number(data.land_size)}{" "}
                {data.land_size_unit === "sqm"
                  ? "sqm"
                  : data.land_size_unit === "acre"
                    ? Number(data.land_size) === 1
                      ? "acre"
                      : "acres"
                    : "hectares"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                The decimal value above will be stored directly in the database.
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isExisting ? (
                "Update Land Details"
              ) : (
                "Save Land Details"
              )}
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
