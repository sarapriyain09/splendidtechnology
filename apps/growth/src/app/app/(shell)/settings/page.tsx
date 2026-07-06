import { getSession } from "@/common/auth";
import { LICENSE_TIERS } from "@/common/licensing";
import { AdminUserManagement } from "./admin-user-management";

export default async function SettingsPage() {
  const session = await getSession();
  const features = session?.user?.features ?? [];
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        Account and license overview.
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Payments are processed on velynxia.com and synced here to grant app permissions.
      </p>

      <h2 className="mt-8 text-sm font-medium text-gray-700">Your account</h2>
      <div className="mt-3 rounded-lg border border-gray-200 bg-white p-5 text-sm">
        <p>
          <span className="text-gray-500">Name:</span>{" "}
          {session?.user?.name ?? "—"}
        </p>
        <p className="mt-1">
          <span className="text-gray-500">Email:</span>{" "}
          {session?.user?.email ?? "—"}
        </p>
        <p className="mt-1">
          <span className="text-gray-500">Role:</span>{" "}
          {session?.user?.role ?? "—"}
        </p>
        <p className="mt-1">
          <span className="text-gray-500">Enabled features:</span>{" "}
          {features.length ? features.join(", ") : "—"}
        </p>
      </div>

      <h2 className="mt-8 text-sm font-medium text-gray-700">License tiers</h2>
      <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2">Tier</th>
              <th className="px-4 py-2">Included apps</th>
            </tr>
          </thead>
          <tbody>
            {LICENSE_TIERS.map((tier) => (
              <tr key={tier.name} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium text-gray-900">
                  {tier.name}
                </td>
                <td className="px-4 py-2 text-gray-700">
                  {tier.features.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminUserManagement isAdmin={isAdmin} />
    </div>
  );
}
