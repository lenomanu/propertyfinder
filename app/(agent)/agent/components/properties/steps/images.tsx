"use client";

import { Property } from "@/app/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ImagePlus } from "lucide-react";



interface PropertyImagesProps {
  property?: Property;
}

export default function PropertyImages({
  property,
}: PropertyImagesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          Property Images
        </h2>

        <p className="text-sm text-muted-foreground">
          Add high-quality images of the property.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Gallery</CardTitle>

          <p className="text-sm text-muted-foreground">
            The first image will be used as the main
            property image.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Main image */}
            <div className="group relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 transition-colors hover:bg-muted">
              <ImagePlus className="mb-3 h-10 w-10 text-muted-foreground" />

              <p className="font-medium">
                Main Image
              </p>

              <p className="text-xs text-muted-foreground">
                Click to upload
              </p>

              <div className="absolute left-3 top-3 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">
                Main
              </div>
            </div>

            {/* Other images */}
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 transition-colors hover:bg-muted"
              >
                <ImagePlus className="mb-3 h-8 w-8 text-muted-foreground" />

                <p className="text-sm font-medium">
                  Image {index + 2}
                </p>

                <p className="text-xs text-muted-foreground">
                  Click to upload
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}