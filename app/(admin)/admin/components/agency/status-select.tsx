"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AgencyStatus } from "./agency-types";



type Props = {
  status: AgencyStatus;
  reason: string;
  onStatusChange: (
    status: AgencyStatus
  ) => void;
  onReasonChange: (
    reason: string
  ) => void;
};

const REASON_REQUIRED_STATUSES: AgencyStatus[] = [
  "rejected",
  "suspended",
];

const REASON_LABEL: Partial<
  Record<AgencyStatus, string>
> = {
  rejected: "Rejection reason",
  suspended: "Suspension reason",
};

const REASON_PLACEHOLDER: Partial<
  Record<AgencyStatus, string>
> = {
  rejected:
    "Explain why this agency is being rejected",
  suspended:
    "Explain why this agency is being suspended",
};

// Rejected and suspended both require a reason, stored in
// the same column, so they're handled as one unit here.
export function StatusSelect({
  status,
  reason,
  onStatusChange,
  onReasonChange,
}: Props) {
  const needsReason =
    REASON_REQUIRED_STATUSES.includes(
      status
    );

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="status">
          Status
        </Label>

        <Select
          name="status"
          value={status}
          onValueChange={(
            value
          ) =>
            onStatusChange(
              value as AgencyStatus
            )
          }
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>

          <SelectContent>

            <SelectItem value="pending">
              Pending
            </SelectItem>

            <SelectItem value="approved">
              Approved
            </SelectItem>

            <SelectItem value="rejected">
              Rejected
            </SelectItem>

            <SelectItem value="suspended">
              Suspended
            </SelectItem>

          </SelectContent>
        </Select>
      </div>

      {needsReason && (
        <div className="space-y-2">
          <Label htmlFor="reason">
            {REASON_LABEL[status]}
          </Label>

          <Textarea
            id="reason"
            name="reason"
            value={reason}
            onChange={(event) =>
              onReasonChange(
                event.target.value
              )
            }
            placeholder={
              REASON_PLACEHOLDER[status]
            }
          />
        </div>
      )}
    </>
  );
}