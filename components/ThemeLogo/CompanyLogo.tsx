import useCompany from "@/hooks/useCompany";
import Link from "next/link";
import React from "react";
import CompanyBrandAvatar from "@/components/CompanyBrand/CompanyBrandAvatar";

function CompanyLogo() {
  const { companyBranding } = useCompany();

  return (
    <div className="h-20 w-20 rounded-xl bg-white">
      <Link href={`/${companyBranding?.company_identifier}`}>
        <CompanyBrandAvatar
          logoUrl={companyBranding?.logo}
          name={companyBranding?.name}
          size="md"
          className="h-20 w-20"
        />
      </Link>
    </div>
  );
}

export default CompanyLogo;
