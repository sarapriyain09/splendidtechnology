"use client";

import { Account, createAccount, deactivateAccount, getAccounts, updateAccount } from "@/lib/api";
import { clearSession, getSession } from "@/lib/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const categories = ["assets", "liabilities", "equity", "income", "expenses"];
const vatRates = ["20%", "5%", "0%", "Exempt"];

type FormState = {
  code: string;
  name: string;
  category: string;
  subtype: string;
  vat_rate: string;
};

const emptyForm: FormState = {
  code: "",
  name: "",
  category: "expenses",
  subtype: "",
  vat_rate: "20%",
};

export default function AccountsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = getSession();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [router, session]);

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
    enabled: !!session,
  });

  const createMutation = useMutation({
    mutationFn: () => createAccount(form),
    onSuccess: () => {
      setForm(emptyForm);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to create account");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; record: Account }) =>
      updateAccount(payload.id, {
        name: payload.record.name,
        category: payload.record.category,
        subtype: payload.record.subtype,
        vat_rate: payload.record.vat_rate,
        is_active: payload.record.is_active,
      }),
    onSuccess: () => {
      setEditingId(null);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to update account");
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateAccount(id),
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to deactivate account");
    },
  });

  function logout() {
    clearSession();
    router.push("/login");
  }

  function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createMutation.mutate();
  }

  if (!session) return null;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Chart of Accounts</p>
          <h1 className="text-3xl font-semibold text-ink">Company account structure</h1>
          <p className="mt-1 text-sm text-ink/70">
            Signed in as {session.user.full_name} ({session.user.role})
          </p>
        </div>
        <button className="rounded-lg border border-ink/20 px-4 py-2 text-sm font-medium" onClick={logout}>
          Log out
        </button>
      </header>

      <section className="mb-7 rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-[0_20px_50px_-40px_rgba(14,36,51,0.6)]">
        <h2 className="mb-4 text-lg font-semibold">Create account</h2>
        <form className="grid gap-3 md:grid-cols-6" onSubmit={submitCreate}>
          <input
            className="rounded-lg border border-ink/20 px-3 py-2"
            placeholder="Code"
            value={form.code}
            onChange={(e) => setForm((s) => ({ ...s, code: e.target.value }))}
            required
          />
          <input
            className="md:col-span-2 rounded-lg border border-ink/20 px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            required
          />
          <select
            className="rounded-lg border border-ink/20 px-3 py-2"
            value={form.category}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            className="rounded-lg border border-ink/20 px-3 py-2"
            placeholder="Subtype"
            value={form.subtype}
            onChange={(e) => setForm((s) => ({ ...s, subtype: e.target.value }))}
          />
          <select
            className="rounded-lg border border-ink/20 px-3 py-2"
            value={form.vat_rate}
            onChange={(e) => setForm((s) => ({ ...s, vat_rate: e.target.value }))}
          >
            {vatRates.map((vat) => (
              <option key={vat} value={vat}>
                {vat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="md:col-span-6 rounded-lg bg-teal px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {createMutation.isPending ? "Creating..." : "Create account"}
          </button>
        </form>
        {error ? <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      </section>

      <section className="overflow-hidden rounded-2xl border border-ink/10 bg-white/95">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-mint text-ink/80">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Subtype</th>
                <th className="px-4 py-3">VAT</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accountsQuery.isLoading ? (
                <tr>
                  <td className="px-4 py-5 text-ink/60" colSpan={7}>
                    Loading accounts...
                  </td>
                </tr>
              ) : null}
              {accountsQuery.data?.map((row) => (
                <tr key={row.id} className="border-t border-ink/10 align-top">
                  <td className="px-4 py-3 font-mono text-xs">{row.code}</td>
                  <td className="px-4 py-3">
                    {editingId === row.id ? (
                      <form>
                        <input
                          className="w-full rounded border border-ink/20 px-2 py-1"
                          value={row.name}
                          onChange={(e) => {
                            queryClient.setQueryData<Account[]>(
                              ["accounts"],
                              (prev) => prev?.map((it) => (it.id === row.id ? { ...it, name: e.target.value } : it)) ?? []
                            );
                          }}
                        />
                      </form>
                    ) : (
                      row.name
                    )}
                  </td>
                  <td className="px-4 py-3">{row.category}</td>
                  <td className="px-4 py-3">{row.subtype || "-"}</td>
                  <td className="px-4 py-3">{row.vat_rate}</td>
                  <td className="px-4 py-3">{row.is_active ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {!row.is_system ? (
                        <>
                          {editingId === row.id ? (
                            <button
                              type="button"
                              className="rounded border border-teal px-2 py-1 text-xs font-semibold text-teal"
                              onClick={() => updateMutation.mutate({ id: row.id, record: row })}
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="rounded border border-ink/30 px-2 py-1 text-xs"
                              onClick={() => setEditingId(row.id)}
                            >
                              Edit
                            </button>
                          )}
                          {row.is_active ? (
                            <button
                              type="button"
                              className="rounded border border-rose-200 px-2 py-1 text-xs text-rose-700"
                              onClick={() => deactivateMutation.mutate(row.id)}
                            >
                              Deactivate
                            </button>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-xs text-ink/50">System</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
