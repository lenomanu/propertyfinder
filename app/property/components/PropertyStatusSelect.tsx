
"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AGENT_EDITABLE_STATUSES,
  ALL_PROPERTY_STATUSES,
  STATUS_LABELS,
  STATUS_STYLES,
  type PropertyStatus,
  type UserRole,
} from "../actions/status-types";

import {
  getPropertyStatusEditorData,
  updatePropertyStatusAction,
} from "../actions/status-actions";

type Props = {
  propertyId: string | null;
};

export default function PropertyStatusSelect({ propertyId }: Props) {
  const router = useRouter();

  const [status, setStatus] = useState<PropertyStatus | "">("");
  const [role, setRole] = useState<UserRole | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadStatus = useCallback(async () => {
    if (!propertyId) {
      setStatus("");
      setRole(null);
      setError("");
      setMessage("");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await getPropertyStatusEditorData(propertyId);

      if (!result.success) {
        setError(result.error);
        setStatus("");
        setRole(null);
        return;
      }

      setStatus(result.status);
      setRole(result.role);
    } catch (err) {
      console.error("[PropertyStatusSelect] Failed to load status", {
        propertyId,
        err,
      });

      setError("Could not load the property's status.");
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const allowedStatuses =
    role === "admin"
      ? ALL_PROPERTY_STATUSES
      : role === "agent"
        ? AGENT_EDITABLE_STATUSES
        : [];

  async function handleStatusChange(value: string) {
    const nextStatus = value as PropertyStatus;

    if (!propertyId || !allowedStatuses.includes(nextStatus)) {
      setError("You do not have permission to select this status.");
      return;
    }

    if (nextStatus === status) {
      return;
    }

    setError("");
    setMessage("");

    startTransition(async () => {
      try {
        const result = await updatePropertyStatusAction(
          propertyId,
          nextStatus,
        );

        if (!result.success) {
          setError(result.error);
          return;
        }

        setStatus(result.status);
        setMessage("Status updated successfully.");
        router.refresh();
      } catch (err) {
        console.error("[PropertyStatusSelect] Failed to update status", {
          propertyId,
          nextStatus,
          err,
        });

        setError("Could not update the property status.");
      }
    });
  }

  if (!propertyId) {
    return (
      <div className="w-full space-y-1">
        <Label className="text-xs text-muted-foreground">
          Listing status
        </Label>

        <div className="flex h-10 items-center rounded-lg border border-dashed px-3 text-sm text-muted-foreground">
          Save the property to manage its status.
        </div>
      </div>
    );
  }

  const currentStatusStyle = status
    ? STATUS_STYLES[status]
    : "border-border bg-background text-foreground";

  return (
    <div className="w-full space-y-1.5">
      <Label htmlFor="property-status" className="text-xs text-muted-foreground">
        Listing status
      </Label>

      <div
        className={`rounded-lg border p-1 transition-colors ${currentStatusStyle}`}
      >
        <Select
          value={status}
          onValueChange={handleStatusChange}
          disabled={
            isLoading ||
            isPending ||
            !role ||
            allowedStatuses.length === 0
          }
        >
          <SelectTrigger
            id="property-status"
            className="h-9 border-0 bg-transparent font-medium shadow-none focus:ring-0 focus:ring-offset-0"
            aria-label="Select property listing status"
          >
            <div className="flex min-w-0 items-center gap-2">
              {isLoading || isPending ? (
                <LoaderCircle className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
              )}

              <SelectValue
                placeholder={
                  isLoading ? "Loading status..." : "Select status"
                }
              />
            </div>
          </SelectTrigger>

          <SelectContent align="end">
            {allowedStatuses.map((item) => (
              <SelectItem key={item} value={item}>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[item]}`}
                >
                  {STATUS_LABELS[item]}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {role === "agent" && (
        <p className="text-xs text-muted-foreground">
          Agents can set Draft, Sold, Rented, or Withdrawn. Approval statuses
          are managed by admins.
        </p>
      )}

      {error && (
        <p className="flex items-start gap-1.5 text-xs text-red-600" role="alert">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {message && !error && (
        <p className="flex items-center gap-1.5 text-xs text-emerald-700" role="status">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>{message}</span>
        </p>
      )}
    </div>
  );
}
