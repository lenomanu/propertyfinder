"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ApplicationState, ApplicationValues } from "./types";

import {
  submitAgentApplication,
} from "./actions";

const initialValues: ApplicationValues = {
  agencyName: "",
  town: "",
  location: "",
  email: "",
  phone: "",
  instagram: "",
  tiktok: "",
  facebook: "",
};

const initialState: ApplicationState = {
  success: false,
  message: "",
  values: initialValues,
};

export default function AgencyApplicationForm() {
  // --------------------------------------------------
  // Server Action State
  // --------------------------------------------------

  const [state, formAction, isPending] = useActionState(
    submitAgentApplication,
    initialState
  );

  // --------------------------------------------------
  // Local Form State
  // --------------------------------------------------

  const [values, setValues] =
    useState<ApplicationValues>(initialValues);

  // --------------------------------------------------
  // Restore values returned by server
  // --------------------------------------------------

  useEffect(() => {
    if (state.values) {
      setValues(state.values);
    }
  }, [state.values]);

  // --------------------------------------------------
  // Handle input changes
  // --------------------------------------------------

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  

  return (
    <div className="container mx-auto px-4 py-10 md:px-6 2xl:max-w-[1400px]">
      <Card>
        <CardHeader>
          <CardTitle>Agency Details</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={formAction}>
            {/* ================================================== */}
            {/* AGENCY INFORMATION */}
            {/* ================================================== */}

            <div>
              <h3 className="text-lg font-medium">
                Agency Information
              </h3>

              <p className="text-sm text-muted-foreground">
                Tell us about your agency so clients can find and
                reach you.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                {/* ------------------------------------------------ */}
                {/* Agency Name */}
                {/* ------------------------------------------------ */}

                <div className="col-span-full space-y-2">
                  <Label htmlFor="agencyName">
                    Agency name
                  </Label>

                  <Input
                    id="agencyName"
                    name="agencyName"
                    value={values.agencyName}
                    onChange={handleChange}
                    placeholder="Enter agency name"
                    disabled={isPending}
                  />

                  {state.errors?.agencyName && (
                    <p className="text-sm text-destructive">
                      {state.errors.agencyName[0]}
                    </p>
                  )}
                </div>

                {/* ------------------------------------------------ */}
                {/* Town */}
                {/* ------------------------------------------------ */}

                <div className="space-y-2">
                  <Label htmlFor="town">Town</Label>

                  <Input
                    id="town"
                    name="town"
                    value={values.town}
                    onChange={handleChange}
                    placeholder="Enter town"
                    disabled={isPending}
                  />

                  {state.errors?.town && (
                    <p className="text-sm text-destructive">
                      {state.errors.town[0]}
                    </p>
                  )}
                </div>

                {/* ------------------------------------------------ */}
                {/* Location */}
                {/* ------------------------------------------------ */}

                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location
                  </Label>

                  <Input
                    id="location"
                    name="location"
                    value={values.location}
                    onChange={handleChange}
                    placeholder="Enter location / address"
                    disabled={isPending}
                  />

                  {state.errors?.location && (
                    <p className="text-sm text-destructive">
                      {state.errors.location[0]}
                    </p>
                  )}
                </div>

                {/* ------------------------------------------------ */}
                {/* Email */}
                {/* ------------------------------------------------ */}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    disabled={isPending}
                  />

                  {state.errors?.email && (
                    <p className="text-sm text-destructive">
                      {state.errors.email[0]}
                    </p>
                  )}
                </div>

                {/* ------------------------------------------------ */}
                {/* Phone */}
                {/* ------------------------------------------------ */}

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone number
                  </Label>

                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    disabled={isPending}
                  />

                  {state.errors?.phone && (
                    <p className="text-sm text-destructive">
                      {state.errors.phone[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* ================================================== */}
            {/* SOCIAL LINKS */}
            {/* ================================================== */}

            <div>
              <h3 className="text-lg font-medium">
                Social Links
              </h3>

              <p className="text-sm text-muted-foreground">
                Add your agency&apos;s social profiles.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                {/* ------------------------------------------------ */}
                {/* Instagram */}
                {/* ------------------------------------------------ */}

                <div className="space-y-2">
                  <Label htmlFor="instagram">
                    Instagram
                  </Label>

                  <Input
                    id="instagram"
                    name="instagram"
                    type="url"
                    value={values.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/youragency"
                    disabled={isPending}
                  />

                  {state.errors?.instagram && (
                    <p className="text-sm text-destructive">
                      {state.errors.instagram[0]}
                    </p>
                  )}
                </div>

                {/* ------------------------------------------------ */}
                {/* TikTok */}
                {/* ------------------------------------------------ */}

                <div className="space-y-2">
                  <Label htmlFor="tiktok">
                    TikTok
                  </Label>

                  <Input
                    id="tiktok"
                    name="tiktok"
                    type="url"
                    value={values.tiktok}
                    onChange={handleChange}
                    placeholder="https://tiktok.com/@youragency"
                    disabled={isPending}
                  />

                  {state.errors?.tiktok && (
                    <p className="text-sm text-destructive">
                      {state.errors.tiktok[0]}
                    </p>
                  )}
                </div>

                {/* ------------------------------------------------ */}
                {/* Facebook */}
                {/* ------------------------------------------------ */}

                <div className="space-y-2">
                  <Label htmlFor="facebook">
                    Facebook
                  </Label>

                  <Input
                    id="facebook"
                    name="facebook"
                    type="url"
                    value={values.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/youragency"
                    disabled={isPending}
                  />

                  {state.errors?.facebook && (
                    <p className="text-sm text-destructive">
                      {state.errors.facebook[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ================================================== */}
            {/* SERVER MESSAGE */}
            {/* ================================================== */}

            {state.message && (
              <div
                className={`mt-8 rounded-md border p-4 text-sm ${
                  state.success
                    ? "border-green-500/30 bg-green-500/10 text-green-700"
                    : "border-destructive/30 bg-destructive/10 text-destructive"
                }`}
              >
                {state.message}
              </div>
            )}

            {/* ================================================== */}
            {/* SUBMIT BUTTON */}
            {/* ================================================== */}

            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending
                  ? "Submitting..."
                  : "Submit Agency Application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}