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

import { MapPin } from "lucide-react";


interface GpsLocationProps {
  data: PropertyFormData;
  updateData: (
    values: Partial<PropertyFormData>
  ) => void;
}

export default function GpsLocation({
  data,
  updateData,
}: GpsLocationProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          Property GPS Location
        </h2>

        <p className="text-sm text-muted-foreground">
          Locate the property on the map. The exact
          coordinates will be saved with the listing.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Locate Property</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="location-search">
              Search Location
            </Label>

            <Input
              id="location-search"
              placeholder="Search for a town, street or location..."
            />
          </div>

          {/* Map */}
          <div className="relative min-h-[550px] overflow-hidden rounded-xl border bg-muted">
            {/* Map placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background shadow">
                  <MapPin className="h-7 w-7" />
                </div>

                <div>
                  <p className="font-medium">
                    Map goes here
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Click on the map to place the property
                    location.
                  </p>
                </div>
              </div>
            </div>

            {/* Fake marker */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
              <MapPin className="h-10 w-10 fill-current" />
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">
                Latitude
              </Label>

              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="-0.4254"
                value={data.latitude}
                onChange={(e) =>
                  updateData({
                    latitude: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">
                Longitude
              </Label>

              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="36.9498"
                value={data.longitude}
                onChange={(e) =>
                  updateData({
                    longitude: e.target.value,
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