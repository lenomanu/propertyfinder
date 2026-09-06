"use client";

import { AppUser } from "../types";



type Props = {
  users: AppUser[];
  selectedId: string | null;
  onSelect: (user: AppUser) => void;
};

export function UserTable({
  users,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left">
            <th className="px-4 py-3">
              Name
            </th>

            <th className="px-4 py-3">
              Email
            </th>

            <th className="px-4 py-3">
              Role
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              onClick={() => onSelect(user)}
              className={`
                cursor-pointer
                border-t
                transition-colors
                hover:bg-muted/50
                ${
                  selectedId === user.id
                    ? "bg-muted"
                    : ""
                }
              `}
            >
              <td className="px-4 py-3">
                {user.full_name || "—"}
              </td>

              <td className="px-4 py-3">
                {user.email || "—"}
              </td>

              <td className="px-4 py-3 capitalize">
                {user.role}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p className="p-6 text-center text-sm text-muted-foreground">
          No users found.
        </p>
      )}
    </div>
  );
}