"use server";

import { createClient } from "@/lib/supabase/server";
import { UserRole } from "../types";


const ROLES: UserRole[] = [
  "user",
  "agent",
  "admin",
];

function nullable(
  value: FormDataEntryValue | null
) {
  const text = String(value ?? "").trim();

  return text || null;
}

export async function updateUser(
  formData: FormData
) {
  const supabase = await createClient();

  // Check logged-in user

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return {
      success: false,
      error: "You must be logged in.",
    };
  }

  // Get submitted values

  const targetId = String(
    formData.get("id") ?? ""
  );

  const role = String(
    formData.get("role") ?? ""
  ) as UserRole;

  // Validate

  if (!targetId) {
    return {
      success: false,
      error: "User ID is required.",
    };
  }

  if (!ROLES.includes(role)) {
    return {
      success: false,
      error: "Invalid role.",
    };
  }

  // Update user

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

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    erorr: ''
  };
}