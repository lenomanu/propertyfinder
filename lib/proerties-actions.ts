"use server";

import { createClient } from "./supabase/server";



export type PropertyFormData = {
  title: string;
  propertyType:
    | "house"
    | "apartment"
    | "land"
    | "commercial"
    | "";
  listingType: "sale" | "rent" | "";
  price: string;
  pricePeriod:
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "";
  currency: "KES" | "USD";
  description: string;

  locality: string;
  nearestTown: string;
  county: string;

  latitude: string;
  longitude: string;
};

export type PropertyActionResult = {
  success: boolean;
  message: string;
  propertyId?: string;
  data?: PropertyFormData;
};

function generateSlug(title: string) {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
}

/**
 * Get a property by ID
 */
export async function getProperty(
  propertyId: string,
): Promise<PropertyActionResult> {
  const supabase = await createClient();

  const { data: property, error } = await supabase
    .from("properties")
    .select(`
      id,
      title,
      property_type,
      listing_type,
      price,
      price_period,
      currency,
      description,
      locality,
      nearest_town,
      county,
      latitude,
      longitude
    `)
    .eq("id", propertyId)
    .single();

  if (error || !property) {
    return {
      success: false,
      message: error?.message ?? "Property not found.",
    };
  }

  return {
    success: true,
    message: "Property loaded successfully.",
    propertyId: property.id,
    data: {
      title: property.title ?? "",
      propertyType: property.property_type ?? "",
      listingType: property.listing_type ?? "",
      price: property.price?.toString() ?? "",
      pricePeriod: property.price_period ?? "",
      currency: property.currency ?? "KES",
      description: property.description ?? "",

      locality: property.locality ?? "",
      nearestTown: property.nearest_town ?? "",
      county: property.county ?? "",

      latitude: property.latitude?.toString() ?? "",
      longitude: property.longitude?.toString() ?? "",
    },
  };
}

/**
 * Create a new property
 */
export async function createProperty(
  formData: PropertyFormData,
): Promise<PropertyActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must be logged in to add a property.",
    };
  }

  if (!formData.title.trim()) {
    return {
      success: false,
      message: "Property title is required.",
    };
  }

  if (!formData.propertyType) {
    return {
      success: false,
      message: "Property type is required.",
    };
  }

  if (!formData.listingType) {
    return {
      success: false,
      message: "Listing type is required.",
    };
  }

  if (!formData.price) {
    return {
      success: false,
      message: "Property price is required.",
    };
  }

  if (!formData.locality.trim()) {
    return {
      success: false,
      message: "Locality is required.",
    };
  }

  const slug = generateSlug(formData.title);

  const { data: property, error } = await supabase
    .from("properties")
    .insert({
      user_id: user.id,

      agency_id: null,

      slug,

      title: formData.title.trim(),

      property_type: formData.propertyType,

      listing_type: formData.listingType,

      price: Number(formData.price),

      price_period:
        formData.listingType === "rent" && formData.pricePeriod
          ? formData.pricePeriod
          : null,

      currency: formData.currency,

      description: formData.description.trim() || null,

      locality: formData.locality.trim(),

      nearest_town:
        formData.nearestTown.trim() || null,

      county:
        formData.county.trim() || null,

      latitude:
        formData.latitude.trim()
          ? Number(formData.latitude)
          : null,

      longitude:
        formData.longitude.trim()
          ? Number(formData.longitude)
          : null,

      status: "draft",
    })
    .select("id")
    .single();

  if (error || !property) {
    return {
      success: false,
      message: error?.message ?? "Failed to create property.",
    };
  }

  return {
    success: true,
    message: "Property added successfully.",
    propertyId: property.id,
    data: formData,
  };
}

/**
 * Update an existing property
 */
export async function updateProperty(
  propertyId: string,
  formData: PropertyFormData,
): Promise<PropertyActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must be logged in to update a property.",
    };
  }

  if (!propertyId) {
    return {
      success: false,
      message: "Property ID is required.",
    };
  }

  if (!formData.title.trim()) {
    return {
      success: false,
      message: "Property title is required.",
    };
  }

  if (!formData.propertyType) {
    return {
      success: false,
      message: "Property type is required.",
    };
  }

  if (!formData.listingType) {
    return {
      success: false,
      message: "Listing type is required.",
    };
  }

  if (!formData.price) {
    return {
      success: false,
      message: "Property price is required.",
    };
  }

  if (!formData.locality.trim()) {
    return {
      success: false,
      message: "Locality is required.",
    };
  }

  const { error } = await supabase
    .from("properties")
    .update({
      title: formData.title.trim(),

      property_type: formData.propertyType,

      listing_type: formData.listingType,

      price: Number(formData.price),

      price_period:
        formData.listingType === "rent" && formData.pricePeriod
          ? formData.pricePeriod
          : null,

      currency: formData.currency,

      description: formData.description.trim() || null,

      locality: formData.locality.trim(),

      nearest_town:
        formData.nearestTown.trim() || null,

      county:
        formData.county.trim() || null,

      latitude:
        formData.latitude.trim()
          ? Number(formData.latitude)
          : null,

      longitude:
        formData.longitude.trim()
          ? Number(formData.longitude)
          : null,

      updated_at: new Date().toISOString(),
    })
    .eq("id", propertyId)
    .eq("user_id", user.id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Property updated successfully.",
    propertyId,
    data: formData,
  };
}