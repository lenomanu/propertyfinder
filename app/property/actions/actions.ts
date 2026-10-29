
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type PublishResult = {
  success: boolean;
  error?: string;
};

export async function getPropertyPublishState(propertyId: string) {
  if (!propertyId) {
    return { status: null, canPublish: false };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { status: null, canPublish: false };
  }

  const { data: property, error } = await supabase
    .from("properties")
    .select("id, status, user_id")
    .eq("id", propertyId)
    .maybeSingle();

  if (error || !property) {
    console.error("Failed to load property publish state:", error);
    return { status: null, canPublish: false };
  }

  // Only the property's owner can publish it.
  if (property.user_id !== user.id) {
    return { status: property.status, canPublish: false };
  }

  return {
    status: property.status,
    canPublish: property.status === "draft",
  };
}

export async function publishPropertyAction(
  propertyId: string
): Promise<PublishResult> {
  if (!propertyId) {
    return { success: false, error: "Property ID is missing." };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "Please sign in before publishing.",
    };
  }

  // Fetch the current status from the database.
  const { data: property, error: fetchError } = await supabase
    .from("properties")
    .select("id, status, user_id")
    .eq("id", propertyId)
    .maybeSingle();

  if (fetchError || !property) {
    console.error("Failed to fetch property:", fetchError);

    return {
      success: false,
      error: "Property not found or access denied.",
    };
  }

  if (property.user_id !== user.id) {
    return {
      success: false,
      error: "You are not authorized to publish this property.",
    };
  }

  if (property.status !== "draft") {
    return {
      success: false,
      error: `This property cannot be published because its status is "${property.status}".`,
    };
  }

  // Submit the draft for admin approval.
  const { data: updatedProperty, error: updateError } = await supabase
    .from("properties")
    .update({ status: "pending" })
    .eq("id", propertyId)
    .eq("user_id", user.id)
    .eq("status", "draft")
    .select("id")
    .maybeSingle();

  if (updateError || !updatedProperty) {
    console.error("Failed to publish property:", updateError);

    return {
      success: false,
      error: "Unable to publish this property. Please refresh and try again.",
    };
  }

  revalidatePath("/agent");
  revalidatePath("/agent/properties");

  // Redirect after successful publishing.
  redirect("/agent");
}
