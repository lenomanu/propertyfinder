"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";

import { PropertyFormData } from "@/app/types";

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

import Amenities from "./location-amenities";

import {
  getPropertyDetails,
  updatePropertyDetails,
} from "../actions";

interface PropertyDetailsProps {
  propertyId?: string;
}

interface ActionState {
  success: boolean;
  message?: string;
}

const initialActionState: ActionState = {
  success: false,
};

function NumberSelect({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={name}>
          <SelectValue
            placeholder={`Select ${label.toLowerCase()}`}
          />
        </SelectTrigger>

        <SelectContent>
          {Array.from({ length: 11 }, (_, index) => (
            <SelectItem
              key={index}
              value={String(index)}
            >
              {index}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Required because Radix Select does not submit
          a normal input value by itself */}
      <input
        type="hidden"
        name={name}
        value={value}
      />
    </div>
  );
}

function AreaUnitSelect({
  name,
  value,
  onChange,
  land = false,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  land?: boolean;
}) {
  return (
    <>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Unit" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="sqm">
            Square metres (m²)
          </SelectItem>

          <SelectItem value="sqft">
            Square feet (ft²)
          </SelectItem>

          {land && (
            <>
              <SelectItem value="acre">
                Acres
              </SelectItem>

              <SelectItem value="hectare">
                Hectares
              </SelectItem>
            </>
          )}
        </SelectContent>
      </Select>

      <input
        type="hidden"
        name={name}
        value={value}
      />
    </>
  );
}

export default function PropertyDetails({
  propertyId,
}: PropertyDetailsProps) {
  const router = useRouter();

  const [data, setData] =
    useState<PropertyFormData | null>(null);

  const [loading, setLoading] = useState(
    Boolean(propertyId)
  );

  const [state, formAction, isPending] = useActionState(
    updatePropertyDetails,
    initialActionState
  );

  /*
   * Load property when propertyId is available.
   */
  useEffect(() => {
    if (!propertyId) {
      setData(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProperty() {
      setLoading(true);

      const result = await getPropertyDetails(propertyId);

      if (cancelled) return;

      if (!result) {
        setData(null);
        setLoading(false);
        return;
      }

      setData(result);
      setLoading(false);
    }

    loadProperty();

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  /*
   * Move to GPS step after successful save.
   */
  useEffect(() => {
    if (state.success && propertyId) {
      router.push(
        `/agent/properties/${propertyId}/step/3`
      );
    }
  }, [state.success, propertyId, router]);

  /*
   * No property ID.
   */
  if (!propertyId) {
    return (
      <Card>
        <CardContent className="flex min-h-32 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Save the basic property information first
            before adding property details.
          </p>
        </CardContent>
      </Card>
    );
  }

  /*
   * Loading property.
   */
  if (loading || !data) {
    return (
      <Card>
        <CardContent className="flex min-h-32 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading property details...
          </p>
        </CardContent>
      </Card>
    );
  }

  const type = data.propertyType;

  return (
    <form action={formAction} className="space-y-6">
      {/* Server action needs the property ID */}
      <input
        type="hidden"
        name="propertyId"
        value={propertyId}
      />

      {/* PROPERTY TYPE */}
      <input
        type="hidden"
        name="propertyType"
        value={data.propertyType}
      />

      <div>
        <h2 className="text-xl font-semibold">
          Property Details
        </h2>

        <p className="text-sm text-muted-foreground">
          Add details specific to this type of property.
        </p>
      </div>

      {/* HOUSE */}
      {type === "house" && (
        <Card>
          <CardHeader>
            <CardTitle>House Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-5 md:grid-cols-3">
              <NumberSelect
                label="Bedrooms"
                name="bedrooms"
                value={data.bedrooms}
                onChange={(value) =>
                  setData((current) =>
                    current
                      ? {
                          ...current,
                          bedrooms: value,
                        }
                      : current
                  )
                }
              />

              <NumberSelect
                label="Bathrooms"
                name="bathrooms"
                value={data.bathrooms}
                onChange={(value) =>
                  setData((current) =>
                    current
                      ? {
                          ...current,
                          bathrooms: value,
                        }
                      : current
                  )
                }
              />

              <NumberSelect
                label="Car Ports"
                name="carPorts"
                value={data.carPorts}
                onChange={(value) =>
                  setData((current) =>
                    current
                      ? {
                          ...current,
                          carPorts: value,
                        }
                      : current
                  )
                }
              />
            </div>

            <div>
              <Label htmlFor="floorArea">
                Floor Area
              </Label>

              <div className="mt-2 grid grid-cols-[1fr_180px] gap-3">
                <Input
                  id="floorArea"
                  name="floorArea"
                  type="number"
                  placeholder="e.g. 180"
                  value={data.floorArea}
                  onChange={(e) =>
                    setData((current) =>
                      current
                        ? {
                            ...current,
                            floorArea: e.target.value,
                          }
                        : current
                    )
                  }
                />

                <AreaUnitSelect
                  name="floorAreaUnit"
                  value={data.floorAreaUnit}
                  onChange={(value) =>
                    setData((current) =>
                      current
                        ? {
                            ...current,
                            floorAreaUnit:
                              value as PropertyFormData["floorAreaUnit"],
                          }
                        : current
                    )
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="landSize">
                Land Size
              </Label>

              <div className="mt-2 grid grid-cols-[1fr_180px] gap-3">
                <Input
                  id="landSize"
                  name="landSize"
                  type="number"
                  placeholder="e.g. 0.25"
                  value={data.landSize}
                  onChange={(e) =>
                    setData((current) =>
                      current
                        ? {
                            ...current,
                            landSize: e.target.value,
                          }
                        : current
                    )
                  }
                />

                <AreaUnitSelect
                  name="landSizeUnit"
                  land
                  value={data.landSizeUnit}
                  onChange={(value) =>
                    setData((current) =>
                      current
                        ? {
                            ...current,
                            landSizeUnit:
                              value as PropertyFormData["landSizeUnit"],
                          }
                        : current
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* APARTMENT */}
      {type === "apartment" && (
        <Card>
          <CardHeader>
            <CardTitle>Apartment Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-5 md:grid-cols-3">
              <NumberSelect
                label="Bedrooms"
                name="bedrooms"
                value={data.bedrooms}
                onChange={(value) =>
                  setData((current) =>
                    current
                      ? {
                          ...current,
                          bedrooms: value,
                        }
                      : current
                  )
                }
              />

              <NumberSelect
                label="Bathrooms"
                name="bathrooms"
                value={data.bathrooms}
                onChange={(value) =>
                  setData((current) =>
                    current
                      ? {
                          ...current,
                          bathrooms: value,
                        }
                      : current
                  )
                }
              />

              <NumberSelect
                label="Car Ports"
                name="carPorts"
                value={data.carPorts}
                onChange={(value) =>
                  setData((current) =>
                    current
                      ? {
                          ...current,
                          carPorts: value,
                        }
                      : current
                  )
                }
              />
            </div>

            <div>
              <Label htmlFor="floorArea">
                Floor Area
              </Label>

              <div className="mt-2 grid grid-cols-[1fr_180px] gap-3">
                <Input
                  id="floorArea"
                  name="floorArea"
                  type="number"
                  placeholder="e.g. 95"
                  value={data.floorArea}
                  onChange={(e) =>
                    setData((current) =>
                      current
                        ? {
                            ...current,
                            floorArea: e.target.value,
                          }
                        : current
                    )
                  }
                />

                <AreaUnitSelect
                  name="floorAreaUnit"
                  value={data.floorAreaUnit}
                  onChange={(value) =>
                    setData((current) =>
                      current
                        ? {
                            ...current,
                            floorAreaUnit:
                              value as PropertyFormData["floorAreaUnit"],
                          }
                        : current
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LAND */}
      {type === "land" && (
        <Card>
          <CardHeader>
            <CardTitle>Land Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Land Type</Label>

              <Select
                value={data.landType}
                onValueChange={(value) =>
                  setData((current) =>
                    current
                      ? {
                          ...current,
                          landType:
                            value as PropertyFormData["landType"],
                        }
                      : current
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select land type" />
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

              <input
                type="hidden"
                name="landType"
                value={data.landType}
              />
            </div>

            <div>
              <Label htmlFor="landSize">
                Land Size
              </Label>

              <div className="mt-2 grid grid-cols-[1fr_180px] gap-3">
                <Input
                  id="landSize"
                  name="landSize"
                  type="number"
                  placeholder="e.g. 1.5"
                  value={data.landSize}
                  onChange={(e) =>
                    setData((current) =>
                      current
                        ? {
                            ...current,
                            landSize: e.target.value,
                          }
                        : current
                    )
                  }
                />

                <AreaUnitSelect
                  name="landSizeUnit"
                  land
                  value={data.landSizeUnit}
                  onChange={(value) =>
                    setData((current) =>
                      current
                        ? {
                            ...current,
                            landSizeUnit:
                              value as PropertyFormData["landSizeUnit"],
                          }
                        : current
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* COMMERCIAL */}
      {type === "commercial" && (
        <Card>
          <CardHeader>
            <CardTitle>
              Commercial Property Details
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="floorArea">
                Floor Area
              </Label>

              <div className="mt-2 grid grid-cols-[1fr_180px] gap-3">
                <Input
                  id="floorArea"
                  name="floorArea"
                  type="number"
                  placeholder="e.g. 500"
                  value={data.floorArea}
                  onChange={(e) =>
                    setData((current) =>
                      current
                        ? {
                            ...current,
                            floorArea: e.target.value,
                          }
                        : current
                    )
                  }
                />

                <AreaUnitSelect
                  name="floorAreaUnit"
                  value={data.floorAreaUnit}
                  onChange={(value) =>
                    setData((current) =>
                      current
                        ? {
                            ...current,
                            floorAreaUnit:
                              value as PropertyFormData["floorAreaUnit"],
                          }
                        : current
                    )
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="landSize">
                Land Size
              </Label>

              <div className="mt-2 grid grid-cols-[1fr_180px] gap-3">
                <Input
                  id="landSize"
                  name="landSize"
                  type="number"
                  placeholder="e.g. 1"
                  value={data.landSize}
                  onChange={(e) =>
                    setData((current) =>
                      current
                        ? {
                            ...current,
                            landSize: e.target.value,
                          }
                        : current
                    )
                  }
                />

                <AreaUnitSelect
                  name="landSizeUnit"
                  land
                  value={data.landSizeUnit}
                  onChange={(value) =>
                    setData((current) =>
                      current
                        ? {
                            ...current,
                            landSizeUnit:
                              value as PropertyFormData["landSizeUnit"],
                          }
                        : current
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AMENITIES */}
      <Amenities
        data={data}
        updateData={(values) =>
          setData((current) =>
            current
              ? {
                  ...current,
                  ...values,
                }
              : current
          )
        }
      />

      {/* ERROR */}
      {!state.success && state.message && (
        <p className="text-sm text-destructive">
          {state.message}
        </p>
      )}

      {/* SUBMIT */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : "Save & Continue"}
        </button>
      </div>
    </form>
  );
}