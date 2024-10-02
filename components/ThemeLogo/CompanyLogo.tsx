import useCompany from "@/hooks/useCompany";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function CompanyLogo() {
  const { companyBranding } = useCompany();
  return (
    <div className="w-20 bg-white roundex-xl h-20">
      <Link href={`/${companyBranding?.company_identifier}`}>
        {companyBranding?.logo && (
          <Image
            src={companyBranding?.logo}
            width={100}
            height={100}
            className="rounded-xl object-cover w-full h-full"
            alt="company"
          />
        )}
      </Link>
    </div>
  );
}

export default CompanyLogo;
