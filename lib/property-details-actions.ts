"use server";

import { createClient } from "./supabase/server";





export type PropertyDetailsFormData = {
  land_size: string;
  land_size_unit: string;
  bedrooms: string;
  bathrooms: string;
  car_ports: string;
  floor_area: string;
  floor_area_unit: string;
  floors: string;
  year_built: string;
  furnished: boolean;
};

export type PropertyDetails = {
  id: string;
  property_id: string;
  land_size: number;
  land_size_unit: string;
  bedrooms: number;
  bathrooms: number;
  car_ports: number;
  floor_area: number;
  floor_area_unit: string;
  floors: number;
  year_built: number;
  furnished: boolean;
};

export type PropertyDetailsActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

/**
 * Get existing property details.
 */
export async function getPropertyDetails(
  propertyId: string
): Promise<PropertyDetails | null> {
  try {
    if (!propertyId) {
      throw new Error("Property ID is required.");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("property_details")
      .select(`
        id,
        property_id,
        land_size,
        land_size_unit,
        bedrooms,
        bathrooms,
        car_ports,
        floor_area,
        floor_area_unit,
        floors,
        year_built,
        furnished
      `)
      .eq("property_id", propertyId)
      .maybeSingle();

    if (error) {
      console.error(
        "Failed to fetch property details:",
        {
          propertyId,
          error,
        }
      );

      throw new Error(
        "Failed to fetch property details."
      );
    }

    return data;
  } catch (error) {
    console.error(
      "Unexpected error fetching property details:",
      {
        propertyId,
        error,
      }
    );

    throw new Error(
      "Unable to load property details."
    );
  }
}

/**
 * Validate property details before saving.
 */
function validatePropertyDetails(
  data: PropertyDetailsFormData
) {
  const errors: Record<string, string> = {};

  const landSize = Number(data.land_size);
  const bedrooms = Number(data.bedrooms);
  const bathrooms = Number(data.bathrooms);
  const carPorts = Number(data.car_ports);
  const floorArea = Number(data.floor_area);
  const floors = Number(data.floors);
  const yearBuilt = Number(data.year_built);

  if (
    data.land_size === "" ||
    Number.isNaN(landSize) ||
    landSize <= 0
  ) {
    errors.land_size =
      "Please enter the land size.";
  }

  if (!data.land_size_unit) {
    errors.land_size_unit =
      "Please select the land size unit.";
  }

  if (
    data.bedrooms === "" ||
    Number.isNaN(bedrooms) ||
    bedrooms < 0
  ) {
    errors.bedrooms =
      "Please select the number of bedrooms.";
  }

  if (
    data.bathrooms === "" ||
    Number.isNaN(bathrooms) ||
    bathrooms < 0
  ) {
    errors.bathrooms =
      "Please select the number of bathrooms.";
  }

  if (
    data.car_ports === "" ||
    Number.isNaN(carPorts) ||
    carPorts < 0
  ) {
    errors.car_ports =
      "Please select the number of car ports.";
  }

  if (
    data.floor_area === "" ||
    Number.isNaN(floorArea) ||
    floorArea <= 0
  ) {
    errors.floor_area =
      "Please enter the floor area.";
  }

  if (!data.floor_area_unit) {
    errors.floor_area_unit =
      "Please select the floor area unit.";
  }

  if (
    data.floors === "" ||
    Number.isNaN(floors) ||
    floors <= 0
  ) {
    errors.floors =
      "Please select the number of floors.";
  }

  if (
    data.year_built === "" ||
    Number.isNaN(yearBuilt) ||
    yearBuilt < 1000 ||
    yearBuilt > new Date().getFullYear()
  ) {
    errors.year_built =
      "Please enter a valid year.";
  }

  return {
    errors,

    values: {
      land_size: landSize,
      land_size_unit: data.land_size_unit,
      bedrooms,
      bathrooms,
      car_ports: carPorts,
      floor_area: floorArea,
      floor_area_unit: data.floor_area_unit,
      floors,
      year_built: yearBuilt,
      furnished: data.furnished,
    },
  };
}

/**
 * Create or update property details.
 */
export async function savePropertyDetails(
  propertyId: string,
  formData: PropertyDetailsFormData
): Promise<PropertyDetailsActionState> {
  try {
    if (!propertyId) {
      console.error(
        "savePropertyDetails: property ID is missing."
      );

      return {
        success: false,
        message:
          "We couldn't identify this property.",
      };
    }

    const validation =
      validatePropertyDetails(formData);

    if (
      Object.keys(validation.errors).length > 0
    ) {
      return {
        success: false,
        message:
          "Please check the highlighted fields.",
        errors: validation.errors,
      };
    }

    const supabase = await createClient();

    /*
     * Check whether details already exist.
     */
    const {
      data: existingDetails,
      error: lookupError,
    } = await supabase
      .from("property_details")
      .select("id")
      .eq("property_id", propertyId)
      .maybeSingle();

    if (lookupError) {
      console.error(
        "Failed to check existing property details:",
        {
          propertyId,
          error: lookupError,
        }
      );

      return {
        success: false,
        message:
          "We couldn't save the property details. Please try again.",
      };
    }

    /*
     * UPDATE existing record.
     */
    if (existingDetails) {
      const { error: updateError } =
        await supabase
          .from("property_details")
          .update(validation.values)
          .eq("id", existingDetails.id);

      if (updateError) {
        console.error(
          "Failed to update property details:",
          {
            propertyId,
            propertyDetailsId:
              existingDetails.id,
            error: updateError,
          }
        );

        return {
          success: false,
          message:
            "We couldn't update the property details. Please try again.",
        };
      }

      return {
        success: true,
        message:
          "Property details updated successfully.",
      };
    }

    /*
     * INSERT new record.
     */
    const { error: insertError } =
      await supabase
        .from("property_details")
        .insert({
          property_id: propertyId,
          ...validation.values,
        });

    if (insertError) {
      console.error(
        "Failed to create property details:",
        {
          propertyId,
          error: insertError,
        }
      );

      return {
        success: false,
        message:
          "We couldn't save the property details. Please try again.",
      };
    }

    return {
      success: true,
      message:
        "Property details saved successfully.",
    };
  } catch (error) {
    console.error(
      "Unexpected error saving property details:",
      {
        propertyId,
        error,
      }
    );

    return {
      success: false,
      message:
        "Something went wrong while saving. Please try again.",
    };
  }
}