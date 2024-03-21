"use client";

import React, { useEffect, useState } from "react";
import Nav from "./components/Nav";

// services
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// icons
import { BsThreeDots } from "react-icons/bs";
import SearchIcon from "@/public/icons/SearchIcon";
import Image from "next/image";

import UserIcon from "@/public/icons/UserIcon";

// shared components
import DataTable from "@/components/DataTable/DataTable";
import StatusPill from "@/components/StatusPill/StatusPill";
import RoleFilter from "./components/RoleFilter";

function UserManagement() {
  const [filters, setFilters] = useState([
    { id: 1, name: "All", value: "all" },
    { id: 2, name: "Active", value: "active" },
    { id: 3, name: "Inactive", value: "inactive" },
    // { id: 7, name: "Newly Created", value: "newly_created" },
    { id: 4, name: "Limited access", value: "limited_access" },
    { id: 5, name: "Suspended", value: "suspended" },
    { id: 6, name: "Deleted", value: "deleted" },
  ]);

  const [activeFilter, setActiveFilter] = useState({
    id: 1,
    name: "All",
    value: "all",
  });
  const [activeRoleFilter, setActiveRoleFilter] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  // fetch all users
  const { data, isLoading } = useQuery({
    queryKey: ["all users"],
    queryFn: services.allUsers(),
  });


  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["all users", searchTerm],
    queryFn: services.searchUsers(searchTerm),
    enabled: Boolean(searchTerm),
  });

  const [aggregatedUsers, setAggregatedUsers] = useState([]);

  // Get ALL MESH BUSINESS SUITE ROLES
  const {
    data: roles,
    isLoading: rolesLoading,
    refetch,
  } = useQuery({
    queryKey: ["mesh roles"],
    enabled: false,
    // ID OF MESH APP IS 1 IN DB
    queryFn: services.getMeshBusinessSuiteRoles(1),
  });

  // FETCH ROLES ON MOUNT
  useEffect(() => {
    refetch();
  }, []);

  
  const columns = [
    {
      field: "name",
      headerName: "name",
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 3,
      getActions: (params: any) => [
        <div className="flex py-3 gap-4 my-3" key={params.row.data.id}>
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
              className="rounded-full w-10 h-10 object-cover"
            />
          ) : (
            <div className="bg-gray-100 w-10 h-10 flex items-center justify-center font-light text-sm rounded-full">
              <UserIcon />
            </div>
          )}
          <div>
            <p className="font-medium">
              {params.row.data.first_name} {params.row.data.last_name}
            </p>
            <p className="opacity-80 text-sm">{params.row.data.email}</p>
          </div>
        </div>,
      ],
    },
    { field: "role", headerName: "Role", flex: 1 },
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

  const [rows, setRows] = useState([]);

  // AGGREGATE USERS FROM DIFFERENT ENDPOINTS
  useEffect(() => {
    if (searchTerm.length > 1 && searchData) {
      setAggregatedUsers(searchData);
    }

    if (data && searchTerm.length < 1) {
      setActiveRoleFilter([]);
      setAggregatedUsers(data);
    }
  }, [searchData, data, searchTerm]);

  // STATUS FILTER
  useEffect(() => {
    if (activeFilter.value === "all") {
      setAggregatedUsers(data);
    } else {
      let temp: any = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].user_status.toLowerCase() === activeFilter.value) {
          temp.push(data[i]);
        }
      }

      setAggregatedUsers(temp);
    }
  }, [activeFilter]);

  useEffect(() => {
    console.log(" rows ", rows)
  }, [rows]);

  // ROLE FILTERS
  useEffect(() => {
    if (Boolean(activeRoleFilter.length) && data) {
      setSearchTerm("");
      let temp: any = [];
      for (let i = 0; i < data?.length; i++) {
        if (
          Boolean(
            activeRoleFilter.find(
              // @ts-ignore
              (item: any) => item.id === data[i]?.profiles[0]?.role_id
            )
          )
        ) {
          temp.push(data[i]);
        }
      }

      setAggregatedUsers(temp);
    } else {
      setAggregatedUsers(data);
    }
  }, [activeRoleFilter]);

  // Prepare Rows
  useEffect(() => {
    let temp: any = [];

    if (aggregatedUsers) {
      for (let i = 0; i < aggregatedUsers.length; i++) {
        let user = aggregatedUsers[i];
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
  }, [aggregatedUsers]);

  // useEffect(() => {
  //   let allUsers = [];

  //   if (Boolean(activeRoleFilter)) {
  //     console.log(activeRoleFilter);
  //     for (let i = 0; i < activeRoleFilter.length; i++) {
  //       // @ts-ignore
  //       let role_name = activeRoleFilter[i]?.role_name;
  //       let role_id = activeRoleFilter[i]?.id;
  //       services
  //         .allUsersByRole(role_id, role_name)
  //         .then((res: any) => {
  //           console.log("res", res);
  //         })
  //         .catch((e: Error) => {
  //           console.log(e);
  //         });
  //     }
  //   }
  // }, [activeRoleFilter]);

  // role filters
  // useEffect(() => {
  //   if (Boolean(activeRoleFilter)) {
  //     //
  //     let temp: any = [];

  // for (let i = 0; i < rows.length; i++) {
  //   if (
  //     Boolean(
  //       activeRoleFilter.find(
  //         // @ts-ignore
  //         (item: any) => item.role_name === rows[i]?.role
  //       )
  //     )
  //   ) {
  //     temp.push(rows[i]);
  //   }
  // }

  //     setRows(temp);
  //   }
  // }, [activeRoleFilter]);

  return (
    <div className="w-full pb-20 ">
      <Nav />

      {/* Search and filters */}
      <div className="flex items-center px-5 justify-between my-4">
        <div className="bg-gray-100 text-sm p-1 rounded-lg">
          {filters.map((filter: any) => {
            return (
              <button
                onClick={() => setActiveFilter(filter)}
                className={`${activeFilter.id === filter.id
                    ? "bg-white rounded-lg text-black"
                    : "text-gray-500 font-light"
                  } px-5 py-1`}
              >
                {filter.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="border shadow-sm focus:outline-primary-green border-gray-200 rounded-xl px-3 py-2 text-sm flex gap-2 items-center">
            <SearchIcon />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-sm focus:outline-none bg-white"
              placeholder="Search by name only"
            />
          </div>
          <RoleFilter
            roles={roles}
            selected={activeRoleFilter}
            setSelected={setActiveRoleFilter}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        isLoading={isLoading || searchLoading}
        rows={rows}
        columns={columns}
      />
    </div>
  );
}

export default UserManagement;
