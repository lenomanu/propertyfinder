
"use server";

import { createClient } from "./supabase/server";

export type LandDetailsFormData = {
  land_size: string;
  land_size_unit: string;
  land_use: string;
};

export type LandDetails = {
  id: string;
  property_id: string;
  land_size: number;
  land_size_unit: string;
  land_use: "residential" | "commercial";
  created_at: string;
  updated_at: string;
};

export type LandDetailsActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

/**
 * Get existing land details for a property.
 */
export async function getLandDetails(
  propertyId: string
): Promise<LandDetails | null> {
  try {
    if (!propertyId) {
      throw new Error("Property ID is required.");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("land_details")
      .select(`
        id,
        property_id,
        land_size,
        land_size_unit,
        land_use,
        created_at,
        updated_at
      `)
      .eq("property_id", propertyId)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch land details:", {
        propertyId,
        error,
      });

      throw new Error("Failed to fetch land details.");
    }

    return data as LandDetails | null;
  } catch (error) {
    console.error("Unexpected error fetching land details:", {
      propertyId,
      error,
    });

    throw new Error("Unable to load land details.");
  }
}

/**
 * Validate land details before saving.
 */
function validateLandDetails(data: LandDetailsFormData) {
  const errors: Record<string, string> = {};

  const landSize = Number(data.land_size);

  const validUnits = ["sqm", "acre", "hectare"];
  const validLandUses = ["residential", "commercial"];

  if (
    data.land_size.trim() === "" ||
    !Number.isFinite(landSize) ||
    landSize <= 0
  ) {
    errors.land_size = "Please enter a valid land size.";
  }

  if (!validUnits.includes(data.land_size_unit)) {
    errors.land_size_unit = "Please select a valid land size unit.";
  }

  if (!validLandUses.includes(data.land_use)) {
    errors.land_use = "Please select a valid land use.";
  }

  return {
    errors,
    values: {
      land_size: landSize,
      land_size_unit: data.land_size_unit,
      land_use: data.land_use,
    },
  };
}

/**
 * Create or update land details.
 */
export async function saveLandDetails(
  propertyId: string,
  formData: LandDetailsFormData
): Promise<LandDetailsActionState> {
  try {
    if (!propertyId) {
      return {
        success: false,
        message: "We couldn't identify this property.",
      };
    }

    const validation = validateLandDetails(formData);

    if (Object.keys(validation.errors).length > 0) {
      return {
        success: false,
        message: "Please check the highlighted fields.",
        errors: validation.errors,
      };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("land_details")
      .upsert(
        {
          property_id: propertyId,
          ...validation.values,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "property_id",
        }
      );

    if (error) {
      console.error("Failed to save land details:", {
        propertyId,
        error,
      });

      return {
        success: false,
        message: "We couldn't save the land details. Please try again.",
      };
    }

    return {
      success: true,
      message: "Land details saved successfully.",
    };
  } catch (error) {
    console.error("Unexpected error saving land details:", {
      propertyId,
      error,
    });

    return {
      success: false,
      message: "Something went wrong while saving. Please try again.",
    };
  }
}
