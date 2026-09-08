"use client";

import {
  useActionState,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

import { Agency, AgencyStatus } from "./agency-types";



import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import { StatusSelect } from "./status-select";

import {
  updateAgency,
  UpdateAgencyState,
} from "./agency-actions";
import { SocialLinkField } from "./social-links-fields";


// ==========================================
// TYPES
// ==========================================

type Props = {
  agency: Agency | null;
};


// ==========================================
// INITIAL ACTION STATE
// ==========================================

const initialState: UpdateAgencyState = {
  success: false,
};


// ==========================================
// SUBMIT BUTTON
// ==========================================

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending}
    >
      {pending
        ? "Saving..."
        : "Save changes"}
    </Button>
  );
}


// ==========================================
// AGENCY FORM
// ==========================================

export function AgencyForm({
  agency,
}: Props) {
  const router = useRouter();

  // ----------------------------------------
  // Server Action state
  // ----------------------------------------

  const [state, formAction] =
    useActionState(
      updateAgency,
      initialState
    );


  // ----------------------------------------
  // Form state
  // ----------------------------------------

  const [agencyName, setAgencyName] =
    useState("");

  const [town, setTown] = useState("");

  const [location, setLocation] =
    useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [instagram, setInstagram] =
    useState("");

  const [tiktok, setTiktok] =
    useState("");

  const [facebook, setFacebook] =
    useState("");

  const [status, setStatus] =
    useState<AgencyStatus>("pending");

  const [reason, setReason] =
    useState("");


  // ----------------------------------------
  // Load selected agency into form
  // ----------------------------------------

  useEffect(() => {
    if (!agency) {
      return;
    }

    setAgencyName(agency.agency_name);
    setTown(agency.town);
    setLocation(agency.location);
    setEmail(agency.email);
    setPhone(agency.phone);

    setInstagram(agency.instagram ?? "");
    setTiktok(agency.tiktok ?? "");
    setFacebook(agency.facebook ?? "");

    setStatus(agency.status);
    setReason(
      agency.rejection_reason ?? ""
    );
  }, [agency]);


  // ----------------------------------------
  // Refresh page after successful update
  // ----------------------------------------

  useEffect(() => {
    if (!state.success) {
      return;
    }

    router.refresh();
  }, [
    state.success,
    router,
  ]);


  // ----------------------------------------
  // No agency selected
  // ----------------------------------------

  if (!agency) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border">
        <p className="text-sm text-muted-foreground">
          Select an agency to view its details.
        </p>
      </div>
    );
  }


  // ========================================
  // RENDER
  // ========================================

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-lg border p-5"
    >

      {/* ================================== */}
      {/* HEADER */}
      {/* ================================== */}

      <div>
        <h2 className="text-lg font-semibold">
          Agency details
        </h2>

        <p className="text-sm text-muted-foreground">
          Edit the agency's information and status.
        </p>
      </div>


      {/* ================================== */}
      {/* AGENCY ID */}
      {/* ================================== */}

      <input
        type="hidden"
        name="id"
        value={agency.id}
      />


      {/* ================================== */}
      {/* AGENCY NAME */}
      {/* ================================== */}

      <div className="space-y-2">
        <Label htmlFor="agency_name">
          Agency name
        </Label>

        <Input
          id="agency_name"
          name="agency_name"
          value={agencyName}
          onChange={(event) =>
            setAgencyName(
              event.target.value
            )
          }
        />
      </div>


      {/* ================================== */}
      {/* TOWN / LOCATION */}
      {/* ================================== */}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="town">
            Town
          </Label>

          <Input
            id="town"
            name="town"
            value={town}
            onChange={(event) =>
              setTown(
                event.target.value
              )
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">
            Location
          </Label>

          <Input
            id="location"
            name="location"
            value={location}
            onChange={(event) =>
              setLocation(
                event.target.value
              )
            }
          />
        </div>
      </div>


      {/* ================================== */}
      {/* EMAIL */}
      {/* ================================== */}

      <div className="space-y-2">
        <Label htmlFor="email">
          Email
        </Label>

        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value
            )
          }
        />
      </div>


      {/* ================================== */}
      {/* PHONE */}
      {/* ================================== */}

      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone
        </Label>

        <Input
          id="phone"
          name="phone"
          value={phone}
          onChange={(event) =>
            setPhone(
              event.target.value
            )
          }
        />
      </div>


      {/* ================================== */}
      {/* SOCIAL LINKS (editable, open in a new tab) */}
      {/* ================================== */}

      <SocialLinkField
        id="instagram"
        name="instagram"
        label="Instagram"
        value={instagram}
        onChange={setInstagram}
      />

      <SocialLinkField
        id="tiktok"
        name="tiktok"
        label="TikTok"
        value={tiktok}
        onChange={setTiktok}
      />

      <SocialLinkField
        id="facebook"
        name="facebook"
        label="Facebook"
        value={facebook}
        onChange={setFacebook}
      />


      {/* ================================== */}
      {/* STATUS + REASON */}
      {/* ================================== */}

         <StatusSelect
        status={status}
        reason={reason}
        onStatusChange={setStatus}
        onReasonChange={setReason}
      />


      {/* ================================== */}
      {/* ERROR MESSAGE */}
      {/* ================================== */}

      {state.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}


      {/* ================================== */}
      {/* SUCCESS MESSAGE */}
      {/* ================================== */}

      {state.success && (
        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
          {state.message}
        </div>
      )}


      {/* ================================== */}
      {/* SAVE BUTTON */}
      {/* ================================== */}

      <SubmitButton />

    </form>
  );
}