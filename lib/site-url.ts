const PRODUCTION_SITE_URL = "https://propertyteam.co.ke";

export function getSiteOrigin(fallbackOrigin?: string) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    try {
      const normalizedUrl = /^https?:\/\//i.test(configuredUrl)
        ? configuredUrl
        : `https://${configuredUrl}`;
      const parsedUrl = new URL(normalizedUrl);
      const isLoopback =
        parsedUrl.hostname === "localhost" ||
        parsedUrl.hostname === "127.0.0.1" ||
        parsedUrl.hostname === "[::1]";

      if (process.env.NODE_ENV !== "production" || !isLoopback) {
        return parsedUrl.origin;
      }
    } catch {
      // Fall through to the environment-specific default for invalid config.
    }
  }

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  return fallbackOrigin ?? "http://localhost:3000";
}
