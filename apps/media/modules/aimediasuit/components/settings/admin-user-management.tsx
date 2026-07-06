"use client";

import { FormEvent, useState } from "react";

type Props = {
  isAdmin: boolean;
};

export function AdminUserManagement({ isAdmin }: Props) {
  const [createEmail, setCreateEmail] = useState("");
  const [createName, setCreateName] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createStatus, setCreateStatus] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetStatus, setResetStatus] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

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
        }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create user.");
      }

      setCreateStatus(`User created: ${createEmail.trim().toLowerCase()}`);
      setCreateEmail("");
      setCreateName("");
      setCreatePassword("");
    } catch (error) {
      setCreateStatus(error instanceof Error ? error.message : "Failed to create user.");
    } finally {
      setCreating(false);
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
        throw new Error(data.error ?? "Failed to change password.");
      }

      setResetStatus(`Password updated for: ${resetEmail.trim().toLowerCase()}`);
      setResetEmail("");
      setNewPassword("");
    } catch (error) {
      setResetStatus(error instanceof Error ? error.message : "Failed to change password.");
    } finally {
      setResetting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="panel rounded-2xl p-5 text-sm text-rose-200">
        You do not have permission to manage users.
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <form className="panel rounded-2xl p-5" onSubmit={handleCreateUser}>
        <h2 className="text-lg font-semibold text-white">Create User</h2>
        <p className="mt-1 text-sm text-slate-300">Create a new login for AIMedia.</p>

        <label className="mt-4 block text-sm text-blue-100/80">Name</label>
        <input
          type="text"
          className="mt-2 w-full rounded-xl border border-white/15 bg-[#05122a] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-300/35"
          value={createName}
          onChange={(event) => setCreateName(event.target.value)}
          placeholder="Optional"
        />

        <label className="mt-4 block text-sm text-blue-100/80">Email</label>
        <input
          type="email"
          className="mt-2 w-full rounded-xl border border-white/15 bg-[#05122a] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-300/35"
          value={createEmail}
          onChange={(event) => setCreateEmail(event.target.value)}
          required
        />

        <label className="mt-4 block text-sm text-blue-100/80">Temporary Password</label>
        <input
          type="password"
          className="mt-2 w-full rounded-xl border border-white/15 bg-[#05122a] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-300/35"
          value={createPassword}
          onChange={(event) => setCreatePassword(event.target.value)}
          minLength={8}
          required
        />

        {createStatus ? <p className="mt-3 text-sm text-cyan-200">{createStatus}</p> : null}

        <button
          type="submit"
          disabled={creating}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creating ? "Creating..." : "Create User"}
        </button>
      </form>

      <form className="panel rounded-2xl p-5" onSubmit={handleResetPassword}>
        <h2 className="text-lg font-semibold text-white">Reset Password</h2>
        <p className="mt-1 text-sm text-slate-300">Change password for an existing AIMedia user.</p>

        <label className="mt-4 block text-sm text-blue-100/80">User Email</label>
        <input
          type="email"
          className="mt-2 w-full rounded-xl border border-white/15 bg-[#05122a] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-300/35"
          value={resetEmail}
          onChange={(event) => setResetEmail(event.target.value)}
          required
        />

        <label className="mt-4 block text-sm text-blue-100/80">New Password</label>
        <input
          type="password"
          className="mt-2 w-full rounded-xl border border-white/15 bg-[#05122a] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-300/35"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          minLength={8}
          required
        />

        {resetStatus ? <p className="mt-3 text-sm text-cyan-200">{resetStatus}</p> : null}

        <button
          type="submit"
          disabled={resetting}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resetting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
