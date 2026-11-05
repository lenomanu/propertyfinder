import "server-only";

import { createClient } from "@/lib/supabase/server";

export type AgencyProfile = {
  id: string;
  userId: string;
  username: string;
  name: string;
  profileImageUrl: string | null;
  town: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  links: { label: string; href: string }[];
};

function externalHref(value: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^@/, "")}`;
}

export async function getApprovedAgencyByUsername(
  username: string
): Promise<AgencyProfile | null> {
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("agencies")
      .select(
        "id,user_id,username,agency_name,profile_image_url,town,location,email,phone,instagram,tiktok,facebook,status"
      )
      .eq("username", cleanUsername)
      .eq("status", "approved")
      .maybeSingle();

    if (error) {
      console.error("[getApprovedAgencyByUsername] Supabase error:", error);
      return null;
    }

    if (!data) return null;

    const links = [
      ["Instagram", data.instagram],
      ["TikTok", data.tiktok],
      ["Facebook", data.facebook],
    ].flatMap(([label, value]) => {
      const href = externalHref(value);
      return href && label ? [{ label, href }] : [];
    });

    return {
      id: data.id,
      userId: data.user_id,
      username: data.username,
      name: data.agency_name?.trim() || data.username,
      profileImageUrl: data.profile_image_url?.trim() || null,
      town: data.town?.trim() || null,
      location: data.location?.trim() || null,
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      links,
    };
  } catch (error) {
    console.error("[getApprovedAgencyByUsername] Unexpected error:", error);
    return null;
  }
}
