import type { ReactNode } from "react";

type Props = {
  topNav: ReactNode;
  leftSidebar: ReactNode;
  main: ReactNode;
  promptBox: ReactNode;
  rightSidebar?: ReactNode;
};

export function AIChatLayout({ topNav, leftSidebar, main, promptBox, rightSidebar }: Props) {
  return (
    <div className="space-y-3">
      <header className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">{topNav}</header>

      <div className="grid min-h-[calc(100vh-170px)] gap-3 lg:grid-cols-[300px_1fr_300px]">
        {leftSidebar}

        <section className="min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{main}</section>

        {rightSidebar ?? <div className="hidden lg:block" />}
      </div>

      {promptBox}
    </div>
  );
}
