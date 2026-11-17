/** Keep document titles within common SERP limits (before any layout template). */
export function truncateTitle(text: string, maxLength = 57): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`;
}

/** Ahrefs flags meta descriptions under ~120 characters on indexable pages. */
export function ensureMetaDescription(
  text: string,
  minLength = 120,
  maxLength = 160
): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length >= minLength) {
    return cleaned.length <= maxLength
      ? cleaned
      : `${cleaned.slice(0, maxLength - 1).trimEnd()}…`;
  }

  const pad =
    " Browse verified listings with photos, prices, and contact details on Property Team.";
  const combined = `${cleaned}${pad}`.replace(/\s+/g, " ").trim();

  if (combined.length <= maxLength) return combined;
  return `${combined.slice(0, maxLength - 1).trimEnd()}…`;
}