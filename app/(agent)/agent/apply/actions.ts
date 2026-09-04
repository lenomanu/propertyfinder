"use server";


import { createClient } from "@/lib/supabase/server";
import type { ApplicationState, ApplicationValues } from "./types";
import { applicationSchema } from "./schema";



export async function submitAgentApplication(
  previousState: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {
  // --------------------------------------------------
  // 1. Get form values
  // --------------------------------------------------

  const values: ApplicationValues = {
    agencyName: String(formData.get("agencyName") ?? ""),
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

    // --------------------------------------------------
    // 5. Insert application
    // --------------------------------------------------

    const { error: insertError } = await supabase
      .from("agents")
      .insert({
        user_id: user.id,
        agency_name: validation.data.agencyName,
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

      return {
        success: false,
        message:
          "We couldn't submit your application. Your information has been kept. Please try again.",
        values,
      };
    }

    // --------------------------------------------------
    // 7. Successful submission
    // --------------------------------------------------

    return {
      success: true,
      message:
        "Your agency application has been submitted successfully.",
    };
  } catch (error) {
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