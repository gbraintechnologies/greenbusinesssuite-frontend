export function formatCurrency(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) return "—";

  if (amount >= 1_000_000) {
    return `Ghs ${(amount / 1_000_000).toFixed(1)}M`;
  }

  if (amount >= 1_000) {
    return `Ghs ${(amount / 1_000).toFixed(0)}k`;
  }

  return `Ghs ${amount.toLocaleString()}`;
}

export function formatNumber(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) return "—";
  return amount.toLocaleString();
}

export function formatPercent(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(1)}%`;
}

export function computeCompletionRate(
  completed?: number | null,
  total?: number | null
) {
  if (!completed || !total || total === 0) return null;
  return (completed / total) * 100;
}

export function computeAveragePayment(
  revenue?: number | null,
  count?: number | null
) {
  if (!revenue || !count || count === 0) return null;
  return revenue / count;
}
