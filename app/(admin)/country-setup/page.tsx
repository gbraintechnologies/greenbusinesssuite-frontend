"use client";

import React, { useEffect, useState } from "react";
import Nav from "./components/Nav";

// services
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// icons
import { BsThreeDots } from "react-icons/bs";
import SearchIcon from "@/public/icons/SearchIcon";

// shared components
import DataTable from "@/components/DataTable/DataTable";
import "./index.css";
import { Countrie } from "./components/Countries";

function CountrySetup() {

  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);

  //fetch all jurisdictions
  const { data, isLoading } = useQuery({
    queryKey: ["all jurisdictions"],
    queryFn: services.allJurisdictions(),
  });

  useEffect(() => {
    // alert(JSON.stringify(data))
    if (data) {
      setRows(data);
    }
  }, [data]);

  const columns = [
    {
      field: "country",
      headerName: "country",
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 3,
      getActions: (params: any) => [
        <div className="flex py-3 gap-4 my-3 items-center" key={params.row.data.id}>
          <label>
            <input
              type="checkbox"
              className="mr-4 styled-checkbox flex items-center justify-center"
            />
          </label>
          <div className="w-10 h-10 flex items-center justify-center">
            <span className=""><img src={Countrie(params.row.data.jurisdiction_name)?.flags.png} alt={Countrie(params.row.data.jurisdiction_name)?.name.common} style={{ height: "auto", width: "30px" }} /></span>

          </div>
          <div>
            <p className="font-medium">
              {params.row.data.jurisdiction_name}
            </p>
          </div>
        </div>,
      ],
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id}>
          <BsThreeDots size={20} />
        </div>,
      ],
    },
  ];


  // useEffect(() => {
  //   if (searchTerm.length > 1 && searchsData) {
  //     setJurisdictionUser(searchsData);
  //   }

  //   if (data && searchTerm.length < 1) {
  //     setJurisdictionUser(data);
  //   }
  // }, [searchsData, data, searchTerm]);

  // useEffect(() => {
  //   let temp: any = [];

  //   if (jurisdictionUser) {
  //     for (let i = 0; i < jurisdictionUser.length; i++) {
  //       let user = jurisdictionUser[i];
  //       // APP ID ===1 == MESH SUITE APP
  //       // @ts-ignore
  //       // @ts-ignore
  //       temp.push({ id: user?.id, data: user });
  //     }
  //     setRows(temp);
  //   }
  // }, [jurisdictionUser]);


  // const [rows, setRows] = useState([]);

  return (
    <div className="w-full pb-20 ">
      <Nav />

      {/* Search and filters */}
      <div className="flex items-center px-5 justify-between my-4">

        <div className="flex items-center gap-3">
          <div className="border shadow-sm focus:outline-primary-green border-gray-200 rounded-xl px-3 py-2 text-sm flex gap-2 items-center">
            <SearchIcon />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-sm focus:outline-none bg-white"
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        isLoading={isLoading}
        rows={rows}
        columns={columns}
      />
    </div>
  );
}

export default CountrySetup;
