"use client"
import React, { useEffect, useState } from "react";
import Nav from "./components/Nav";

function CompanySetup() {
  const [filters, setFilters] = useState([
    { id: 1, name: "All", value: "all" },
    { id: 2, name: "Active", value: "active" },
    { id: 3, name: "Inactive", value: "inactive" },
    { id: 4, name: "Suspended", value: "suspended" },
  ]);

  const [activeFilter, setActiveFilter] = useState({
    id: 1,
    name: "All",
    value: "all",
  });
  const [activeRoleFilter, setActiveRoleFilter] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [aggregatedCompanies, setAggregatedCompanies] = useState([]);


  return (
    <div className="w-full pb-20 ">
      <Nav /> 
    </div>
  )
}

export default CompanySetup;
