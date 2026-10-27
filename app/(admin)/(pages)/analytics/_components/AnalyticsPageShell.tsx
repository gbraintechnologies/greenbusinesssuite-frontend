import DashboardHeader from "@/components/Dashboard/DashboardHeader";

type Props = {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export default function AnalyticsPageShell({
  title,
  subtitle,
  action,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-surface-muted px-0 pb-20 pt-1 sm:pt-2">
      <DashboardHeader title={title} subtitle={subtitle} action={action} />
      {children}
    </div>
  );
}
