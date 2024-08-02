import useCompany from "@/hooks/useCompany";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function CompanyLogo() {
  const { companyBranding } = useCompany();
  return (
    <>
      <Link href={`/${companyBranding?.company_identifier}`}>
        {companyBranding?.logo && (
          <Image
            src={companyBranding?.logo}
            width={60}
            height={60}
            className=""
            alt="company"
          />
        )}
      </Link>
    </>
  );
}

export default CompanyLogo;
