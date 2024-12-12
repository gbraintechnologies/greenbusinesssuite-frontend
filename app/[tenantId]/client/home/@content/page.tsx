"use client";

import Border from "@/components/Border/Border";
import { AvailableModules } from "@/config/modules";
import useCompany from "@/hooks/useCompany";
import React from "react";
import MediaHomeTemplate from "../templates/MediaHomeTemplate";

function Home() {
  const { companyBranding: company } = useCompany();

  return (
    <div className=" mt-10 pb-10">
      <h3 className="font-semibold mb-8 text-xl px-5">Home</h3>
      <Border />

      {/* TODO: REFACTOR TEMPALTE SELECTION: Switch Statement */}

      {/* TEMPLATE 1 */}
      <div className="px-5">
        {company.companyModules.includes(
          AvailableModules.MediaHomeTemplate
        ) && <MediaHomeTemplate />}
      </div>

      {/* TEMPLATE 2 */}

      {/* TEMPALTE 3 */}
      {/*  */}
      {/*  */}
      {/*  */}
    </div>
  );
}

export default Home;
