type KpiCardProps = {
  title: string;
  value: string;
  hint: string;
};

export function KpiCard({ title, value, hint }: KpiCardProps) {
  return (
    <div className="surface-panel rounded-2xl p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-700">{hint}</p>
    </div>
  );
}
