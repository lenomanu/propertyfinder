"use client";

import { useState } from "react";



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
import { updateUser } from "./user-actions";
import { AppUser, UserRole } from "../types";

type Props = {
  user: AppUser | null;
};

export function UserForm({ user }: Props) {
  const [fullName, setFullName] = useState(
    user?.full_name ?? ""
  );

  const [email, setEmail] = useState(
    user?.email ?? ""
  );

  const [phone, setPhone] = useState(
    user?.phone ?? ""
  );

  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar_url ?? ""
  );

  const [agencyId, setAgencyId] = useState(
    user?.agency_id ?? ""
  );

  const [role, setRole] = useState<UserRole>(
    user?.role ?? "user"
  );

  const [message, setMessage] = useState("");

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border">
        <p className="text-sm text-muted-foreground">
          Select a user to view their details.
        </p>
      </div>
    );
  }

  async function handleSubmit(formData: FormData) {
    setMessage("");

    const result = await updateUser(formData);

  
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-5 rounded-lg border p-5"
    >
      {/* Header */}

      <div>
        <h2 className="text-lg font-semibold">
          User details
        </h2>

        <p className="text-sm text-muted-foreground">
          Account identifiers are read-only.
        </p>
      </div>

      {/* Hidden ID */}

      <input
        type="hidden"
        name="id"
        value={user.id}
      />

      {/* ID */}

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

      {/* Created At */}

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

      {/* Full Name */}

      <div className="space-y-2">
        <Label htmlFor="full_name">
          Full name
        </Label>

        <Input
          id="full_name"
          name="full_name"
          value={fullName}
          onChange={(event) =>
            setFullName(event.target.value)
          }
        />
      </div>

      {/* Email */}

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
            setEmail(event.target.value)
          }
        />
      </div>

      {/* Phone */}

      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone
        </Label>

        <Input
          id="phone"
          name="phone"
          value={phone}
          onChange={(event) =>
            setPhone(event.target.value)
          }
        />
      </div>

      {/* Avatar */}

      <div className="space-y-2">
        <Label htmlFor="avatar_url">
          Avatar URL
        </Label>

        <Input
          id="avatar_url"
          name="avatar_url"
          value={avatarUrl}
          onChange={(event) =>
            setAvatarUrl(event.target.value)
          }
        />
      </div>

      {/* Agency */}

      <div className="space-y-2">
        <Label htmlFor="agency_id">
          Agency ID
        </Label>

        <Input
          id="agency_id"
          name="agency_id"
          value={agencyId}
          onChange={(event) =>
            setAgencyId(event.target.value)
          }
        />
      </div>

      {/* Role */}

      <div className="space-y-2">
        <Label>
          Role
        </Label>

        <Select
          name="role"
          value={role}
          onValueChange={(value) =>
            setRole(value as UserRole)
          }
        >
          <SelectTrigger>
            <SelectValue />
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

      {/* Save */}

      <Button
        type="submit"
        className="w-full"
      >
        Save changes
      </Button>

      {/* Message */}

      {message && (
        <p className="text-sm text-muted-foreground">
          {message}
        </p>
      )}
    </form>
  );
}