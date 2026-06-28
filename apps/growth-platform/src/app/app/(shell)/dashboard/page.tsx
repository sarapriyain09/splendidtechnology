import { getSession } from "@/common/auth";
import { GROWTH_NAV } from "@/common/navigation/growth-nav";

export default async function DashboardPage() {
  const session = await getSession();
  const features = session?.user?.features ?? [];
  const apps = GROWTH_NAV.filter(
    (item) => item.external && (item.feature === null || features.includes(item.feature)),
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}.
      </p>

      <h2 className="mt-8 text-sm font-medium text-gray-700">Your apps</h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <a
            key={app.href}
            href={app.href}
            className="rounded-lg border border-gray-200 bg-white p-5 transition hover:border-gray-400"
          >
            <p className="flex items-center justify-between font-medium text-gray-900">
              {app.label}
              {app.external && <span className="text-xs text-gray-400">↗</span>}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {app.external ? `Open ${app.label}` : "Coming soon"}
            </p>
          </a>
        ))}
        {apps.length === 0 && (
          <p className="text-sm text-gray-500">
            No licensed apps yet. Contact your administrator.
          </p>
        )}
      </div>
    </div>
  );
}
