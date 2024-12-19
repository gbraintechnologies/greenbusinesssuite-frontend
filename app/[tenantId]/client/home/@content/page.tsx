"use client";

import Border from "@/components/Border/Border";
import { AvailableModules } from "@/config/modules";
import useCompany from "@/hooks/useCompany";
import React, { useEffect } from "react";
import MediaHomeTemplate from "../templates/MediaHomeTemplate";
import SearchBox from "@/components/SearchBox/SearchBox";
import SuspendedNotice from "../../(dashboard)/components/SuspendedNotice";
import useUser from "@/hooks/useUser";

function Home() {
  const { companyBranding: company } = useCompany();
  const [search, setSearch] = React.useState("");

  const [userStatus, setUserStatus] = React.useState("");

  // current client
  const { user } = useUser();

  useEffect(() => {
    setUserStatus(user?.user_status);
  }, [user]);

  return (
    <div className=" mt-10 pb-10">
      <div className="flex items-center mb-8 px-5 justify-between">
        <h3 className="font-semibold text-2xl">Home</h3>
        <div className="w-96">
          <SearchBox
            searchTerm={search}
            setSearchTerm={setSearch}
            placeholder="Search for blogs, videos or ads"
          />
        </div>
      </div>

      {userStatus === "INACTIVE" && (
        <div className="mt-4">
          <SuspendedNotice />
        </div>
      )}

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
