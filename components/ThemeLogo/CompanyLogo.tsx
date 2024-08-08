import useCompany from "@/hooks/useCompany";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function CompanyLogo({ showName = false }: { showName?: boolean }) {
  const { companyBranding } = useCompany();

  console.log("showc", showName, companyBranding);
  return (
    <div className="flex items-center justify-center text-center gap-3 flex-col">
      {showName ? (
        <div>
          <Link href={`/${companyBranding?.company_identifier}`}>
            {companyBranding?.logo && (
              <Image
                priority
                src={companyBranding?.logo}
                width={200}
                height={200}
                className="rounded-xl w-full h-full"
                alt="company"
              />
            )}

            {/* <h4 className="text-2xl font-bold">{companyBranding?.name}</h4> */}
          </Link>
        </div>
      ) : (
        <div>
          {" "}
          <Link href={`/${companyBranding?.company_identifier}`}>
            {companyBranding?.logo && (
              <Image
                src={companyBranding?.logo}
                width={60}
                height={60}
                className="rounded-xl w-full h-full"
                alt="company"
              />
            )}
          </Link>
        </div>
      )}
    </div>
  );
}

export default CompanyLogo;
