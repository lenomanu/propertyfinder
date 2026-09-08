"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { AgencyStatus } from "./agency-types";



const STATUSES: AgencyStatus[] = [
  "pending",
  "approved",
  "rejected",
  "suspended",
];

// These statuses require the admin to leave a reason.
// Both are stored in the same `rejection_reason` column —
// the schema doesn't have a separate suspension_reason.
const STATUSES_REQUIRING_REASON: AgencyStatus[] = [
  "rejected",
  "suspended",
];

export type UpdateAgencyState = {
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

export async function updateAgency(
  previousState: UpdateAgencyState,
  formData: FormData
): Promise<UpdateAgencyState> {
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

  const status = String(
    formData.get("status") ?? ""
  ) as AgencyStatus;

  const reason = nullable(
    formData.get("reason")
  );

  const agencyName = nullable(
    formData.get("agency_name")
  );

  const town = nullable(
    formData.get("town")
  );

  const location = nullable(
    formData.get("location")
  );

  const email = nullable(
    formData.get("email")
  );

  const phone = nullable(
    formData.get("phone")
  );

  const instagram = nullable(
    formData.get("instagram")
  );

  const tiktok = nullable(
    formData.get("tiktok")
  );

  const facebook = nullable(
    formData.get("facebook")
  );

  // ----------------------------------------
  // Validate agency ID
  // ----------------------------------------

  if (!targetId) {
    return {
      success: false,
      error: "Agency ID is required.",
    };
  }

  // ----------------------------------------
  // Validate required fields
  // ----------------------------------------
  // agency_name, town, location, email, and phone are
  // NOT NULL in the database, so they can't be cleared out.

  if (
    !agencyName ||
    !town ||
    !location ||
    !email ||
    !phone
  ) {
    return {
      success: false,
      error:
        "Agency name, town, location, email, and phone are all required.",
    };
  }

  // ----------------------------------------
  // Validate status
  // ----------------------------------------

  if (!STATUSES.includes(status)) {
    return {
      success: false,
      error: "Invalid status.",
    };
  }

  if (
    STATUSES_REQUIRING_REASON.includes(status) &&
    !reason
  ) {
    return {
      success: false,
      error:
        status === "rejected"
          ? "A rejection reason is required when rejecting an agency."
          : "A reason is required when suspending an agency.",
    };
  }

  // ----------------------------------------
  // Update agency
  // ----------------------------------------

  const { error } = await supabase
    .from("agency")
    .update({
      agency_name: agencyName,
      town,
      location,
      email,
      phone,

      instagram,
      tiktok,
      facebook,

      status,

      // Only keep a reason around while the agency is
      // actually in a state that needed one.
      rejection_reason:
        STATUSES_REQUIRING_REASON.includes(
          status
        )
          ? reason
          : null,

      reviewed_by: authUser.id,
      reviewed_at: new Date().toISOString(),
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
  // Refresh cached agencies page
  // ----------------------------------------

  revalidatePath("/admin/agencies");

  // ----------------------------------------
  // Return success
  // ----------------------------------------

  return {
    success: true,
    message: "Agency updated successfully.",
  };
}