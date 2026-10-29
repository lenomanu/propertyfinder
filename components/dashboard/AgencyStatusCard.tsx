
import Link from "next/link";
import { ArrowRight, Building2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Agency = {
  id?: string;
  agency_name?: string | null;
  status?: string | null;
  rejection_reason?: string | null;
} | null;

type Props = {
  agency: Agency;
  editMode?: boolean;
};

export default function AgencyStatusCard({
  agency,
  editMode = false,
}: Props) {
  const agencyName = agency?.agency_name?.trim();

  return (
    <Card className="w-full border-indigo-200 bg-gradient-to-r from-indigo-50/80 to-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
            <Building2 className="size-5" />
          </div>

          <div className="min-w-0">
            <CardTitle className="text-base font-semibold text-slate-900">
              {editMode ? "Edit Agency Profile" : "Agency Profile"}
            </CardTitle>

            <CardDescription className="mt-1">
              {agencyName
                ? `Manage ${agencyName} details and application information.`
                : "Set up your agency profile and submit it for approval."}
            </CardDescription>
          </div>
        </div>

        {agency?.status && (
          <span className="shrink-0 rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-xs font-medium capitalize text-indigo-700">
            {agency.status}
          </span>
        )}
      </CardHeader>

      <CardContent className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0 text-sm text-slate-600">
          {agencyName ? (
            <>
              <p className="font-medium text-slate-800">{agencyName}</p>

              {agency?.rejection_reason && agency.status === "rejected" && (
                <p className="mt-1 text-rose-600">
                  Feedback: {agency.rejection_reason}
                </p>
              )}
            </>
          ) : (
            <p>
              Add your agency name, contact information, location and other
              details to get started.
            </p>
          )}
        </div>

        <Button asChild className="shrink-0 bg-indigo-600 hover:bg-indigo-700">
          <Link href="/agent/agency">
            <Pencil className="mr-2 size-4" />
            {agencyName ? "Edit Agency Profile" : "Set up agency"}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
