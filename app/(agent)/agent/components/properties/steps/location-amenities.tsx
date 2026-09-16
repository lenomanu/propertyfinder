"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PropertyFormData } from "../property-form.";


type Props = {
  data: PropertyFormData;
  updateForm: (values: Partial<PropertyFormData>) => void;
};

const AMENITIES = [
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

export function LocationAmenities({ data, updateForm }: Props) {
  const toggleAmenity = (amenity: string) => {
    const exists = data.amenities.includes(amenity);

    updateForm({
      amenities: exists
        ? data.amenities.filter((item) => item !== amenity)
        : [...data.amenities, amenity],
    });
  };

  return (
    <div className="space-y-8">
      {/* Location */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Property Location</h3>
          <p className="text-sm text-muted-foreground">
            Enter the property location.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Locality</Label>
            <Input
              placeholder="e.g. Langas"
              value={data.locality}
              onChange={(e) =>
                updateForm({
                  locality: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Nearest Town</Label>
            <Input
              placeholder="e.g. Eldoret"
              value={data.nearestTown}
              onChange={(e) =>
                updateForm({
                  nearestTown: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>County</Label>
            <Input
              placeholder="e.g. Uasin Gishu"
              value={data.county}
              onChange={(e) =>
                updateForm({
                  county: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Map placeholder */}
        <div className="flex min-h-72 items-center justify-center rounded-lg border bg-muted/30">
          <div className="text-center">
            <p className="font-medium">Property Map</p>
            <p className="text-sm text-muted-foreground">
              Map / location picker goes here
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Latitude</Label>
            <Input
              type="number"
              step="any"
              placeholder="-0.5143"
              value={data.latitude}
              onChange={(e) =>
                updateForm({
                  latitude: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Longitude</Label>
            <Input
              type="number"
              step="any"
              placeholder="35.2697"
              value={data.longitude}
              onChange={(e) =>
                updateForm({
                  longitude: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Amenities</h3>
          <p className="text-sm text-muted-foreground">
            Select all amenities available at the property.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {AMENITIES.map((amenity) => {
            const checked = data.amenities.includes(amenity);

            return (
              <label
                key={amenity}
                className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-muted/50"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() =>
                    toggleAmenity(amenity)
                  }
                />

                <span className="text-sm">{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}