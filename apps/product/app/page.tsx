import { AppShell } from "@/src/components/app-shell";
import { MissionDashboard } from "@/src/components/mission-dashboard";

export default function DashboardPage() {
  return (
    <AppShell title="Product Dashboard" activeHref="/">
      <MissionDashboard />
    </AppShell>
  );
}
