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
  const headerHeight = `${ENTERPRISE_LAYOUT.headerHeightPx}px`;
  const footerHeight = `${ENTERPRISE_LAYOUT.footerHeightPx}px`;
  const leftNavWidth = `${ENTERPRISE_LAYOUT.leftNavWidthPx}px`;
  const rightPanelWidth = "300px";
  const workspaceHeight = `calc(100vh - ${ENTERPRISE_LAYOUT.headerHeightPx + ENTERPRISE_LAYOUT.footerHeightPx}px)`;

  return (
    <div className={`h-screen overflow-hidden ${ENTERPRISE_THEME.shellBg} ${ENTERPRISE_THEME.shellText}`}>
      <header
        style={{ height: headerHeight }}
        className={`flex items-center justify-between border-b px-5 text-white ${ENTERPRISE_THEME.navBg} ${ENTERPRISE_THEME.navBorder}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2f65c8] text-sm font-bold shadow-sm">V</div>
          <div>
            <p className={`text-sm font-bold leading-tight ${ENTERPRISE_THEME.navTextStrong}`}>Velynxia</p>
            <p className={`text-xs ${ENTERPRISE_THEME.navTextSubtle}`}>{moduleName}</p>
          </div>
        </div>
        <div
          className={`hidden w-[440px] items-center rounded-md border px-3 py-2 md:flex ${ENTERPRISE_THEME.navSubtleBg} ${ENTERPRISE_THEME.navSubtleBorder}`}
        >
          <span className="text-xs text-[#9db2d8]">Search products, suppliers, reports...</span>
        </div>
        <div className={`flex items-center gap-3 text-xs ${ENTERPRISE_THEME.navText}`}>
          <span className={`rounded-md border px-2 py-1 ${ENTERPRISE_THEME.navSubtleBg} ${ENTERPRISE_THEME.navSubtleBorder}`}>Alerts</span>
          <span className={`rounded-md border px-2 py-1 ${ENTERPRISE_THEME.navSubtleBg} ${ENTERPRISE_THEME.navSubtleBorder}`}>Owner</span>
        </div>
      </header>

      <div style={{ height: workspaceHeight }} className="flex">
        <aside style={{ width: leftNavWidth }} className={`flex shrink-0 flex-col border-r ${ENTERPRISE_THEME.navBg} ${ENTERPRISE_THEME.navBorder}`}>
          <nav className="workspace-scroll flex-1 space-y-1 overflow-y-scroll px-3 py-3">
            {navItems.map((item, index) => {
              const isActive = activeNavHref ? activeNavHref === item.href : index === 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? ENTERPRISE_THEME.navActive : `${ENTERPRISE_THEME.navText} ${ENTERPRISE_THEME.navHover}`
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className={`border-t px-3 py-4 ${ENTERPRISE_THEME.navBorder}`}>
            <button
              type="button"
              className={`w-full rounded-md border px-3 py-2 text-left text-xs text-[#c7d6f2] ${ENTERPRISE_THEME.navSubtleBg} ${ENTERPRISE_THEME.navSubtleBorder}`}
            >
              Collapse Navigation
            </button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-gray-50">
          <div className="h-full min-h-0 p-4">{children}</div>
        </main>

        <aside
          style={{ width: rightPanelWidth }}
          className="workspace-scroll flex shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-white/90 p-3"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Information Panel</h3>
          <div className="mt-3 space-y-3 text-xs">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold text-slate-800">Workspace</p>
              <p className="mt-1 text-slate-600">{moduleName}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold text-slate-800">Guidance</p>
              <p className="mt-1 text-slate-600">Use internal panel scroll areas for tables, lists, and forms.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold text-slate-800">Status</p>
              <p className="mt-1 text-slate-600">Viewport-locked desktop layout active.</p>
            </div>
          </div>
        </aside>
      </div>

      <footer style={{ height: footerHeight }} className="flex shrink-0 items-center justify-between border-t border-gray-200 bg-white px-4 text-xs text-gray-600">
        <span>Velynxia Unified Platform</span>
        <span>Product Studio module status: Active</span>
      </footer>
    </div>
  );
}
