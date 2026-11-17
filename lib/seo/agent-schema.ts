import { absoluteUrl } from "@/lib/seo/urls";
import {
  BUSINESS_ADDRESS,
  BUSINESS_NAME,
  contactEmail,
  contactPhone,
  sameAsProfiles,
} from "@/lib/site/business";

export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${absoluteUrl("/")}#organization`,
    name: BUSINESS_NAME,
    legalName: BUSINESS_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/property-team-logo-transparent.png"),
    image: absoluteUrl("/nairobi-skyline.jpg"),
    description:
      "Property Team is a Kenya property marketplace connecting buyers and renters with approved real estate agencies.",
    email: contactEmail(),
    telephone: contactPhone(),
    address: {
      "@type": "PostalAddress",
      ...BUSINESS_ADDRESS,
    },
    areaServed: {
      "@type": "Country",
      name: "Kenya",
    },
    sameAs: sameAsProfiles(),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: contactEmail(),
        telephone: contactPhone(),
        areaServed: "KE",
        availableLanguage: ["English", "Swahili"],
      },
    ],
  };
}

export function buildWebSiteJsonLd(): Record<string, unknown> {
  const searchUrl = absoluteUrl("/properties-for-sale");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: BUSINESS_NAME,
    url: absoluteUrl("/"),
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    inLanguage: "en-KE",
    potentialAction: {
      "@type": "SearchAction",
      target: `${searchUrl}?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildServiceJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl("/")}#service`,
    name: "Property search across Kenya",
    description:
      "Search homes, apartments, land, and commercial property for sale and rent across Kenya.",
    provider: { "@id": `${absoluteUrl("/")}#organization` },
    areaServed: {
      "@type": "Country",
      name: "Kenya",
    },
    serviceType: "Real estate listing marketplace",
    url: absoluteUrl("/properties-for-sale"),
  };
}

export function buildFaqJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl("/")}#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I search for property on Property Team?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use the homepage search or browse properties for sale, for rent, or sold listings filtered by town, price, bedrooms, and property type.",
        },
      },
      {
        "@type": "Question",
        name: "Who lists property on Property Team?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Approved real estate agencies publish listings on Property Team. You can find agencies on the Find Agent page and view their active inventory.",
        },
      },
      {
        "@type": "Question",
        name: "How do I contact Property Team?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Email ${contactEmail()} or call ${contactPhone()} for support regarding the marketplace and agency onboarding.`,
        },
      },
    ],
  };
}

export function buildHomepageJsonLd(): Record<string, unknown>[] {
  return [
    buildOrganizationJsonLd(),
    buildWebSiteJsonLd(),
    buildServiceJsonLd(),
    buildFaqJsonLd(),
  ];
}