import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GetRole() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return JSON.stringify(data.claims.user_role, null, 2);
}