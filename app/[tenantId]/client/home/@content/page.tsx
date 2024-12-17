"use client";

import Border from "@/components/Border/Border";
import { AvailableModules } from "@/config/modules";
import useCompany from "@/hooks/useCompany";
import React from "react";
import MediaHomeTemplate from "../templates/MediaHomeTemplate";
import SearchBox from "@/components/SearchBox/SearchBox";

function Home() {
  const { companyBranding: company } = useCompany();
  const [search, setSearch] = React.useState("");
  return (
    <div className=" mt-10 pb-10">
      <div className="flex items-center mb-8 px-5 justify-between">
        <h3 className="font-semibold text-xl">Home</h3>
        <div className="w-96">
          <SearchBox
            searchTerm={search}
            setSearchTerm={setSearch}
            placeholder="Search for blogs, videos, and ads by heading"
          />
        </div>
      </div>
      <Border />

      {/* TODO: REFACTOR TEMPALTE SELECTION: Switch Statement */}

      {/* TEMPLATE 1 */}
      <div className="px-5">
        {company.companyModules.includes(
          AvailableModules.MediaHomeTemplate
        ) && <MediaHomeTemplate search={search} />}
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
