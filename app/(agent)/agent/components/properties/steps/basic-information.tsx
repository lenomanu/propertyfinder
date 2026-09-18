"use client";

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

import { Textarea } from "@/components/ui/textarea";



interface BasicDetailsProps {
  data: PropertyFormData;
  updateData: (
    values: Partial<PropertyFormData>
  ) => void;
}

export default function BasicDetails({
  data,
  updateData,
}: BasicDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          Basic Property Details
        </h2>

        <p className="text-sm text-muted-foreground">
          Enter the main information about the property.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Property Title
            </Label>

            <Input
              id="title"
              placeholder="e.g. Modern 3 Bedroom House"
              value={data.title}
              onChange={(e) =>
                updateData({
                  title: e.target.value,
                })
              }
            />
          </div>

          {/* Type + Listing */}
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

                  <SelectItem value="apartment">
                    Apartment
                  </SelectItem>

                  <SelectItem value="land">
                    Land
                  </SelectItem>

                  <SelectItem value="commercial">
                    Commercial
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
              <Label htmlFor="price">Price</Label>

              <Input
                id="price"
                type="number"
                min="0"
                placeholder="0"
                value={data.price}
                onChange={(e) =>
                  updateData({
                    price: e.target.value,
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
                    currency: value as PropertyFormData["currency"],
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

          {/* Rental period */}
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
              id="description"
              placeholder="Describe the property..."
              rows={6}
              value={data.description}
              onChange={(e) =>
                updateData({
                  description: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Property Address</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">

            <div className="space-y-2">
              <Label>County</Label>

              <Input
                placeholder="Uasin Gishu"
                value={data.county}
                onChange={(e) =>
                  updateData({
                    county: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nearest Town</Label>

              <Input
                placeholder="Eldoret"
                value={data.nearestTown}
                onChange={(e) =>
                  updateData({
                    nearestTown: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Locality</Label>

              <Input
                placeholder="Kapsoya"
                value={data.locality}
                onChange={(e) =>
                  updateData({
                    locality: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}