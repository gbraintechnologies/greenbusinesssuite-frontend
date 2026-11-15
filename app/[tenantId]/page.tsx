"use client";

import React, { use } from "react";
import CompanyMarketingPage from "@/components/CompanyMarketing/CompanyMarketingPage";

function page(props: any) {
  const params: any = use(props.params);
  const tenantId = params.tenantId;

  return <CompanyMarketingPage tenantId={tenantId} />;
}

export default page;
