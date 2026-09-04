"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { updateUserStatus } from "../_data/users.client";
import type { AdminUser } from "../_types/users";

export function UsersList({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  async function toggleStatus(user: AdminUser) {
    const nextStatus = user.status === "BANNED" ? "ACTIVE" : "BANNED";
    setUpdatingUserId(user.id);
    try {
      const response = await updateUserStatus(user.id, nextStatus);
      toast.success(response.message);
      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? { ...currentUser, status: nextStatus }
            : currentUser,
        ),
      );
    } catch (updateError) {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update user status.",
      );
    } finally {
      setUpdatingUserId(null);
    }
  }

  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">No users found.</p>;
  }

  return (
    <div className="divide-y rounded-md border">
      {users.map((user) => (
        <div
          key={user.id}
          className="grid gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center bg-white "
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{user.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{user.role}</p>
          <Button
            variant="outline"
            size="sm"
            disabled={updatingUserId === user.id}
            onClick={() => toggleStatus(user)}
          >
            {updatingUserId === user.id
              ? user.status === "BANNED"
                ? "Unbanning..."
                : "Banning..."
              : user.status === "BANNED"
                ? "Unban"
                : "Ban"}
          </Button>
        </div>
      ))}
    </div>
  );
}
