"use client";

import { useState } from "react";
import { AppUser } from "../types";
import { UserTable } from "./user-table";
import { UserForm } from "./user-form";


type Props = {
  users: AppUser[];
};

export function UsersManager({ users }: Props) {
  const [selectedUser, setSelectedUser] =
    useState<AppUser | null>(users[0] ?? null);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* Users table */}
      <UserTable
        users={users}
        selectedId={selectedUser?.id ?? null}
        onSelect={setSelectedUser}
      />

      {/* User details */}
      <UserForm
        key={selectedUser?.id ?? "empty"}
        user={selectedUser}
      />
    </div>
  );
}