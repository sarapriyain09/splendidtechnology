type Props = {
  label?: string;
};

export function LoadingIndicator({ label = "Loading" }: Props) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
      {label}
    </div>
  );
}
