import type { Metadata } from "next";

import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo/config";
import { absoluteUrl } from "@/lib/seo/urls";

export const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
};

export function truncateMetaDescription(
  text: string,
  maxLength = 160
): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`;
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string | null;
  robots?: Metadata["robots"];
  titleAbsolute?: boolean;
};

/** Shared Open Graph / Twitter fields for public marketing pages. */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  image,
  robots,
  titleAbsolute = false,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image?.trim() || DEFAULT_OG_IMAGE;

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    ...(robots ? { robots } : {}),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_KE",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function rootLayoutMetadata(): Metadata {
  return {
    metadataBase: new URL(absoluteUrl("/")),
    title: {
      default: `${SITE_NAME} – Find property in Kenya`,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    category: "Real Estate",
    icons: {
      icon: "/property-team-logo-transparent.png",
      apple: "/property-team-logo-transparent.png",
    },
    openGraph: {
      type: "website",
      locale: "en_KE",
      siteName: SITE_NAME,
      title: {
        default: `${SITE_NAME} – Find property in Kenya`,
        template: `%s | ${SITE_NAME}`,
      },
      description: DEFAULT_DESCRIPTION,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} – property in Kenya`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: {
        default: `${SITE_NAME} – Find property in Kenya`,
        template: `%s | ${SITE_NAME}`,
      },
      description: DEFAULT_DESCRIPTION,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
