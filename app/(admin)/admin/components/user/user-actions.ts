"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "../../../../types";




const ROLES: UserRole[] = [
  "user",
  "agent",
  "admin",
];

export type UpdateUserState = {
  success: boolean;
  error?: string;
  message?: string;
};

function nullable(
  value: FormDataEntryValue | null
) {
  const text = String(value ?? "").trim();

  return text || null;
}

export async function updateUser(
  previousState: UpdateUserState,
  formData: FormData
): Promise<UpdateUserState> {
  const supabase = await createClient();

  // ----------------------------------------
  // Check authentication
  // ----------------------------------------

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return {
      success: false,
      error: "You must be logged in.",
    };
  }

  // ----------------------------------------
  // Get form values
  // ----------------------------------------

  const targetId = String(
    formData.get("id") ?? ""
  );

  const role = String(
    formData.get("role") ?? ""
  ) as UserRole;

  // ----------------------------------------
  // Validate user ID
  // ----------------------------------------

  if (!targetId) {
    return {
      success: false,
      error: "User ID is required.",
    };
  }

  // ----------------------------------------
  // Validate role
  // ----------------------------------------

  if (!ROLES.includes(role)) {
    return {
      success: false,
      error: "Invalid role.",
    };
  }

  // ----------------------------------------
  // Update user
  // ----------------------------------------

  const { error } = await supabase
    .from("users")
    .update({
      full_name: nullable(
        formData.get("full_name")
      ),

      email: nullable(
        formData.get("email")
      ),

      phone: nullable(
        formData.get("phone")
      ),

      avatar_url: nullable(
        formData.get("avatar_url")
      ),

      agency_id: nullable(
        formData.get("agency_id")
      ),

      role,
    })
    .eq("id", targetId);

  // ----------------------------------------
  // Handle database error
  // ----------------------------------------

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  // ----------------------------------------
  // Refresh cached users page
  // ----------------------------------------

  revalidatePath("/admin/users");

  // ----------------------------------------
  // Return success
  // ----------------------------------------

  return {
    success: true,
    message: "User updated successfully.",
  };
}