
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserRole } from "../types";

export async function GetRole() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return data.claims.user_role as UserRole;
}