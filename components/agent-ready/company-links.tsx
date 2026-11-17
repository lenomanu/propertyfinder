import Link from "next/link";

const links = [
  { href: "/about", label: "About Property Team" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms of use" },
];

export default function CompanyLinks() {
  return (
    <section
      aria-labelledby="company-links-heading"
      className="container mx-auto px-4 pb-8 sm:px-6 lg:px-8"
    >
      <h2
        id="company-links-heading"
        className="text-lg font-semibold tracking-tight"
      >
        Company
      </h2>
      <ul className="mt-3 flex flex-wrap gap-4 text-sm">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className="text-primary hover:underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}