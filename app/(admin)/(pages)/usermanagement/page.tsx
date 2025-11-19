"use client";

import React, { useEffect, useState } from "react";

// services
import { useQuery, useQueryClient } from "@tanstack/react-query";
import services from "@/services";

// icons
import { BsEye, BsThreeDots } from "react-icons/bs";
import SearchIcon from "@/public/icons/SearchIcon";
import Image from "next/image";

import UserIcon from "@/public/icons/UserIcon";

// shared components
import DataTable from "@/components/DataTable/DataTable";
import StatusPill from "@/components/StatusPill/StatusPill";

import Link from "next/link";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/react";
import { toast } from "sonner";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";
import { MeshRoles } from "@/config/roles.app";
import Table from "@/components/Table/Table";
import { user } from "@heroui/theme";
import Status from "@/components/Status/Status";
import Nav from "./components/Nav";
import { useRouter } from "next/navigation";

function UserManagement() {
  const [activeRoleFilter, setActiveRoleFilter] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(20);

  const { checkPermission } = useAdmin();

  // fetch all users
  const {
    data,
    isLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["all users", page, limit],
    queryFn: services.allUsers(page * limit, limit),
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["all users", searchTerm],
    queryFn: services.searchUsers(searchTerm),
    enabled: Boolean(searchTerm),
  });

  const [aggregatedUsers, setAggregatedUsers] = useState([]);

  // Get ALL MESH BUSINESS SUITE ROLES

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

  const StatusComponent = (item: any) => {
    return <Status status={item?.status} />;
  };

  const ActionsComponent = (item: any) => {
    return (
      <button
        onClick={() => router.push(`/usermanagement/profile?id=${item?.id}`)}
        className="bg-white text-black"
      >
        <BsEye />
      </button>
    );
  };

  return (
    <div className="w-full pb-20 ">
      <Nav />

      {/* TODO: Enable after integrations */}
      {/* Search and filters */}
      {/* <div className="flex items-center px-5 justify-between my-4">
        <div className="bg-gray-100 text-sm p-1 rounded-lg">
          {filters.map((filter: any) => {
            return (
              <button
                onClick={() => setActiveFilter(filter)}
                className={`${
                  activeFilter.id === filter.id
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
          {checkPermission(PermissionTypes.READ_USER_SEARCH) && (
            <div className="border  border-gray-200 rounded-xl px-3 py-2 text-sm flex gap-2 items-center">
              <SearchIcon />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none text-sm focus:outline-none bg-white custom-input input-custom"
                placeholder="Search by name only"
              />
            </div>
          )}
          <RoleFilter
            roles={
              roles &&
              roles?.filter((role: any) =>
                MeshRoles?.includes(role?.role_name?.toLowerCase())
              )
            }
            selected={activeRoleFilter}
            setSelected={setActiveRoleFilter}
          />
        </div>
      </div> */}

      {/* Table */}
      <Table
        columns={[
          { name: "ID", uid: "id" },
          { name: "Name", uid: "name" },
          { name: "Email", uid: "email" },
          { name: "Phone", uid: "phone" },
          { name: "STATUS", uid: "status" },
          { name: "VIEW", uid: "actions" },
        ]}
        data={
          data
            ? data?.map((user: any) => ({
                ...user,
                name: `${user?.firstName} ${user?.lastName}`,
              }))
            : []
        }
        hasSearch={false}
        isLoading={isLoading}
        title="Users"
        page={1}
        statusComponent={StatusComponent}
        actionsComponent={ActionsComponent}
      />
      {/* Pagination */}
      <div className="w-full flex justify-between">
        <ItemsPerPageSelector limit={limit} setLimit={setLimit} />
        <Pagination
          currentData={data}
          limit={limit}
          page={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
}

export default UserManagement;
