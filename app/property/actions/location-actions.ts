
"use server";

import { createClient } from "@/lib/supabase/server";

export type PropertyLocation = {
  latitude: number | null;
  longitude: number | null;
};

export async function getPropertyLocation(
  propertyId: string
) {
  if (!propertyId) {
    return { success: false as const, error: "Property ID is required." };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false as const, error: "Please sign in." };
  }

  const { data, error } = await supabase
    .from("properties")
    .select("id, latitude, longitude")
    .eq("id", propertyId)
    .maybeSingle();

  if (error) {
    console.error("[getPropertyLocation]", error);
    return {
      success: false as const,
      error: "Unable to load the property location.",
    };
  }

  if (!data) {
    return {
      success: false as const,
      error: "Property not found or access denied.",
    };
  }

  return {
    success: true as const,
    location: {
      latitude:
        data.latitude === null
          ? null
          : Number(data.latitude),
      longitude:
        data.longitude === null
          ? null
          : Number(data.longitude),
    },
  };
}

export async function savePropertyLocation(
  propertyId: string,
  latitude: number,
  longitude: number
) {
  if (!propertyId) {
    return { success: false as const, error: "Property ID is required." };
  }

  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    return {
      success: false as const,
      error: "Please select valid coordinates.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false as const, error: "Please sign in." };
  }

  // RLS must authorize this user to update this property.
  const { data, error } = await supabase
    .from("properties")
    .update({
      latitude,
      longitude,
      updated_at: new Date().toISOString(),
    })
    .eq("id", propertyId)
    .select("id, latitude, longitude")
    .maybeSingle();

  if (error) {
    console.error("[savePropertyLocation]", {
      propertyId,
      userId: user.id,
      error,
    });

    return {
      success: false as const,
      error: "Unable to save the location. Check your permissions.",
    };
  }

  if (!data) {
    return {
      success: false as const,
      error: "Property not found or you do not have permission to edit it.",
    };
  }

  return {
    success: true as const,
    location: {
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
    },
  };
}
