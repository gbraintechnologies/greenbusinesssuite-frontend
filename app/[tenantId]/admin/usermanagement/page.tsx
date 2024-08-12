"use client";
import DataTable from "@/components/DataTable/DataTable";
import SearchBox from "@/components/SearchBox/SearchBox";
import Tabs from "@/components/Tabs/Tabs";
import React, { useCallback, useEffect, useState } from "react";
import Nav from "./components/Nav";
import { BsThreeDots } from "react-icons/bs";
import StatusPill from "@/components/StatusPill/StatusPill";

import UserIcon from "@/public/icons/UserIcon";
import Image from "next/image";

import services from "@/services";
import { IFilter } from "@/types";

import RoleFilter from "./components/RoleFilter";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";

function UserManagement({ params }: any) {
  const tenantId = params?.tenantId;
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

  const queryClient = useQueryClient();

  const [activeRoleFilter, setActiveRoleFilter] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [aggregatedUsers, setAggregatedUsers] = useState([]);

  const [rows, setRows] = useState<{ id: number | undefined; data: any }[]>([]);

  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(20);

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all users", page, limit],
    queryFn: services.allUsers(page * limit, limit),
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["search data", searchTerm],
    queryFn: services.searchUsers(searchTerm),
    enabled: Boolean(searchTerm),
  });

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ["mesh roles"],
    // ID OF MESH APP IS 1 IN DB
    queryFn: services.getMeshBusinessSuiteRoles(1),
  });

  useEffect(() => {
    refetch();
  }, [page]);

  const blacklistUser = async (userId: string) => {
    try {
      await services.blacklistUser(userId);
      await queryClient.invalidateQueries({
        queryKey: ["all users", page, limit],
      });
      toast.success("User blacklisted successfully");
    } catch (error) {
      toast.error("Failed to blacklist user");
    }
  };
  const editUserStatus = async (userData: any, status: any) => {
    let userDataInfo = { ...userData, user_status: status };

    const keyToDelete = "custom_profile_values";

    let customFields = userDataInfo[keyToDelete];

    delete userDataInfo[keyToDelete];

    try {
      await services.editUserWithCustomFields(
        userDataInfo,
        customFields,
        userData.id
      );
      toast.success("User status updated successfully");
      await queryClient.invalidateQueries({
        queryKey: ["all users", page, limit],
      });
    } catch (error) {
      toast.error("User to update company status");
    }
  };

  //Status Filter
  useEffect(() => {
    if (activeFilter.value === "all") {
      setAggregatedUsers(users);
    } else {
      const filteredUsers = users?.filter(
        (user: any) =>
          user.user_status.toLowerCase() === activeFilter.value.toLowerCase()
      );
      setAggregatedUsers(filteredUsers);
    }
  }, [activeFilter, users]);

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
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">
              {" "}
              <BsThreeDots size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            className="shadow-md bg-white border border-[#F1F5F9]  -mt-4 rounded-lg flex flex-col gap-3"
            aria-label="Static Actions"
          >
            <DropdownItem
              key="view"
              className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
            >
              <Link
                href={
                  `/${tenantId}/admin/usermanagement/profile?id=` +
                  params.row.data.id
                }
                className="w-full block"
              >
                View User
              </Link>
            </DropdownItem>
            <DropdownItem
              key="edit"
              className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
            >
              <Link
                href={
                  `/${tenantId}/admin/usermanagement/edit-user?id=` +
                  params.row.data.id
                }
                className="w-full block"
              >
                Edit User
              </Link>
            </DropdownItem>
            {params.row.data?.user_status?.toLowerCase() === "inactive" ||
            params.row.data?.user_status?.toLowerCase() === "blacklisted" ? (
              <DropdownItem className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]">
                <button
                  onClick={() => editUserStatus(params.row.data, "ACTIVE")}
                >
                  Activate User
                </button>
              </DropdownItem>
            ) : (
              <DropdownItem className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]">
                <button
                  onClick={() => editUserStatus(params.row.data, "INACTIVE")}
                >
                  Deactivate User
                </button>
              </DropdownItem>
            )}
            <DropdownItem className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]">
              <button onClick={() => blacklistUser(params.row.data.id)}>
                Blacklist User
              </button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      ],
    },
  ];

  return (
    <div className="w-full pb-20 mt-4 py-2 ">
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
        isLoading={isLoading || searchLoading}
        rows={rows}
        columns={columns}
      />
      {/* Pagination */}
      {/* Pagination */}
      <div className="w-full flex justify-between">
        <ItemsPerPageSelector limit={limit} setLimit={setLimit} />
        <Pagination
          currentData={users}
          limit={limit}
          page={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
}

export default UserManagement;
