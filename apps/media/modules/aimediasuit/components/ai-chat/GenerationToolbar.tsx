type Props = {
  statuses: Array<{ label: string; active: boolean }>;
};

export function GenerationToolbar({ statuses }: Props) {
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50/90 px-4 py-2 backdrop-blur">
      {statuses.map((status) => (
        <span
          key={status.label}
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            status.active ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          {status.label}
        </span>
      ))}
    </div>
  );
}
