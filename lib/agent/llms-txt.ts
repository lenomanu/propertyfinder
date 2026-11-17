import { absoluteUrl } from "@/lib/seo/urls";
import { BUSINESS_NAME, contactEmail } from "@/lib/site/business";

export function buildLlmsTxt(): string {
  const origin = absoluteUrl("/").replace(/\/$/, "");

  return `# ${BUSINESS_NAME}

> ${BUSINESS_NAME} helps people search property for sale and rent across Kenya. Approved agencies publish listings; buyers and renters discover homes, apartments, land, and commercial space by location and filters.

## Key pages

- [Home](${origin}/)
- [Properties for sale](${origin}/properties-for-sale)
- [Properties for rent](${origin}/properties-for-rent)
- [Sold property](${origin}/properties-sold)
- [Find an agent](${origin}/find-agent)
- [List with us](${origin}/sell)
- [About](${origin}/about)
- [Contact](${origin}/contact)
- [Terms](${origin}/terms)

## Contact

- Email: ${contactEmail()}
- Sitemap: ${origin}/sitemap.xml
- MCP server card: ${origin}/.well-known/mcp/server-card.json

## Optional

- [Robots](${origin}/robots.txt)
`;
}