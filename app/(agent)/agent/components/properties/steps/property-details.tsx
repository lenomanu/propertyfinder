"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export function PropertyDetails({ data, updateForm }: Props) {
  const isResidential =
    data.propertyType === "house" ||
    data.propertyType === "apartment";

  if (data.propertyType === "land") {
    return <LandDetails data={data} updateForm={updateForm} />;
  }

  if (isResidential) {
    return (
      <ResidentialDetails
        data={data}
        updateForm={updateForm}
      />
    );
  }

  if (data.propertyType === "commercial") {
    return (
      <CommercialDetails
        data={data}
        updateForm={updateForm}
      />
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      Select a property type to continue.
    </p>
  );
}

function ResidentialDetails({ data, updateForm }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <NumberSelect
        label="Bedrooms"
        value={data.bedrooms}
        onChange={(value) =>
          updateForm({ bedrooms: value })
        }
      />

      <NumberSelect
        label="Bathrooms"
        value={data.bathrooms}
        onChange={(value) =>
          updateForm({ bathrooms: value })
        }
      />

      <NumberSelect
        label={
          data.propertyType === "apartment"
            ? "Parking Spaces"
            : "Car Ports"
        }
        value={data.carPorts}
        onChange={(value) =>
          updateForm({ carPorts: value })
        }
      />

      <div className="space-y-2">
        <Label>Floor Area</Label>

        <div className="flex gap-2">
          <Input
            type="number"
            min="0"
            placeholder="e.g. 180"
            value={data.floorArea}
            onChange={(e) =>
              updateForm({
                floorArea: e.target.value,
              })
            }
          />

          <Select
            value={data.floorAreaUnit}
            onValueChange={(value) =>
              updateForm({
                floorAreaUnit:
                  value as PropertyFormData["floorAreaUnit"],
              })
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="sqm">m²</SelectItem>
              <SelectItem value="sqft">ft²</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {data.propertyType === "house" && (
        <div className="space-y-2 md:col-span-2">
          <Label>Land Size</Label>

          <div className="flex gap-2">
            <Input
              type="number"
              min="0"
              placeholder="e.g. 500"
              value={data.landSize}
              onChange={(e) =>
                updateForm({
                  landSize: e.target.value,
                })
              }
            />

            <Select
              value={data.landSizeUnit}
              onValueChange={(value) =>
                updateForm({
                  landSizeUnit:
                    value as PropertyFormData["landSizeUnit"],
                })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="sqm">m²</SelectItem>
                <SelectItem value="sqft">ft²</SelectItem>
                <SelectItem value="acre">Acres</SelectItem>
                <SelectItem value="hectare">Hectares</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

function LandDetails({ data, updateForm }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Land Type</Label>

        <Select
          value={data.landType}
          onValueChange={(value) =>
            updateForm({
              landType:
                value as PropertyFormData["landType"],
            })
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
      </div>

      <div className="space-y-2">
        <Label>Land Size</Label>

        <div className="flex gap-2">
          <Input
            type="number"
            min="0"
            value={data.landSize}
            onChange={(e) =>
              updateForm({
                landSize: e.target.value,
              })
            }
          />

          <Select
            value={data.landSizeUnit}
            onValueChange={(value) =>
              updateForm({
                landSizeUnit:
                  value as PropertyFormData["landSizeUnit"],
              })
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="sqm">m²</SelectItem>
              <SelectItem value="sqft">ft²</SelectItem>
              <SelectItem value="acre">Acres</SelectItem>
              <SelectItem value="hectare">
                Hectares
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function CommercialDetails({ data, updateForm }: Props) {
  return (
    <div className="space-y-2">
      <Label>Property Size</Label>

      <div className="flex gap-2">
        <Input
          type="number"
          min="0"
          placeholder="e.g. 500"
          value={data.floorArea}
          onChange={(e) =>
            updateForm({
              floorArea: e.target.value,
            })
          }
        />

        <Select
          value={data.floorAreaUnit}
          onValueChange={(value) =>
            updateForm({
              floorAreaUnit:
                value as PropertyFormData["floorAreaUnit"],
            })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="sqm">m²</SelectItem>
            <SelectItem value="sqft">ft²</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function NumberSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>

        <SelectContent>
          {Array.from({ length: 11 }, (_, i) => (
            <SelectItem key={i} value={String(i)}>
              {i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}