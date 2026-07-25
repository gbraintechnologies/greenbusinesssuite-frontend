type PaymentRecord = {
  datePaid?: string;
  amountPaid?: number | string;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function aggregatePaymentsByMonth(payments: PaymentRecord[] = []) {
  const totals = new Map<string, number>();

  payments.forEach((payment) => {
    if (!payment?.datePaid) return;

    const date = new Date(payment.datePaid);
    if (Number.isNaN(date.getTime())) return;

    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const amount = Number(payment.amountPaid ?? 0);
    totals.set(key, (totals.get(key) ?? 0) + (Number.isNaN(amount) ? 0 : amount));
  });

  const sorted = [...totals.entries()].sort(([a], [b]) => a.localeCompare(b));
  const recent = sorted.slice(-6);

  if (recent.length === 0) {
    return MONTHS.slice(0, 6).map((month) => ({
      month,
      revenue: 0,
    }));
  }

  return recent.map(([key, revenue]) => {
    const monthIndex = Number(key.split("-")[1]);
    return {
      month: MONTHS[monthIndex] ?? key,
      revenue,
    };
  });
}
