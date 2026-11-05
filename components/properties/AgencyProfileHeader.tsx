import { Building2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import PropertyShareButton from "@/components/properties/PropertyShareButton";
import { getPublicImageUrl } from "@/lib/cloudflare/public-image-url";
import type { AgencyProfile } from "@/lib/properties/agency-profile";

function imageUrl(path: string | null) {
  if (!path) return null;
  try {
    return getPublicImageUrl(path);
  } catch {
    return null;
  }
}

export default function AgencyProfileHeader({
  agency,
}: {
  agency: AgencyProfile;
}) {
  const photo = imageUrl(agency.profileImageUrl);
  const phoneHref = agency.phone
    ? `tel:${agency.phone.replace(/[^\d+]/g, "")}`
    : null;
  const whatsappNumber = agency.phone?.replace(/\D/g, "");
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm interested in properties listed by ${agency.name}.`)}`
    : null;
  const address = [agency.location, agency.town].filter(Boolean).join(", ");

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {photo ? (
            <img
              src={photo}
              alt=""
              className="size-16 shrink-0 rounded-full object-cover sm:size-20"
            />
          ) : (
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground sm:size-20">
              <Building2 className="size-8" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0 space-y-1">
            <p className="text-sm text-muted-foreground">Agency profile</p>
            <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">
              {agency.name}
            </h1>
            {address && (
              <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{address}</span>
              </p>
            )}
          </div>
        </div>
        <PropertyShareButton title={agency.name} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
        {agency.phone && phoneHref && (
          <a
            href={phoneHref}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Phone className="size-4" />
            Call
          </a>
        )}
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium hover:bg-muted"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        )}
        {agency.email && (
          <a
            href={`mailto:${agency.email}`}
            className="inline-flex h-10 max-w-full items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium hover:bg-muted"
          >
            <Mail className="size-4 shrink-0" />
            <span className="truncate">{agency.email}</span>
          </a>
        )}
        {agency.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-lg border px-4 text-sm font-medium hover:bg-muted"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
