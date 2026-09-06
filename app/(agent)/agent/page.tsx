import { GetRole } from '@/app/auth/get-role-jwt'
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react'

async function CheckRole() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
    return;
  }

  const role = data.claims.user_role;

  if (role === "admin") {
    redirect("/admin");
  }
}

async function Page() {
  await CheckRole()
  return (
    <div>
       
      Agency Landing page Dashboard
    </div>
  )
}

export default Page
