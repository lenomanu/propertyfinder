"use client";

import { Agency, AgencyStatus } from "./agency-types";
import { SocialLinks } from "./social-links";




type Props = {
  agencies: Agency[];
  selectedId: string | null;
  onSelect: (agency: Agency) => void;
};

const STATUS_STYLES: Record<
  AgencyStatus,
  string
> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  approved: "bg-green-500/10 text-green-600",
  rejected: "bg-red-500/10 text-red-600",
  suspended: "bg-gray-500/10 text-gray-600",
};

export function AgencyTable({
  agencies,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left">
            <th className="px-4 py-3">
              Agency
            </th>

            <th className="px-4 py-3">
              Town
            </th>

            <th className="px-4 py-3">
              Email
            </th>

            <th className="px-4 py-3">
              Social
            </th>

            <th className="px-4 py-3">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {agencies.map((agency) => (
            <tr
              key={agency.id}
              onClick={() => onSelect(agency)}
              className={`
                cursor-pointer
                border-t
                transition-colors
                hover:bg-muted/50
                ${
                  selectedId === agency.id
                    ? "bg-muted"
                    : ""
                }
              `}
            >
              <td className="px-4 py-3">
                {agency.agency_name}
              </td>

              <td className="px-4 py-3">
                {agency.town}
              </td>

              <td className="px-4 py-3">
                {agency.email}
              </td>

              <td className="px-4 py-3">
                {/* Stop propagation so clicking a link doesn't
                    also select the row */}
                <div
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <SocialLinks
                    instagram={agency.instagram}
                    tiktok={agency.tiktok}
                    facebook={agency.facebook}
                    variant="compact"
                  />
                </div>
              </td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
                    STATUS_STYLES[
                      agency.status
                    ]
                  }`}
                >
                  {agency.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {agencies.length === 0 && (
        <p className="p-6 text-center text-sm text-muted-foreground">
          No agencies found.
        </p>
      )}
    </div>
  );
}