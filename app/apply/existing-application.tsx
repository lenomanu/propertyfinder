import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AgencyApplication } from "./types";

const STATUS_COPY: Record<string, string> = {
  pending: "Your application is waiting for review.",
  approved: "Your agency application has been approved.",
  rejected: "Your application was rejected.",
  suspended: "Your agency has been suspended.",
};

export default function ExistingApplication({
  application,
}: {
  application: AgencyApplication;
}) {
  const summary =
    STATUS_COPY[application.status] ??
    "You already have an agency application.";

  return (
    <div className="container mx-auto px-4 py-10 md:px-6 2xl:max-w-[1400px]">
      <Card>
        <CardHeader>
          <CardTitle>Your agency application</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-lg font-medium">{application.agency_name}</p>
            <span className="rounded-full border px-3 py-1 text-sm font-medium capitalize">
              {application.status}
            </span>
          </div>

          {application.username && (
            <p className="text-sm text-muted-foreground">
              Username: {application.username}
            </p>
          )}

          <p className="text-sm">{summary}</p>

          {application.rejection_reason && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <p className="font-medium">Reason</p>
              <p className="mt-1">{application.rejection_reason}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
