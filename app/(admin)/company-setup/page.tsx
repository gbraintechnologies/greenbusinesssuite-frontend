"use client";
import React, { useEffect, useState } from "react";
import Nav from "./components/Nav";
import TabItem from "./components/TabItem";
import SearchIcon from "@/public/icons/SearchIcon";
import SearchBox from "./components/SearchBox";
import Tabs from "./components/Tabs";
import RoleFilter from "../usermanagement/components/RoleFilter";

export interface IFilter {
  id: number;
  name: string;
  value: string;
}
function CompanySetup() {
  const [filters, setFilters] = useState<IFilter[]>([
    { id: 1, name: "All", value: "all" },
    { id: 2, name: "Active", value: "active" },
    { id: 3, name: "Inactive", value: "inactive" },
    { id: 4, name: "Suspended", value: "suspended" },
  ]);

  const [activeFilter, setActiveFilter] = useState<IFilter>({
    id: 1,
    name: "All",
    value: "all",
  });

  const [activeRoleFilter, setActiveRoleFilter] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [aggregatedCompanies, setAggregatedCompanies] = useState([]);

  const roles: any = []
  return (
    <div className="w-full pb-20 ">
      <Nav />
      <div className="flex items-center px-5 justify-between my-4">
        {/* FILTERS AND SEARCHBOX */}
        <Tabs
          filters={filters}
          setActiveFilter={setActiveFilter}
          activeFilter={activeFilter}
        />
        <div className="flex items-center gap-3">
          <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <RoleFilter
            roles={roles}
            selected={activeRoleFilter}
            setSelected={setActiveRoleFilter}
          />
        </div>
      </div>
    </div>
  );
}

export default CompanySetup;
