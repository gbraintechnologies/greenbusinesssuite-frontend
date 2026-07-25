type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function DashboardHeader({ title, subtitle, action }: Props) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold text-slate-900 sm:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-500 sm:mt-1 sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
