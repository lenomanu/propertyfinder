export const instant = false;

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import AgencyApplicationForm from "./agency-application-form";
import ExistingApplication from "./existing-application";
import type { AgencyApplication } from "./types";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("agencies")
    .select("agency_name, username, status, rejection_reason")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-sm text-destructive">
        We couldn&apos;t load your application. Please refresh and try again.
      </div>
    );
  }

  const application = (data?.[0] ?? null) as AgencyApplication | null;

  if (application) {
    return <ExistingApplication application={application} />;
  }

  return <AgencyApplicationForm />;
}
