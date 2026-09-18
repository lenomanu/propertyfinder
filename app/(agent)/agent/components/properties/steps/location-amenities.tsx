"use client";

import { Amenity, PropertyFormData } from "@/app/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";



interface AmenitiesProps {
  data: PropertyFormData;
  updateData: (
    values: Partial<PropertyFormData>
  ) => void;
}

const amenities: Amenity[] = [
  "Alarm System",
  "Backup Generator",
  "En-Suite Bathroom",
  "Fibre Internet",
  "Serviced",
  "Balcony",
  "Borehole",
  "CCTV",
  "Garden",
  "Gym",
  "Lift/Elevator",
  "Parking",
];

export default function Amenities({
  data,
  updateData,
}: AmenitiesProps) {
  const toggleAmenity = (amenity: Amenity) => {
    const exists = data.amenities.includes(amenity);

    updateData({
      amenities: exists
        ? data.amenities.filter(
            (item) => item !== amenity
          )
        : [...data.amenities, amenity],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities</CardTitle>

        <p className="text-sm text-muted-foreground">
          Select the features available at this property.
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((amenity) => {
            const checked =
              data.amenities.includes(amenity);

            return (
              <div
                key={amenity}
                className="flex items-center space-x-3 rounded-lg border p-4"
              >
                <Checkbox
                  id={amenity}
                  checked={checked}
                  onCheckedChange={() =>
                    toggleAmenity(amenity)
                  }
                />

                <Label
                  htmlFor={amenity}
                  className="cursor-pointer font-normal"
                >
                  {amenity}
                </Label>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}