"use client";

import Link from "next/link";
import { Spinner } from "@heroui/react";
import DashboardPanel from "./DashboardPanel";
import { FormatDateShort } from "@/utils/FormatDate/FormatDate";
import { formatCurrency } from "@/utils/dashboard/formatters";

type PaymentRow = {
  id?: string | number;
  transactionId?: string | number;
  serviceName?: string;
  customerName?: string;
  amountPaid?: number | string;
  datePaid?: string;
  paymentMethod?: string;
};

type Props = {
  payments: PaymentRow[];
  isLoading?: boolean;
  viewAllHref?: string;
};

export default function RecentPaymentsTable({
  payments,
  isLoading,
  viewAllHref,
}: Props) {
  return (
    <DashboardPanel
      title="Recent Payments"
      action={
        viewAllHref ? (
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all
          </Link>
        ) : undefined
      }
    >
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner color="primary" />
        </div>
      ) : payments.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No payments recorded yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-3 pr-4 font-medium">Service</th>
                <th className="pb-3 pr-4 font-medium">Customer</th>
                <th className="pb-3 pr-4 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr
                  key={`payment-${payment.id ?? payment.transactionId ?? "row"}-${index}`}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-900">
                      {payment.serviceName ?? "Payment"}
                    </p>
                    {payment.paymentMethod && (
                      <p className="text-xs text-slate-500">
                        {payment.paymentMethod.replaceAll("_", " ")}
                      </p>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-slate-600">
                    {payment.customerName ?? "—"}
                  </td>
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {formatCurrency(payment.amountPaid)}
                  </td>
                  <td className="py-3 text-slate-500">
                    {payment.datePaid
                      ? FormatDateShort(payment.datePaid)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardPanel>
  );
}
