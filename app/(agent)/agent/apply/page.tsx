export const instant = false;

import React from 'react'
import { redirect } from "next/navigation";


import { createClient } from "@/lib/supabase/server";
import AgencyApplicationForm from './agency-application-form'

async function Page() {
    const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in → login page
  if (!user) {
    redirect("/login");
  }
  return (
    <div>
      <AgencyApplicationForm/>
    </div>
  )
}

export default Page
