"use client";

import { FormEvent, useEffect, useState } from "react";

type Props = {
  isAdmin: boolean;
};

type ManagedUser = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "USER";
  isActive: boolean;
  license: string | null;
  features: string[];
};

export function AdminUserManagement({ isAdmin }: Props) {
  const [createEmail, setCreateEmail] = useState("");
  const [createName, setCreateName] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState<"USER" | "ADMIN">("USER");
  const [createStatus, setCreateStatus] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetStatus, setResetStatus] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [licenseTiers, setLicenseTiers] = useState<Array<{ name: string; features: string[] }>>([]);
  const [selectedTierByEmail, setSelectedTierByEmail] = useState<Record<string, string>>({});
  const [updatingEmail, setUpdatingEmail] = useState<string | null>(null);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const [usersStatus, setUsersStatus] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const loadUsers = async () => {
    setUsersStatus(null);
    setLoadingUsers(true);
    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        users?: ManagedUser[];
        licenseTiers?: Array<{ name: string; features: string[] }>;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load users.");
      }

      const nextUsers = data.users ?? [];
      const nextLicenseTiers = data.licenseTiers ?? [];
      const nextSelection: Record<string, string> = {};
      for (const user of nextUsers) {
        nextSelection[user.email] = user.license ?? "Starter";
      }

      setUsers(nextUsers);
      setLicenseTiers(nextLicenseTiers);
      setSelectedTierByEmail(nextSelection);
    } catch (error) {
      setUsersStatus(error instanceof Error ? error.message : "Failed to load users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      void loadUsers();
    }
  }, [isAdmin]);

  const handleCreateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateStatus(null);
    setCreating(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: createEmail,
          name: createName,
          password: createPassword,
          role: createRole,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create user.");
      }

      setCreateStatus(`User created: ${createEmail.trim().toLowerCase()} (${createRole})`);
      setCreateEmail("");
      setCreateName("");
      setCreatePassword("");
      setCreateRole("USER");
      await loadUsers();
    } catch (error) {
      setCreateStatus(error instanceof Error ? error.message : "Failed to create user.");
    } finally {
      setCreating(false);
    }
  };

  const handleAssignTier = async (email: string) => {
    const licenseName = selectedTierByEmail[email];
    if (!licenseName) {
      setUsersStatus("Please select a module tier.");
      return;
    }

    setUsersStatus(null);
    setUpdatingEmail(email);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, licenseName }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        features?: string[];
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to assign modules.");
      }

      setUsersStatus(`Updated ${email} to ${licenseName}.`);
      await loadUsers();
    } catch (error) {
      setUsersStatus(error instanceof Error ? error.message : "Failed to assign modules.");
    } finally {
      setUpdatingEmail(null);
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResetStatus(null);
    setResetting(true);

    try {
      const response = await fetch("/api/admin/users/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          newPassword,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to update password.");
      }

      setResetStatus(`Password updated for: ${resetEmail.trim().toLowerCase()}`);
      setResetEmail("");
      setNewPassword("");
    } catch (error) {
      setResetStatus(error instanceof Error ? error.message : "Failed to update password.");
    } finally {
      setResetting(false);
    }
  };

  const handleDeleteUser = async (email: string) => {
    const confirmed = window.confirm(`Delete user ${email}? This will remove their access.`);
    if (!confirmed) return;

    setUsersStatus(null);
    setDeletingEmail(email);

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete user.");
      }

      setUsersStatus(`Deleted user ${email}.`);
      await loadUsers();
    } catch (error) {
      setUsersStatus(error instanceof Error ? error.message : "Failed to delete user.");
    } finally {
      setDeletingEmail(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Only administrators can create users or reset passwords.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="rounded-lg border border-gray-200 bg-white p-5 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Users and module access</h2>
            <p className="mt-1 text-gray-600">View users and assign module bundles.</p>
          </div>
          <button
            type="button"
            onClick={() => void loadUsers()}
            className="rounded-md border border-gray-300 px-3 py-2 text-gray-700 transition hover:bg-gray-50"
            disabled={loadingUsers}
          >
            {loadingUsers ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {usersStatus ? <p className="mt-3 text-gray-700">{usersStatus}</p> : null}

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Current modules</th>
                <th className="px-3 py-2">Assign modules</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-100 align-top">
                  <td className="px-3 py-2">
                    <p className="font-medium text-gray-900">{user.name || "Unnamed user"}</p>
                    <p className="text-gray-600">{user.email}</p>
                  </td>
                  <td className="px-3 py-2 text-gray-700">{user.role}</td>
                  <td className="px-3 py-2 text-gray-700">
                    <p>{user.features.length ? user.features.join(", ") : "CRM"}</p>
                    <p className="text-xs text-gray-500">Tier: {user.license ?? "Starter"}</p>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
                        value={selectedTierByEmail[user.email] ?? "Starter"}
                        onChange={(event) =>
                          setSelectedTierByEmail((prev) => ({
                            ...prev,
                            [user.email]: event.target.value,
                          }))
                        }
                      >
                        {licenseTiers.map((tier) => (
                          <option key={tier.name} value={tier.name}>
                            {tier.name} ({tier.features.join(", ")})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => void handleAssignTier(user.email)}
                        className="rounded-md bg-gray-900 px-3 py-2 text-white transition hover:bg-black disabled:opacity-60"
                        disabled={updatingEmail === user.email}
                      >
                        {updatingEmail === user.email ? "Saving..." : "Assign"}
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => void handleDeleteUser(user.email)}
                      className="rounded-md border border-red-300 px-3 py-2 text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                      disabled={deletingEmail === user.email}
                    >
                      {deletingEmail === user.email ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
      <form onSubmit={handleCreateUser} className="rounded-lg border border-gray-200 bg-white p-5 text-sm">
        <h2 className="text-base font-semibold text-gray-900">Create user</h2>
        <p className="mt-1 text-gray-600">Add a new user for Growth Platform access.</p>

        <label className="mt-4 block text-gray-700">Name</label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          value={createName}
          onChange={(event) => setCreateName(event.target.value)}
          placeholder="Optional"
        />

        <label className="mt-3 block text-gray-700">Email</label>
        <input
          type="email"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          value={createEmail}
          onChange={(event) => setCreateEmail(event.target.value)}
          required
        />

        <label className="mt-3 block text-gray-700">Password</label>
        <input
          type="password"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          value={createPassword}
          onChange={(event) => setCreatePassword(event.target.value)}
          minLength={8}
          required
        />

        <label className="mt-3 block text-gray-700">Role</label>
        <select
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          value={createRole}
          onChange={(event) => setCreateRole(event.target.value === "ADMIN" ? "ADMIN" : "USER")}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        {createStatus ? <p className="mt-3 text-gray-700">{createStatus}</p> : null}

        <button
          type="submit"
          disabled={creating}
          className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-white transition hover:bg-black disabled:opacity-60"
        >
          {creating ? "Creating..." : "Create user"}
        </button>
      </form>

      <form onSubmit={handleResetPassword} className="rounded-lg border border-gray-200 bg-white p-5 text-sm">
        <h2 className="text-base font-semibold text-gray-900">Reset password</h2>
        <p className="mt-1 text-gray-600">Set a new password for an existing user.</p>

        <label className="mt-4 block text-gray-700">User email</label>
        <input
          type="email"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          value={resetEmail}
          onChange={(event) => setResetEmail(event.target.value)}
          required
        />

        <label className="mt-3 block text-gray-700">New password</label>
        <input
          type="password"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          minLength={8}
          required
        />

        {resetStatus ? <p className="mt-3 text-gray-700">{resetStatus}</p> : null}

        <button
          type="submit"
          disabled={resetting}
          className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-white transition hover:bg-black disabled:opacity-60"
        >
          {resetting ? "Updating..." : "Update password"}
        </button>
      </form>
      </div>
    </div>
  );
}
