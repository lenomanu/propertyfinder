"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyFormData } from "../property-form.";



type Props = {
  data: PropertyFormData;
  updateForm: (values: Partial<PropertyFormData>) => void;
};

export function BasicInformation({ data, updateForm }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Title */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Property Title</Label>

          <Input
            id="title"
            placeholder="e.g. Modern 4 Bedroom House"
            value={data.title}
            onChange={(e) =>
              updateForm({
                title: e.target.value,
              })
            }
          />
        </div>

        {/* Property type */}
        <div className="space-y-2">
          <Label>Property Type</Label>

          <Select
            value={data.propertyType ?? ""}
            onValueChange={(value) =>
              updateForm({
                propertyType: value as PropertyFormData["propertyType"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="commercial">
                Commercial Property
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Listing type */}
        <div className="space-y-2">
          <Label>Listing Type</Label>

          <Select
            value={data.listingType ?? ""}
            onValueChange={(value) =>
              updateForm({
                listingType:
                  value as PropertyFormData["listingType"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select listing type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>

          <Input
            id="price"
            type="number"
            min="0"
            placeholder="0"
            value={data.price}
            onChange={(e) =>
              updateForm({
                price: e.target.value,
              })
            }
          />
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label>Currency</Label>

          <Select
            value={data.currency ?? "KES"}
            onValueChange={(value) =>
              updateForm({
                currency: value as PropertyFormData["currency"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="KES">KES</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price period */}
        {data.listingType === "rent" && (
          <div className="space-y-2">
            <Label>Rental Period</Label>

            <Select
              value={data.pricePeriod ?? ""}
              onValueChange={(value) =>
                updateForm({
                  pricePeriod:
                    value as PropertyFormData["pricePeriod"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">
            About the Property
          </Label>

          <Textarea
            id="description"
            placeholder="Describe the property..."
            className="min-h-32 resize-none"
            value={data.description}
            onChange={(e) =>
              updateForm({
                description: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}