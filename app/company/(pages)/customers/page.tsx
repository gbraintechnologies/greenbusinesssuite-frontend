"use client";

import React, { useCallback, useEffect, useState } from "react";

import DataTable from "@/components/DataTable/DataTable";
import SearchBox from "@/components/SearchBox/SearchBox";

import { BsThreeDots } from "react-icons/bs";
import StatusPill from "@/components/StatusPill/StatusPill";

import UserIcon from "@/public/icons/UserIcon";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

import useAdmin from "@/hooks/useAdmin";

function UserManagement() {
  const { admin } = useAdmin();

  const [activeRoleFilter, setActiveRoleFilter] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [aggregatedUsers, setAggregatedUsers] = useState([]);

  const [rows, setRows] = useState<{ id: number | undefined; data: any }[]>([]);

  //Filter users by role id
  const filterUsersByCompanyId = useCallback<any>((users: any) => {
    const companyId = admin.custom_profile_values.find(
      (item: any) => item.custom_profile_item_id === 2
    ).value;
    const filteredUsers = users?.filter((user: any) => {
      return (
        user.custom_profile_values.find(
          (item: any) => item.custom_profile_item_id === 2
        )?.value === companyId
      );
    });
    return filteredUsers;
  }, []);

  const filterRoles = useCallback<any>((roles: any) => {
    //Filter for just Company Admin and Client roles
    return roles?.filter((role: any) => role.id === 6 || role.id === 7);
  }, []);

  const { data: users, isLoading } = useQuery({
    queryKey: ["all users"],
    queryFn: services.allUsers(),
    select: filterUsersByCompanyId,
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["search data", searchTerm],
    queryFn: services.searchUsers(searchTerm),
    enabled: Boolean(searchTerm),
    select: filterUsersByCompanyId,
  });

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ["mesh roles"],
    // ID OF MESH APP IS 1 IN DB
    queryFn: services.getMeshBusinessSuiteRoles(1),
    select: filterRoles,
  });

  //Status Filter
  useEffect(() => {
    setAggregatedUsers(users);
  }, [users]);

  //Search Filter
  useEffect(() => {
    if (searchTerm.length > 1 && searchData) {
      setAggregatedUsers(searchData);
    }

    if (users && searchTerm.length < 1) {
      setActiveRoleFilter([]);
      setAggregatedUsers(users);
    }
  }, [searchTerm, users, searchData]);

  useEffect(() => {
    if (aggregatedUsers?.length > 0) {
      setRows(aggregatedUsers);
    }
  }, [aggregatedUsers]);

  useEffect(() => {
    if (aggregatedUsers?.length > 0) {
      const preparedRows = aggregatedUsers.map((user: any) => {
        return {
          id: user.id,
          data: user,
        };
      });
      setRows(preparedRows);
    } else {
      setRows([]);
    }
  }, [aggregatedUsers]);

  useEffect(() => {
    if (Boolean(activeRoleFilter.length) && users) {
      setSearchTerm("");
      let temp: any = [];
      for (let i = 0; i < users?.length; i++) {
        if (
          Boolean(
            activeRoleFilter.find(
              // @ts-ignore
              (item: any) => item.id === users[i]?.profiles[0]?.role_id
            )
          )
        ) {
          temp.push(users[i]);
        }
      }

      setAggregatedUsers(temp);
    } else {
      setAggregatedUsers(users);
    }
  }, [activeRoleFilter]);

  useEffect(() => {
    let temp: any = [];

    if (aggregatedUsers && roles) {
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
  }, [aggregatedUsers, roles]);

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
          <StatusPill status={params.row.data?.user_status ?? ""} />
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

  return (
    <div className="w-full pb-20 mt-4 py-2 ">
      <div className="flex items-center px-5 justify-between my-4">
        <h3 className="px-1 text-xl font-semibold">Customers</h3>
        <div className="flex items-center gap-3">
          <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>
      <DataTable
        isLoading={isLoading || searchLoading}
        rows={rows}
        columns={columns}
      />
    </div>
  );
}

export default UserManagement;
