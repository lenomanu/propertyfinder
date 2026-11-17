import { absoluteUrl } from "@/lib/seo/urls";
import { BUSINESS_NAME, contactEmail, contactPhone } from "@/lib/site/business";

const MARKDOWN_ROUTES: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/contact": "contact",
  "/terms": "terms",
  "/find-agent": "find-agent",
  "/properties-for-sale": "properties-for-sale",
  "/properties-for-rent": "properties-for-rent",
};

const CONTENT: Record<string, () => string> = {
  home: () => `# ${BUSINESS_NAME}

Search property for sale and rent across Kenya.

## Links

- [Properties for sale](${absoluteUrl("/properties-for-sale")})
- [Properties for rent](${absoluteUrl("/properties-for-rent")})
- [Find an agent](${absoluteUrl("/find-agent")})
- [About](${absoluteUrl("/about")})
- [Contact](${absoluteUrl("/contact")})

## Contact

- Email: ${contactEmail()}
- Phone: ${contactPhone()}
`,
  about: () => `# About ${BUSINESS_NAME}

${BUSINESS_NAME} is a Kenya-focused property marketplace. Approved agencies list homes, apartments, land, and commercial property; visitors search by town, price, and property features.

## What we do

- Publish verified agency listings
- Let buyers and renters filter properties for sale and rent
- Showcase sold property history by area

[Return home](${absoluteUrl("/")})
`,
  contact: () => `# Contact ${BUSINESS_NAME}

- Email: [${contactEmail()}](mailto:${contactEmail()})
- Phone: [${contactPhone()}](tel:${contactPhone().replace(/[^\d+]/g, "")})

Office: Nairobi, Kenya

[Terms of use](${absoluteUrl("/terms")})
`,
  terms: () => `# Terms of use — ${BUSINESS_NAME}

Listings are provided by third-party agencies. Property Team hosts the marketplace and does not guarantee availability, pricing, or property condition. Contact the listing agency for viewings and contracts.

For questions, email ${contactEmail()}.
`,
  "find-agent": () => `# Find an agent — ${BUSINESS_NAME}

Browse approved real estate agencies in Kenya: ${absoluteUrl("/find-agent")}
`,
  "properties-for-sale": () => `# Properties for sale — ${BUSINESS_NAME}

${absoluteUrl("/properties-for-sale")}
`,
  "properties-for-rent": () => `# Properties for rent — ${BUSINESS_NAME}

${absoluteUrl("/properties-for-rent")}
`,
};

export function markdownPageKey(pathname: string): string | null {
  return MARKDOWN_ROUTES[pathname] ?? null;
}

export function renderMarkdownPage(key: string): string | null {
  const writer = CONTENT[key];
  return writer ? writer() : null;
}