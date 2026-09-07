"use client";

import {
  useActionState,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

import { AppUser } from "../types";



import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser, UpdateUserState } from "./user-actions";


// ==========================================
// TYPES
// ==========================================

type Props = {
  user: AppUser | null;
};


// ==========================================
// INITIAL ACTION STATE
// ==========================================

const initialState: UpdateUserState = {
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
        ? "Updating..."
        : "Save changes"}
    </Button>
  );
}


// ==========================================
// USER FORM
// ==========================================

export function UserForm({
  user,
}: Props) {
  const router = useRouter();

  // ----------------------------------------
  // Server Action state
  // ----------------------------------------

  const [state, formAction] =
    useActionState(
      updateUser,
      initialState
    );


  // ----------------------------------------
  // Form state
  // ----------------------------------------

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [avatarUrl, setAvatarUrl] =
    useState("");

  const [agencyId, setAgencyId] =
    useState("");

  const [role, setRole] =
    useState<
      "user" | "admin" | "agent"
    >("user");


  // ----------------------------------------
  // Load selected user into form
  // ----------------------------------------

  useEffect(() => {
    if (!user) {
      return;
    }

    setFullName(
      user.full_name ?? ""
    );

    setEmail(
      user.email ?? ""
    );

    setPhone(
      user.phone ?? ""
    );

    setAvatarUrl(
      user.avatar_url ?? ""
    );

    setAgencyId(
      user.agency_id ?? ""
    );

    setRole(user.role);
  }, [user]);


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
  // No user selected
  // ----------------------------------------

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border">
        <p className="text-sm text-muted-foreground">
          Select a user to view their details.
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
          User details
        </h2>

        <p className="text-sm text-muted-foreground">
          Update the user's account information.
        </p>
      </div>


      {/* ================================== */}
      {/* USER ID */}
      {/* ================================== */}

      <input
        type="hidden"
        name="id"
        value={user.id}
      />

      <div className="space-y-2">
        <Label htmlFor="id">
          ID
        </Label>

        <Input
          id="id"
          value={user.id}
          readOnly
          disabled
        />
      </div>


      {/* ================================== */}
      {/* CREATED DATE */}
      {/* ================================== */}

      <div className="space-y-2">
        <Label htmlFor="created_at">
          Created on
        </Label>

        <Input
          id="created_at"
          value={new Date(
            user.created_at
          ).toLocaleString()}
          readOnly
          disabled
        />
      </div>


      {/* ================================== */}
      {/* FULL NAME */}
      {/* ================================== */}

      <div className="space-y-2">
        <Label htmlFor="full_name">
          Full name
        </Label>

        <Input
          id="full_name"
          name="full_name"
          value={fullName}
          onChange={(event) =>
            setFullName(
              event.target.value
            )
          }
        />
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
      {/* AVATAR URL */}
      {/* ================================== */}

      <div className="space-y-2">
        <Label htmlFor="avatar_url">
          Avatar URL
        </Label>

        <Input
          id="avatar_url"
          name="avatar_url"
          value={avatarUrl}
          onChange={(event) =>
            setAvatarUrl(
              event.target.value
            )
          }
        />
      </div>


      {/* ================================== */}
      {/* AGENCY ID */}
      {/* ================================== */}

      <div className="space-y-2">
        <Label htmlFor="agency_id">
          Agency ID
        </Label>

        <Input
          id="agency_id"
          name="agency_id"
          value={agencyId}
          onChange={(event) =>
            setAgencyId(
              event.target.value
            )
          }
        />
      </div>


      {/* ================================== */}
      {/* ROLE */}
      {/* ================================== */}

      <div className="space-y-2">
        <Label htmlFor="role">
          Role
        </Label>

        <Select
          name="role"
          value={role}
          onValueChange={(
            value
          ) =>
            setRole(
              value as
                | "user"
                | "admin"
                | "agent"
            )
          }
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>

          <SelectContent>

            <SelectItem value="user">
              User
            </SelectItem>

            <SelectItem value="agent">
              Agent
            </SelectItem>

            <SelectItem value="admin">
              Admin
            </SelectItem>

          </SelectContent>
        </Select>
      </div>


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