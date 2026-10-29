
"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import GpsLocation from "./steps/gps-location";
import StepIndicator from "./steps/step-indicator";
import BasicDetails from "./steps/basic-information";
import PropertyImages from "./steps/images";
import Details from "./steps/details";
import PropertyStatusSelect from "./PropertyStatusSelect";

import {
  getPropertyPublishState,
  publishPropertyAction,
} from "@/app/property/actions/actions";
import PropertyMap from "./PropertyMap";

interface PropertyFormProps {
  propertyId?: string | null;
}

export default function PropertyForm({ propertyId }: PropertyFormProps) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [propertyIdState, setPropertyIdState] = useState<string>(
    propertyId ?? "",
  );
  const [propertyType, setPropertyType] = useState("");
  const [error, setError] = useState("");
  const [propertyStatus, setPropertyStatus] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [isPublishing, startPublishing] = useTransition();

  useEffect(() => {
    setPropertyIdState(propertyId ?? "");
    setPropertyStatus(null);
    setError("");
  }, [propertyId]);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      if (!propertyIdState) {
        setPropertyStatus(null);
        setCheckingStatus(false);
        return;
      }

      setCheckingStatus(true);

      try {
        const result = await getPropertyPublishState(propertyIdState);

        if (!cancelled) {
          setPropertyStatus(result.status);
        }
      } catch (err) {
        console.error("[PropertyForm] Error checking property status", {
          propertyId: propertyIdState,
          error: err,
        });

        if (!cancelled) {
          setPropertyStatus(null);
          setError("Unable to check property status. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setCheckingStatus(false);
        }
      }
    }

    void loadStatus();

    return () => {
      cancelled = true;
    };
  }, [propertyIdState]);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => setError(""), 5000);

    return () => clearTimeout(timer);
  }, [error]);

  const nextStep = () => {
    if (!propertyIdState.trim() || !propertyType.trim()) {
      setError(
        "Please complete the required fields and save the property first.",
      );
      return;
    }

    setError("");

    if (step < 4) {
      setStep((current) => current + 1);
    }
  };

  const previousStep = () => {
    setError("");

    if (step > 1) {
      setStep((current) => current - 1);
    }
  };

  const publishProperty = () => {
    if (!propertyIdState) {
      setError("Please save the property before publishing.");
      return;
    }

    if (propertyStatus !== "draft") {
      setError("Only draft properties can be published.");
      return;
    }

    setError("");

    startPublishing(async () => {
      try {
        const result = await publishPropertyAction(propertyIdState);

        if (!result.success) {
          setError(result.error ?? "Unable to publish the property.");

          try {
            const latest = await getPropertyPublishState(propertyIdState);
            setPropertyStatus(latest.status);
          } catch (refreshError) {
            console.error(
              "[PropertyForm] Failed to refresh property status",
              refreshError,
            );
          }
        } else {
          router.refresh();
        }
      } catch (err) {
        console.error("[PropertyForm] Publishing property failed", err);
        setError("An unexpected error occurred while publishing.");
      }
    });
  };

  const canPublish =
    Boolean(propertyIdState) &&
    propertyStatus === "draft" &&
    !checkingStatus &&
    !isPublishing;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Heading and status selector share the same row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Add Property
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Complete the steps below to create your property listing.
          </p>
        </div>

        <div className="w-full sm:w-64 sm:shrink-0">
          <PropertyStatusSelect propertyId={propertyIdState} />
        </div>
      </div>

      <StepIndicator currentStep={step} />

      <Card>
        <CardContent className="p-6 md:p-8">
          {step === 1 && (
            <BasicDetails
              propertyId={propertyIdState}
              setPropertyId={setPropertyIdState}
              propertyType={propertyType}
              setPropertyType={setPropertyType}
            />
          )}

          {step === 2 && (
            <Details
              propertyId={propertyIdState}
              propertyType={propertyType}
            />
          )}

          {step === 3 && <PropertyMap propertyId={propertyIdState} />}

          {step === 4 && (
            <PropertyImages propertyId={propertyIdState} />
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={previousStep}
          disabled={step === 1 || isPublishing}
        >
          Back
        </Button>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          {error && (
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}

          {step < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={isPublishing}
            >
              Continue
            </Button>
          ) : (
            <div className="flex flex-col items-start gap-2">
              {propertyStatus && (
                <p className="text-xs text-muted-foreground">
                  Publish status: {propertyStatus}
                </p>
              )}

              <Button
                type="button"
                onClick={publishProperty}
                disabled={!canPublish}
              >
                {checkingStatus
                  ? "Checking status..."
                  : isPublishing
                    ? "Publishing..."
                    : propertyStatus === "pending"
                      ? "Awaiting Approval"
                      : propertyStatus === "approved"
                        ? "Already Published"
                        : propertyStatus === "draft"
                          ? "Publish Property"
                          : "Cannot Publish"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
