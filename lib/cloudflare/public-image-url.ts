export function getPublicImageUrl(key: string) {
  if (/^https?:\/\//i.test(key)) {
    return key;
  }

  const baseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("R2_PUBLIC_BASE_URL is not configured.");
  }

  const encodedKey = key.split("/").map(encodeURIComponent).join("/");

  return `${baseUrl.replace(/\/$/, "")}/${encodedKey}`;
}
