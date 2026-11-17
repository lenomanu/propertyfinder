import { absoluteUrl } from "@/lib/seo/urls";

export const BUSINESS_NAME = "Property Team";

export function contactEmail() {
  return (
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@propertyteam.co.ke"
  );
}

export function contactPhone() {
  return (
    process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "+61450968182"
  );
}

/** Display-friendly phone label (e.g. for international callers). */
export function contactPhoneDisplay() {
  const phone = contactPhone();
  if (phone.startsWith("+61")) {
    return `${phone} (Australia)`;
  }
  return phone;
}

export function contactPhoneHref() {
  return `tel:${contactPhone().replace(/[^\d+]/g, "")}`;
}

export function contactEmailHref() {
  return `mailto:${contactEmail()}`;
}

/** Public profiles used for schema.org sameAs (override via env). */
export function sameAsProfiles(): string[] {
  const fromEnv = process.env.NEXT_PUBLIC_SOCIAL_PROFILES?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (fromEnv?.length) return fromEnv;

  return [
    absoluteUrl("/"),
    "https://www.facebook.com/propertyteam.co.ke",
    "https://www.instagram.com/propertyteam.co.ke",
    "https://www.linkedin.com/company/propertyteam",
  ];
}

export const BUSINESS_ADDRESS = {
  addressLocality: "Nairobi",
  addressRegion: "Nairobi County",
  addressCountry: "Kenya",
};