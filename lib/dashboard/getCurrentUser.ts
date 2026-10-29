
import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { DashboardRole, DashboardUser } from "./dashboard-types";

export async function getCurrentUser(
  expectedRole?: DashboardRole,
): Promise<DashboardUser> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("id, role, full_name, agency_id")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    throw new Error("Unable to load your user profile.");
  }

  const role = String(profile.role);

  if (role !== "admin" && role !== "agent") {
    redirect("/");
  }

  if (expectedRole && role !== expectedRole) {
    redirect(role === "admin" ? "/admin" : "/agent");
  }

  return {
    id: user.id,
    role,
    fullName: profile.full_name || user.email || "User",
    agencyId: profile.agency_id,
  };
}
