type Props = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function DashboardPanel({
  title,
  action,
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {action}
      </div>
      <div className="min-w-0 p-4 sm:p-5">{children}</div>
    </div>
  );
}
