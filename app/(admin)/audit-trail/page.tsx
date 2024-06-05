"use client";
import React from "react";
import Dropdown from "./components/Dropdown";

function AuditTrail() {
  const dropdownOptions = [
    { value: "approvals", label: "Approvals" },
    { value: "userlogins", label: "User Logins" },
    { value: "reportextractions", label: "Report Extractions" },
    { value: "configurationchanges", label: "Configuration Changes" },
    { value: "usermanagementactivities", label: "User Management Activities" },
    { value: "dataupdates", label: "Data Updates" },
  ];

  const [selectedOption, setSelectedOption] = React.useState(
    dropdownOptions[0]
  );
  return (
    <div className="px-5">
      <div className="w-full text-[#0F172A] ">
        <h3 className="font-semibold text-xl">Audit Trail</h3>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Dropdown
              options={dropdownOptions}
              selected={selectedOption}
              setSelected={setSelectedOption}
              width="w-64"
            />
            <Dropdown
              options={dropdownOptions}
              selected={selectedOption}
              setSelected={setSelectedOption}
              width="w-64"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditTrail;
