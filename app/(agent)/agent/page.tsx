import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function CheckRole() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const role = data.claims.user_role;

  if (role === "admin") {
    redirect("/admin");
  }

  return (
    <div>
      Agency Landing Page Dashboard
    </div>
  );
}

function Loading() {
  return (
    <div className="p-6">
      Loading dashboard...
    </div>
  );
}

export default function AgentPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CheckRole />
    </Suspense>
  );
}