import { getServerSession } from "next-auth";
import { AdminUserManagement } from "@/components/settings/admin-user-management";
import { authOptions } from "@/lib/auth/options";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "admin@velynxia.com").trim().toLowerCase();
const ADMIN_USER_ID = process.env.ADMIN_USER_ID ?? "11111111-1111-1111-1111-111111111111";

export default async function DashboardSettingsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.trim().toLowerCase() ?? "";
  const isAdmin = session?.user?.id === ADMIN_USER_ID || email === ADMIN_EMAIL;

  return (
    <section className="space-y-5">
      <div className="panel rounded-2xl p-5">
        <h1 className="text-2xl font-semibold text-[color:var(--foreground)]">Settings</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Admin controls for AIMedia user creation and password resets.
        </p>
      </div>

      <AdminUserManagement isAdmin={isAdmin} />
    </section>
  );
}
