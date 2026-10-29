
"use server";

import { createClient } from "@/lib/supabase/server";

import {
  ALL_PROPERTY_STATUSES,
  AGENT_EDITABLE_STATUSES,
  type PropertyStatus,
  type UserRole,
} from "./status-types";

export async function getPropertyStatusEditorData(propertyId: string) {
  console.time("[getPropertyStatusEditorData] Total");

  try {
    console.log("[getPropertyStatusEditorData] Started", { propertyId });

    if (!propertyId?.trim()) {
      return {
        success: false as const,
        error: "Property ID is required.",
      };
    }

    console.time("[getPropertyStatusEditorData] Create Supabase client");
    const supabase = await createClient();
    console.timeEnd("[getPropertyStatusEditorData] Create Supabase client");

    console.time("[getPropertyStatusEditorData] Authenticate user");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.timeEnd("[getPropertyStatusEditorData] Authenticate user");

    console.log("[getPropertyStatusEditorData] Auth result", {
      hasUser: Boolean(user),
      authError: authError?.message,
    });

    if (authError || !user) {
      return {
        success: false as const,
        error: "You must sign in to manage this property.",
      };
    }

    console.time("[getPropertyStatusEditorData] Fetch user profile");

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    console.timeEnd("[getPropertyStatusEditorData] Fetch user profile");

    console.log("[getPropertyStatusEditorData] Profile result", {
      role: profile?.role,
      profileError: profileError?.message,
    });

    if (profileError || !profile) {
      return {
        success: false as const,
        error: profileError?.message ?? "Your user profile was not found.",
      };
    }

    const role = profile.role as UserRole;

    if (role !== "admin" && role !== "agent") {
      return {
        success: false as const,
        error: "Your account cannot manage property statuses.",
      };
    }

    console.time("[getPropertyStatusEditorData] Fetch property");

    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id, user_id, status")
      .eq("id", propertyId)
      .maybeSingle();

    console.timeEnd("[getPropertyStatusEditorData] Fetch property");

    console.log("[getPropertyStatusEditorData] Property result", {
      found: Boolean(property),
      ownerId: property?.user_id,
      status: property?.status,
      propertyError: propertyError?.message,
    });

    if (propertyError || !property) {
      return {
        success: false as const,
        error: propertyError?.message ?? "Property was not found.",
      };
    }

    if (role === "agent" && property.user_id !== user.id) {
      return {
        success: false as const,
        error: "You cannot manage this property.",
      };
    }

    if (!ALL_PROPERTY_STATUSES.includes(property.status as PropertyStatus)) {
      return {
        success: false as const,
        error: `Unsupported property status: ${property.status}`,
      };
    }

    return {
      success: true as const,
      role,
      status: property.status as PropertyStatus,
    };
  } catch (error) {
    console.error(
      "[getPropertyStatusEditorData] Unexpected error",
      error,
    );
    throw error;
  } finally {
    console.timeEnd("[getPropertyStatusEditorData] Total");
  }
}

export async function updatePropertyStatusAction(
  propertyId: string,
  nextStatus: PropertyStatus,
) {
  console.time("[updatePropertyStatusAction] Total");

  try {
    console.log("[updatePropertyStatusAction] Started", {
      propertyId,
      nextStatus,
    });

    if (!propertyId?.trim()) {
      return {
        success: false as const,
        error: "Property ID is required.",
      };
    }

    if (!ALL_PROPERTY_STATUSES.includes(nextStatus)) {
      return {
        success: false as const,
        error: "Invalid property status.",
      };
    }

    console.time("[updatePropertyStatusAction] Create Supabase client");
    const supabase = await createClient();
    console.timeEnd("[updatePropertyStatusAction] Create Supabase client");

    console.time("[updatePropertyStatusAction] Authenticate user");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.timeEnd("[updatePropertyStatusAction] Authenticate user");

    console.log("[updatePropertyStatusAction] Auth result", {
      hasUser: Boolean(user),
      authError: authError?.message,
    });

    if (authError || !user) {
      return {
        success: false as const,
        error: "You must sign in to update this property.",
      };
    }

    console.time("[updatePropertyStatusAction] Fetch user profile");

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    console.timeEnd("[updatePropertyStatusAction] Fetch user profile");

    console.log("[updatePropertyStatusAction] Profile result", {
      role: profile?.role,
      profileError: profileError?.message,
    });

    if (profileError || !profile) {
      return {
        success: false as const,
        error: profileError?.message ?? "Your user profile was not found.",
      };
    }

    const role = profile.role as UserRole;

    if (role !== "admin" && role !== "agent") {
      return {
        success: false as const,
        error: "Your account cannot update property statuses.",
      };
    }

    if (
      role === "agent" &&
      !AGENT_EDITABLE_STATUSES.includes(nextStatus)
    ) {
      return {
        success: false as const,
        error: "Agents cannot set that property status.",
      };
    }

    console.time("[updatePropertyStatusAction] Update property");

    let query = supabase
      .from("properties")
      .update({ status: nextStatus })
      .eq("id", propertyId);

    if (role === "agent") {
      query = query.eq("user_id", user.id);
    }

    const { data, error: updateError } = await query
      .select("id, status")
      .maybeSingle();

    console.timeEnd("[updatePropertyStatusAction] Update property");

    console.log("[updatePropertyStatusAction] Update result", {
      updated: Boolean(data),
      status: data?.status,
      updateError: updateError?.message,
    });

    if (updateError) {
      return {
        success: false as const,
        error: updateError.message,
      };
    }

    if (!data) {
      return {
        success: false as const,
        error:
          "Property was not updated. Check ownership and your Supabase update policies.",
      };
    }

    return {
      success: true as const,
      status: data.status as PropertyStatus,
    };
  } catch (error) {
    console.error(
      "[updatePropertyStatusAction] Unexpected error",
      error,
    );

    return {
      success: false as const,
      error: "An unexpected error occurred while updating the status.",
    };
  } finally {
    console.timeEnd("[updatePropertyStatusAction] Total");
  }
}
