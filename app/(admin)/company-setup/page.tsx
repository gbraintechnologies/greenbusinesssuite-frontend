"use client";
import React, { useEffect, useState } from "react";
import Nav from "./components/Nav";
import TabItem from "./components/TabItem";
import SearchIcon from "@/public/icons/SearchIcon";
import SearchBox from "./components/SearchBox";
import Tabs from "./components/Tabs";
import RoleFilter from "../usermanagement/components/RoleFilter";
import Image from "next/image";
import UserIcon from "@/public/icons/UserIcon";
import StatusPill from "@/components/StatusPill/StatusPill";
import { BsThreeDots } from "react-icons/bs";
import DataTable from "@/components/DataTable/DataTable";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

export interface IFilter {
  id: number;
  name: string;
  value: string;
}

interface IRowData {
  companyName: string;
  contact_person: {
    firstName: string;
    lastName: string;
    email: string;
  };
  user_status: string;
  custom_profile_values: any[];
}
interface IRow {
  id: string;
  data: IRowData
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

  const [rows, setRows] =useState([]);

  const {data: companies, isLoading} = useQuery({
    queryKey: ["all companies"],
    queryFn: services.getAllCompanies(),
  })

  useEffect(() => {

      console.log('data.... ', companies)
  }, [companies])

  useEffect(() => {
    let temp: any = [];

    if (aggregatedCompanies) {
      for (let i = 0; i < aggregatedCompanies.length; i++) {
        let user = aggregatedCompanies[i];
        let userRole = "Unassigned";
        // APP ID ===1 == MESH SUITE APP
        // @ts-ignore
        const meshRole = user?.profiles.find((item: any) => item.app_id === 1);
        if (meshRole) {
          for (let i = 0; i < roles?.length; i++) {
            if (roles[i].id === meshRole?.role_id) {
              userRole = roles[i].role_name;
            }
          }
        }
        // @ts-ignore
        temp.push({ id: user?.id, data: user, role: userRole });
      }
      setRows(temp);
    }
  }, [aggregatedCompanies]);

  const columns = [
    {
      field: "name",
      headerName: "Company Name",
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 3,
      getActions: (params: any) => [
        <div
          className="flex py-3 gap-4 my-3 items-center"
          key={params.row.data.id}
        >
          {params.row.data.custom_profile_values &&
          params.row.data.custom_profile_values.find(
            (item: any) => item.custom_profile_item_id === 1
          )?.value?.length > 1 ? (
            <Image
              alt="profile"
              src={
                params.row.data.custom_profile_values.find(
                  (item: any) => item.custom_profile_item_id === 1
                ).value
              }
              width={100}
              height={100}
              className="w-10 h-10 object-cover"
            />
          ) : (
            <div className="bg-gray-100 w-10 h-10 flex items-center justify-center font-light text-sm rounded-full">
              <UserIcon />
            </div>
          )}
          <div>
            <p className="font-medium text-sm">{params.row.data.companyName}</p>
          </div>
        </div>,
      ],
    },
    {
      field: "contactPerson",
      headerName: "Contact Person",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="flex flex-col gap-2">
          <p className="font-medium text-sm">
            {params.row.data?.contact_person.firstName}{" "}
            {params.row.data?.contact_person.lastName}
          </p>
          <p className="text-[#475569] text-sm font-normal">{params.row.data?.contact_person.email}</p>
        </div>,
      ],
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="w-2/12">
          <StatusPill status={params.row.data?.user_status} />
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

  const roles: any = [];
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
      <DataTable
        isLoading={false}
        rows={rows}
        columns={columns}
      />
    </div>
  );
}

export default CompanySetup;
