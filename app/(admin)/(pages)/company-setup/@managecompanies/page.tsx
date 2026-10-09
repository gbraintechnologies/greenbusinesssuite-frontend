"use client";

import Link from "next/link";
import { FiFileText, FiGrid, FiUsers } from "react-icons/fi";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardPanel from "@/components/Dashboard/DashboardPanel";

const products = [
  {
    name: "Forms",
    detail: "Collect client information and run programs.",
    href: "/forms",
    icon: <FiFileText size={18} />,
  },
  {
    name: "Clients",
    detail: "People and businesses served by Green Business Suite.",
    href: "/usermanagement",
    icon: <FiUsers size={18} />,
  },
  {
    name: "Analytics",
    detail: "Loans, training, and client activity.",
    href: "/analytics/clients",
    icon: <FiGrid size={18} />,
  },
];

function CompanySetup() {
  return (
    <div className="min-h-screen bg-surface-muted px-3 pb-20 pt-4 sm:px-5 sm:pt-5">
      <DashboardHeader
        title="Green Business Suite"
        subtitle="The only company. Clients belong here, and each tool is a product on this account."
        action={
          <Link href="/usermanagement" className="w-full sm:w-auto">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md sm:w-auto sm:px-5"
            >
              <FiUsers size={18} />
              View clients
            </button>
          </Link>
        }
      />

      <DashboardPanel title="Products on this account">
        <div className="grid gap-3 sm:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.href}
              href={product.href}
              className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
            >
              <div className="mb-3 inline-flex rounded-lg bg-brand-50 p-2 text-brand-700">
                {product.icon}
              </div>
              <p className="font-medium text-slate-900">{product.name}</p>
              <p className="mt-1 text-sm text-slate-500">{product.detail}</p>
            </Link>
          ))}
        </div>
      </DashboardPanel>

      <p className="mt-4 text-sm text-slate-500">
        Autobus is a separate app. A person signs in there with the same Green
        Account, the way a Google account opens Gemini without becoming a
        company inside Google Cloud.
      </p>
    </div>
  );
}

export default CompanySetup;
