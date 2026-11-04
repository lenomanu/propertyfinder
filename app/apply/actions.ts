"use server";


import { redirect } from "next/navigation";

function isRedirectError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest: unknown }).digest).startsWith("NEXT_REDIRECT")
  );
}

import { createClient } from "@/lib/supabase/server";
import type {
  ApplicationState,
  ApplicationValues,
  UsernameCheck,
} from "./types";
import { USERNAME_PATTERN, applicationSchema } from "./schema";

const TAKEN_USERNAME: UsernameCheck = {
  status: "taken",
  message: "That username is already taken.",
};

function constraintText(error: { message?: string; details?: string | null }) {
  return `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
}

// Row security hides other agencies, so a select cannot see a taken name.
// Insert the candidate with a reviewer id that is not a user. A taken
// username fails the unique index first. A free username fails the reviewer
// foreign key, and Postgres rolls that statement back.
async function checkUsernameByConstraint(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  normalized: string
): Promise<UsernameCheck> {
  const reviewerId = crypto.randomUUID();
  const { data, error } = await supabase
    .from("agencies")
    .insert({
      user_id: userId,
      agency_name: "Username check",
      username: normalized,
      town: "Username check",
      location: "Username check",
      email: `${reviewerId}@example.com`,
      phone: "0700000000",
      status: "pending",
      reviewed_by: reviewerId,
    })
    .select("id")
    .maybeSingle();

  if (error?.code === "23505" && constraintText(error).includes("username")) {
    return TAKEN_USERNAME;
  }

  if (error?.code === "23503") {
    return { status: "available" };
  }

  if (data?.id) {
    const { error: deleteError } = await supabase
      .from("agencies")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);

    if (deleteError) {
      console.error("Username check cleanup error:", deleteError);
      return {
        status: "error",
        message: "We couldn't check that username. Please try again.",
      };
    }

    return { status: "available" };
  }

  console.error("Username check error:", error);
  return {
    status: "error",
    message: "We couldn't check that username. Please try again.",
  };
}

export async function checkUsernameAvailability(
  username: string
): Promise<UsernameCheck> {
  const normalized = username.trim().toLowerCase();

  if (!USERNAME_PATTERN.test(normalized)) {
    return {
      status: "invalid",
      message:
        "Use 3–30 characters: lowercase letters, numbers, and hyphens. Start with a letter or number.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "You must be logged in to check a username.",
    };
  }

  const { data, error } = await supabase.rpc("is_agency_username_taken", {
    candidate: normalized,
  });

  if (!error) {
    if (data === true) {
      return TAKEN_USERNAME;
    }

    if (data === false) {
      return { status: "available" };
    }
  } else if (error.code !== "PGRST202") {
    console.error("Username check error:", error);
  }

  return checkUsernameByConstraint(supabase, user.id, normalized);
}



export async function submitAgentApplication(
  previousState: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {
  // --------------------------------------------------
  // 1. Get form values
  // --------------------------------------------------

  const values: ApplicationValues = {
    agencyName: String(formData.get("agencyName") ?? ""),
    username: String(formData.get("username") ?? ""),
    town: String(formData.get("town") ?? ""),
    location: String(formData.get("location") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    instagram: String(formData.get("instagram") ?? ""),
    tiktok: String(formData.get("tiktok") ?? ""),
    facebook: String(formData.get("facebook") ?? ""),
  };

  // --------------------------------------------------
  // 2. Validate form
  // --------------------------------------------------

  const validation = applicationSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "Please correct the errors below.",
      values,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  // --------------------------------------------------
  // 3. Connect to Supabase
  // --------------------------------------------------

  try {
    const supabase = await createClient();

    // --------------------------------------------------
    // 4. Get logged-in user
    // --------------------------------------------------

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        message: "You must be logged in to submit an application.",
        values,
      };
    }

    const { data: existing, error: existingError } = await supabase
      .from("agencies")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    if (existingError) {
      console.error("Existing application check error:", existingError);
      return {
        success: false,
        message:
          "We couldn't check your existing application. Please try again.",
        values,
      };
    }

    if (existing && existing.length > 0) {
      redirect("/apply");
    }

    const usernameCheck = await checkUsernameAvailability(
      validation.data.username
    );

    if (usernameCheck.status !== "available") {
      return {
        success: false,
        message: usernameCheck.message,
        values,
        errors: { username: [usernameCheck.message] },
      };
    }

    // --------------------------------------------------
    // 5. Insert application
    // --------------------------------------------------

    const { error: insertError } = await supabase
      .from("agencies")
      .insert({
        user_id: user.id,
        agency_name: validation.data.agencyName,
        username: validation.data.username,
        town: validation.data.town,
        location: validation.data.location,
        email: validation.data.email,
        phone: validation.data.phone,
        instagram: validation.data.instagram || null,
        tiktok: validation.data.tiktok || null,
        facebook: validation.data.facebook || null,
        status: "pending",
      });

    // --------------------------------------------------
    // 6. Supabase insertion failed
    // --------------------------------------------------

    if (insertError) {
      console.error("Supabase insertion error:", insertError);

      if (insertError.code === "23505") {
        return {
          success: false,
          message: "That username is already taken.",
          values,
          errors: { username: ["That username is already taken."] },
        };
      }

      return {
        success: false,
        message:
          "We couldn't submit your application. Your information has been kept. Please try again.",
        values,
      };
    }

    redirect("/apply");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error("Unexpected application error:", error);

    // IMPORTANT:
    // Return values so the form does NOT lose the user's data.
    return {
      success: false,
      message:
        "Something went wrong while submitting your application. Your information has been kept. Please try again.",
      values,
    };
  }
}