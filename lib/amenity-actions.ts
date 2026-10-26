
"use server";

import { createClient } from "@/lib/supabase/server";

export type Amenity = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  placement: "internal" | "external";
};

export type PropertyAmenitiesResult = {
  success: boolean;
  message: string;
  amenities?: Amenity[];
  selectedIds?: string[];
};

async function authorizeProperty(propertyId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      supabase,
      user: null,
      authorized: false,
    };
  }

  // Check the user's role using the existing users table.
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[PropertyAmenities] Profile lookup failed", {
      userId: user.id,
      error: profileError.message,
    });

    return {
      supabase,
      user,
      authorized: false,
    };
  }

  // Admins can manage any property.
  if (profile?.role === "admin") {
    return {
      supabase,
      user,
      authorized: true,
    };
  }

  // Agents can manage properties they own.
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id, user_id")
    .eq("id", propertyId)
    .maybeSingle();

  if (propertyError) {
    console.error("[PropertyAmenities] Property lookup failed", {
      propertyId,
      userId: user.id,
      error: propertyError.message,
    });

    return {
      supabase,
      user,
      authorized: false,
    };
  }

  return {
    supabase,
    user,
    authorized: property?.user_id === user.id,
  };
}

export async function getPropertyAmenities(
  propertyId: string
): Promise<PropertyAmenitiesResult> {
  if (!propertyId) {
    return {
      success: false,
      message: "Property ID is required.",
    };
  }

  try {
    const { supabase, authorized } =
      await authorizeProperty(propertyId);

    if (!authorized) {
      return {
        success: false,
        message: "You are not authorised to manage this property.",
      };
    }

    const [catalogueResult, selectedResult] = await Promise.all([
      supabase
        .from("amenities")
        .select("id, name, description, icon, placement")
        .order("name", { ascending: true }),

      supabase
        .from("property_amenities")
        .select("amenity_id")
        .eq("property_id", propertyId),
    ]);

    if (catalogueResult.error) {
      console.error("[PropertyAmenities] Catalogue query failed", {
        propertyId,
        error: catalogueResult.error.message,
      });

      return {
        success: false,
        message: "Unable to load the amenities catalogue.",
      };
    }

    if (selectedResult.error) {
      console.error("[PropertyAmenities] Association query failed", {
        propertyId,
        error: selectedResult.error.message,
      });

      return {
        success: false,
        message: "Unable to load the property's selected amenities.",
      };
    }

    return {
      success: true,
      message: "Amenities loaded.",
      amenities: (catalogueResult.data ?? []) as Amenity[],
      selectedIds: (selectedResult.data ?? []).map(
        (item) => item.amenity_id
      ),
    };
  } catch (error) {
    console.error("[PropertyAmenities] Load action failed", error);

    return {
      success: false,
      message: "An unexpected error occurred while loading amenities.",
    };
  }
}

export async function savePropertyAmenities(
  propertyId: string,
  requestedIds: string[]
): Promise<PropertyAmenitiesResult> {
  if (!propertyId) {
    return {
      success: false,
      message: "Property ID is required.",
    };
  }

  if (
    !Array.isArray(requestedIds) ||
    requestedIds.length > 500 ||
    requestedIds.some((id) => typeof id !== "string") ||
    new Set(requestedIds).size !== requestedIds.length
  ) {
    return {
      success: false,
      message: "The selected amenities are invalid.",
    };
  }

  try {
    const { supabase, authorized, user } =
      await authorizeProperty(propertyId);

    if (!authorized || !user) {
      return {
        success: false,
        message: "You are not authorised to edit this property.",
      };
    }

    // Confirm every requested ID exists in the catalogue.
    if (requestedIds.length > 0) {
      const { data: validAmenities, error: validationError } =
        await supabase
          .from("amenities")
          .select("id")
          .in("id", requestedIds);

      if (validationError) {
        console.error("[PropertyAmenities] Validation failed", {
          propertyId,
          error: validationError.message,
        });

        return {
          success: false,
          message: "Unable to validate the selected amenities.",
        };
      }

      if ((validAmenities?.length ?? 0) !== requestedIds.length) {
        return {
          success: false,
          message: "Some selected amenities do not exist.",
        };
      }
    }

    const { data: currentRows, error: currentError } = await supabase
      .from("property_amenities")
      .select("amenity_id")
      .eq("property_id", propertyId);

    if (currentError) {
      console.error("[PropertyAmenities] Current selection failed", {
        propertyId,
        error: currentError.message,
      });

      return {
        success: false,
        message: "Unable to read the current property amenities.",
      };
    }

    const currentIds = new Set(
      (currentRows ?? []).map((row) => row.amenity_id)
    );
    const requestedSet = new Set(requestedIds);

    const additions = requestedIds.filter(
      (id) => !currentIds.has(id)
    );

    const removals = [...currentIds].filter(
      (id) => !requestedSet.has(id)
    );

    console.info("[PropertyAmenities] Save requested", {
      propertyId,
      userId: user.id,
      additions: additions.length,
      removals: removals.length,
    });

    // Add missing associations.
    if (additions.length > 0) {
      const { error: insertError } = await supabase
        .from("property_amenities")
        .insert(
          additions.map((amenityId) => ({
            property_id: propertyId,
            amenity_id: amenityId,
          }))
        );

      if (insertError) {
        console.error("[PropertyAmenities] Insert failed", {
          propertyId,
          error: insertError.message,
          code: insertError.code,
        });

        return {
          success: false,
          message: "Unable to add the selected amenities.",
        };
      }
    }

    // Remove deselected associations, not catalogue records.
    if (removals.length > 0) {
      const { error: deleteError } = await supabase
        .from("property_amenities")
        .delete()
        .eq("property_id", propertyId)
        .in("amenity_id", removals);

      if (deleteError) {
        console.error("[PropertyAmenities] Delete failed", {
          propertyId,
          error: deleteError.message,
          code: deleteError.code,
        });

        return {
          success: false,
          message:
            "Some changes may have been saved, but removals failed. Reload before retrying.",
        };
      }
    }

    console.info("[PropertyAmenities] Save completed", {
      propertyId,
      userId: user.id,
      selectedCount: requestedIds.length,
    });

    return {
      success: true,
      message: "Property amenities saved successfully.",
      selectedIds: requestedIds,
    };
  } catch (error) {
    console.error("[PropertyAmenities] Save action failed", error);

    return {
      success: false,
      message: "An unexpected error occurred while saving amenities.",
    };
  }
}
