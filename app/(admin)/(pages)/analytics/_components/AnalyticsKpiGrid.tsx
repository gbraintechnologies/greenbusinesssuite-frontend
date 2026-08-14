import KpiCard from "@/components/Dashboard/KpiCard";
import { formatCurrency, formatNumber } from "@/utils/dashboard/formatters";

type Kpi = {
  label: string;
  value: number;
  isCurrency?: boolean;
  icon: React.ReactNode;
};

type Props = {
  items: Kpi[];
};

export default function AnalyticsKpiGrid({ items }: Props) {
  return (
    <div
      className={`mb-5 grid gap-3 sm:mb-6 sm:gap-4 ${
        items.length === 1
          ? "grid-cols-1 sm:max-w-xs"
          : "grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {items.map((item) => (
        <KpiCard
          key={item.label}
          label={item.label}
          value={
            item.isCurrency
              ? formatCurrency(item.value)
              : formatNumber(item.value)
          }
          icon={item.icon}
        />
      ))}
    </div>
  );
}
