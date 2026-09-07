"use client";

import { useState } from "react";


import { UserTable } from "./user-table";
import { UserForm } from "./user-form";
import { AppUser } from "../types";

type Props = {
  users: AppUser[];
};

export function UsersManager({
  users,
}: Props) {
  // Store only the ID of the selected user.
  // This allows the selected user to survive
  // when the server refreshes the users list.
  const [selectedId, setSelectedId] =
    useState<string | null>(
      users[0]?.id ?? null
    );

  // Always get the selected user from the
  // latest users array.
  const selectedUser =
    users.find(
      (user) => user.id === selectedId
    ) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* -------------------------------- */}
      {/* Users table */}
      {/* -------------------------------- */}

      <UserTable
        users={users}
        selectedId={selectedId}
        onSelect={(user) => {
          setSelectedId(user.id);
        }}
      />

      {/* -------------------------------- */}
      {/* User details */}
      {/* -------------------------------- */}

      <UserForm user={selectedUser} />
    </div>
  );
}