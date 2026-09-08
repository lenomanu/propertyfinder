// ==========================================
// AGENCY TYPES
// ==========================================
// If you already have a shared `types.ts` alongside your
// user types, move these into it instead of importing
// from this separate file.

export type AgencyStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

export type Agency = {
  id: string;
  user_id: string;

  agency_name: string;
  town: string;
  location: string;

  email: string;
  phone: string;

  instagram: string | null;
  tiktok: string | null;
  facebook: string | null;

  status: AgencyStatus;
  rejection_reason: string | null;

  reviewed_by: string | null;
  reviewed_at: string | null;

  created_at: string;
  updated_at: string;
};