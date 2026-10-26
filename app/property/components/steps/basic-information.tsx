"use client";

import { useEffect, useRef, useState } from "react";

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

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import {
  createProperty,
  getProperty,
  PropertyFormData,
  updateProperty,
} from "@/lib/proerties-actions";

interface BasicDetailsProps {
  propertyId: string | null;
  setPropertyId: (id: string) => void;
  propertyType: string;
  setPropertyType: (type: string) => void;
}

const emptyProperty: PropertyFormData = {
  title: "",
  propertyType: "",
  listingType: "",
  price: "",
  pricePeriod: "",
  currency: "KES",
  description: "",
  locality: "",
  nearestTown: "",
  county: "",
  latitude: "",
  longitude: "",
};

export default function BasicDetails({
  propertyId,
  setPropertyId,
  setPropertyType,
}: BasicDetailsProps) {
  const [data, setData] =
    useState<PropertyFormData>(emptyProperty);

  const descriptionRef =
    useRef<HTMLTextAreaElement>(null);

  /**
   * The ID can initially be null.
   *
   * After creating a property, we store the
   * returned ID here so the same component
   * switches from ADD mode to UPDATE mode.
   */
  const [currentPropertyId, setCurrentPropertyId] =
    useState<string | null>(propertyId);

  const [loading, setLoading] = useState(
    Boolean(propertyId)
  );

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /**
   * Automatically resize the description textarea
   * whenever the description changes.
   *
   * This makes the textarea grow when typing and
   * also correctly size itself when editing an
   * existing property.
   */
  useEffect(() => {
    const textarea = descriptionRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [data.description]);

  /**
   * Load the property when an ID is provided.
   */
  useEffect(() => {
    if (!propertyId) {
      setData(emptyProperty);
      setCurrentPropertyId(null);
      setLoading(false);

      return;
    }

    const id = propertyId;

    async function loadProperty() {
      setLoading(true);
      setError("");

      const result = await getProperty(id);

      if (!result.success || !result.data) {
        setError(
          result.message ||
            "Failed to load property."
        );

        setLoading(false);

        return;
      }

      setData(result.data);

      // Sync the property type to the parent
      setPropertyType(result.data.propertyType);

      setCurrentPropertyId(
        result.propertyId ?? propertyId
      );

      setLoading(false);
    }

    loadProperty();
  }, [propertyId, setPropertyType]);

  function updateData(
    values: Partial<PropertyFormData>
  ) {
    setData((previous) => ({
      ...previous,
      ...values,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      /**
       * No ID = CREATE
       */
      if (!currentPropertyId) {
        const result = await createProperty(data);

        if (!result.success) {
          setError(result.message);

          return;
        }

        /**
         * Save the newly created ID in state.
         *
         * From this point onward the button
         * becomes "Update Property".
         */
        if (result.propertyId) {
          setCurrentPropertyId(result.propertyId);
          setPropertyId(result.propertyId);
        }

        // Sync the property type to the parent
        setPropertyType(data.propertyType);

        setMessage(
          result.message ||
            "Property added successfully."
        );

        return;
      }

      /**
       * ID exists = UPDATE
       */
      const result = await updateProperty(
        currentPropertyId,
        data
      );

      if (!result.success) {
        setError(result.message);

        return;
      }

      // Keep parent in sync if the type was changed
      setPropertyType(data.propertyType);

      setMessage(
        result.message ||
          "Property updated successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">
            Basic Property Details
          </h2>

          <p className="text-sm text-muted-foreground">
            Loading property information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold">
          Basic Property Details
        </h2>

        <p className="text-sm text-muted-foreground">
          Enter the main information about the
          property.
        </p>
      </div>

      {/* Property Information */}

      <Card>
        <CardHeader>
          <CardTitle>
            Property Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Title */}

          <div className="space-y-2">
            <Label htmlFor="title">
              Property Title
            </Label>

            <Input
              id="title"
              name="title"
              placeholder="e.g. Modern 3 Bedroom House"
              value={data.title}
              onChange={(event) =>
                updateData({
                  title: event.target.value,
                })
              }
            />
          </div>

          {/* Property Type + Listing Type */}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Property Type</Label>

              <Select
                value={data.propertyType}
                onValueChange={(value) =>
                  updateData({
                    propertyType:
                      value as PropertyFormData["propertyType"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="house">
                    House
                  </SelectItem>
                  <SelectItem value="villa">
                    Villa
                  </SelectItem>

                  <SelectItem value="plot">
                    Plot
                  </SelectItem>
                  <SelectItem value="land">
                    Land
                  </SelectItem>
                  <SelectItem value="apartment">
                    Apartment
                  </SelectItem>

                  <SelectItem value="commercial">
                    Commercial Property
                  </SelectItem>
                  <SelectItem value="warehouse">
                    Warehouse
                  </SelectItem>
                  <SelectItem value="office">
                    Office
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Listing Type</Label>

              <Select
                value={data.listingType}
                onValueChange={(value) =>
                  updateData({
                    listingType:
                      value as PropertyFormData["listingType"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="sale">
                    For Sale
                  </SelectItem>

                  <SelectItem value="rent">
                    For Rent
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price */}

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="price">
                Price
              </Label>

              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                placeholder="0"
                value={data.price}
                onChange={(event) =>
                  updateData({
                    price: event.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>

              <Select
                value={data.currency}
                onValueChange={(value) =>
                  updateData({
                    currency:
                      value as PropertyFormData["currency"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="KES">
                    KES
                  </SelectItem>

                  <SelectItem value="USD">
                    USD
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rental Period */}

          {data.listingType === "rent" && (
            <div className="space-y-2">
              <Label>Rental Period</Label>

              <Select
                value={data.pricePeriod}
                onValueChange={(value) =>
                  updateData({
                    pricePeriod:
                      value as PropertyFormData["pricePeriod"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rental period" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="daily">
                    Daily
                  </SelectItem>

                  <SelectItem value="weekly">
                    Weekly
                  </SelectItem>

                  <SelectItem value="monthly">
                    Monthly
                  </SelectItem>

                  <SelectItem value="yearly">
                    Yearly
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}

          <div className="space-y-2">
            <Label htmlFor="description">
              Description
            </Label>

            <Textarea
              ref={descriptionRef}
              id="description"
              name="description"
              placeholder="Describe the property..."
              value={data.description}
              className="resize-none overflow-hidden"
              onChange={(event) =>
                updateData({
                  description: event.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Property Address */}

      <Card>
        <CardHeader>
          <CardTitle>
            Property Address
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* County */}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="county">
                County
              </Label>

              <Input
                id="county"
                name="county"
                placeholder="Uasin Gishu"
                value={data.county}
                onChange={(event) =>
                  updateData({
                    county: event.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Town + Locality */}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nearestTown">
                Nearest Town
              </Label>

              <Input
                id="nearestTown"
                name="nearestTown"
                placeholder="Eldoret"
                value={data.nearestTown}
                onChange={(event) =>
                  updateData({
                    nearestTown:
                      event.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="locality">
                Locality
              </Label>

              <Input
                id="locality"
                name="locality"
                placeholder="Kapsoya"
                value={data.locality}
                onChange={(event) =>
                  updateData({
                    locality:
                      event.target.value,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-md border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Action */}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? currentPropertyId
              ? "Updating..."
              : "Adding..."
            : currentPropertyId
              ? "Update Property"
              : "Add Property"}
        </Button>
      </div>
    </form>
  );
}