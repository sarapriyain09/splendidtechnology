import Link from "next/link";
import { ENTERPRISE_LAYOUT, ENTERPRISE_THEME } from "@/lib/design-system/layout";
import { ProductNavItem } from "@/lib/design-system/navigation";

type EnterpriseShellProps = {
  moduleName: string;
  navItems: readonly ProductNavItem[];
  activeNavHref?: string;
  children: React.ReactNode;
};

export function EnterpriseShell({
  moduleName,
  navItems,
  activeNavHref,
  children,
}: EnterpriseShellProps) {
  const leftNavWidth = `${ENTERPRISE_LAYOUT.leftNavWidthPx}px`;
  const rightPanelWidth = `${ENTERPRISE_LAYOUT.rightPanelWidthPx}px`;

  return (
    <div className={`flex h-screen overflow-hidden ${ENTERPRISE_THEME.shellBg} ${ENTERPRISE_THEME.shellText}`}>
      <aside style={{ width: leftNavWidth }} className="flex shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2f65c8] text-sm font-bold shadow-sm">V</div>
            <div>
              <p className="text-sm font-bold leading-tight text-slate-900">Velynxia</p>
              <p className="text-xs text-slate-500">{moduleName}</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-slate-800"
          >
            + New Mission
          </button>
        </div>

        <nav className="workspace-scroll flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {navItems.map((item, index) => {
            const isActive = activeNavHref ? activeNavHref === item.href : index === 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 px-3 py-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
            Product records are created only after mission approval.
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Product Studio Assistant</p>
            <p className="text-xs text-slate-600">Chat-first product discovery and execution</p>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="rounded-lg border border-slate-300 bg-slate-100 px-2 py-1 text-xs text-slate-700">Owner</span>
            <span className="rounded-lg border border-slate-300 bg-slate-100 px-2 py-1 text-xs text-slate-700">Mission Mode</span>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(16,185,129,0.08),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
            <div className="workspace-scroll h-full min-h-0 overflow-y-auto px-4 py-4 md:px-6">{children}</div>

            <div className="border-t border-slate-200 bg-white/90 px-3 py-3 backdrop-blur-sm md:px-5">
              <div className="mx-auto flex max-w-5xl items-end gap-3 rounded-2xl border border-slate-300 bg-white p-3 shadow-sm">
                <textarea
                  rows={1}
                  className="max-h-32 w-full resize-y rounded-lg bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-500"
                  placeholder="Ask Product Studio... Example: Find premium UK desk accessories with low return risk and high B2B potential"
                />
                <button
                  type="button"
                  className="rounded-xl bg-[#2f65c8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3b74de]"
                >
                  Run
                </button>
              </div>
            </div>
          </main>

          <aside
            style={{ width: rightPanelWidth }}
            className="workspace-scroll hidden shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-white/85 p-3 xl:flex"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Assistant Context</h3>
            <div className="mt-3 space-y-3 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-800">Workspace</p>
                <p className="mt-1 text-slate-600">{moduleName}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="font-semibold text-slate-800">Recommended Prompts</p>
                <div className="mt-2 space-y-2">
                  <button type="button" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-left text-slate-700">
                    Compare UK vs India supplier paths
                  </button>
                  <button type="button" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-left text-slate-700">
                    Create cost-risk summary for this mission
                  </button>
                  <button type="button" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-left text-slate-700">
                    Generate approval-ready product brief
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <footer className="flex h-[32px] shrink-0 items-center justify-between border-t border-slate-200 bg-white px-4 text-xs text-slate-600">
        <span>Velynxia Unified Platform</span>
        <span>Product Studio module status: Active</span>
      </footer>
    </div>
  );
}
