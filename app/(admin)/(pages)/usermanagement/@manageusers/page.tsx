"use client";

import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";

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
import RoleFilter from "../components/RoleFilter";
import Link from "next/link";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";
import { MeshRoles } from "@/config/roles.app";
import Table from "@/components/Table/Table";
import { user } from "@nextui-org/theme";
import Status from "@/components/Status/Status";

function UserManagement() {
  const [filters, setFilters] = useState([
    { id: 1, name: "All", value: "all" },
    { id: 2, name: "Active", value: "active" },
    { id: 3, name: "Inactive", value: "inactive" },
    // { id: 7, name: "Newly Created", value: "newly_created" },
    // { id: 4, name: "Limited access", value: "limited_access" },
    { id: 5, name: "Blacklisted", value: "blacklisted" },
    // { id: 6, name: "Deleted", value: "deleted" },
  ]);

  const [activeFilter, setActiveFilter] = useState({
    id: 1,
    name: "All",
    value: "all",
  });
  const [activeRoleFilter, setActiveRoleFilter] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

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

  console.log("users", data);

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

  useEffect(() => {
    refetchUsers();
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

  // const columns = [
  //   {
  //     field: "name",
  //     headerName: "Name",
  //     type: "actions",
  //     align: "left",
  //     headerAlign: "left",
  //     flex: 3,
  //     getActions: (params: any) => [
  //       <div className="flex py-3 gap-4 my-3" key={params.row.data.id}>
  //         {/* {params.row.data.custom_profile_values &&
  //         params.row.data.custom_profile_values.find(
  //           (item: any) => item.custom_profile_item_id === 1
  //         )?.value?.length > 1 ? (
  //           <Image
  //             alt="profile"
  //             src={
  //               params.row.data.custom_profile_values.find(
  //                 (item: any) => item.custom_profile_item_id === 1
  //               ).value
  //             }
  //             width={100}
  //             height={100}
  //             className="rounded-full w-10 h-10 object-cover"
  //           />
  //         ) : (

  //         )} */}
  //         <div className="bg-gray-100 w-10 h-10 flex items-center justify-center font-light text-sm rounded-full">
  //           <UserIcon />
  //         </div>
  //         <div>
  //           <p className="font-medium">
  //             {params.row.data.firstName} {params.row.data.lastName}
  //           </p>
  //           <p className="opacity-80 text-sm">{params.row.data.email}</p>
  //         </div>
  //       </div>,
  //     ],
  //   },
  //   { field: "role", headerName: "Role", flex: 1 },
  //   {
  //     field: "status",
  //     headerName: "Status",
  //     flex: 1,
  //     type: "actions",
  //     getActions: (params: any) => [
  //       <div key={params.row.id} className="w-2/12">
  //         <StatusPill status={params.row.data?.user_status} />
  //       </div>,
  //     ],
  //   },
  //   {
  //     field: "actions",
  //     headerName: "Actions",
  //     flex: 1,
  //     type: "actions",
  //     getActions: (params: any) => [
  //       <Dropdown>
  //         <DropdownTrigger>
  //           <Button variant="light">
  //             {" "}
  //             <BsThreeDots size={20} />
  //           </Button>
  //         </DropdownTrigger>
  //         <DropdownMenu
  //           className="shadow-md bg-white border border-[#F1F5F9]  -mt-4 rounded-lg flex flex-col gap-3"
  //           aria-label="Static Actions"
  //         >
  //           {checkPermission(PermissionTypes.READ_USER) && (
  //             <DropdownItem
  //               key="view"
  //               className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
  //             >
  //               <Link
  //                 href={"/usermanagement/profile?id=" + params.row.data.id}
  //                 className="w-full block"
  //               >
  //                 View User
  //               </Link>
  //             </DropdownItem>
  //           )}
  //           {checkPermission(PermissionTypes.EDIT_USER) && (
  //             <DropdownItem
  //               key="edit"
  //               className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
  //             >
  //               <Link
  //                 href={"/usermanagement/edit-user?id=" + params.row.data.id}
  //                 className="w-full block"
  //               >
  //                 Edit User
  //               </Link>
  //             </DropdownItem>
  //           )}
  //           {checkPermission(PermissionTypes.EDIT_USER) &&
  //             (params.row.data?.user_status?.toLowerCase() === "inactive" ||
  //             params.row.data?.user_status?.toLowerCase() === "blacklisted" ? (
  //               <DropdownItem
  //                 key={"edit"}
  //                 className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
  //               >
  //                 <button
  //                   onClick={() => editUserStatus(params.row.data, "ACTIVE")}
  //                 >
  //                   Activate User
  //                 </button>
  //               </DropdownItem>
  //             ) : (
  //               <DropdownItem
  //                 key={"deactivate"}
  //                 className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
  //               >
  //                 <button
  //                   onClick={() => editUserStatus(params.row.data, "INACTIVE")}
  //                 >
  //                   Deactivate User
  //                 </button>
  //               </DropdownItem>
  //             ))}
  //           {checkPermission(PermissionTypes.BLACKLIST_USER) && (
  //             <DropdownItem
  //               key={"blacklist"}
  //               className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
  //             >
  //               <button onClick={() => blacklistUser(params.row.data.id)}>
  //                 Blacklist User
  //               </button>
  //             </DropdownItem>
  //           )}
  //         </DropdownMenu>
  //       </Dropdown>,
  //     ],
  //   },
  // ];

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
      console.log("in else");
      let temp: any = [];
      // for (let i = 0; i < data.length; i++) {
      //   if (data[i].user_status.toLowerCase() === activeFilter.value) {
      //     temp.push(data[i]);
      //   }
      // }

      setAggregatedUsers(temp);
    }
  }, [activeFilter]);

  // ROLE FILTERS
  // useEffect(() => {
  //   if (Boolean(activeRoleFilter?.length) && data) {
  //     setSearchTerm("");
  //     let temp: any = [];
  //     for (let i = 0; i < data?.length; i++) {
  //       if (
  //         Boolean(
  //           activeRoleFilter.find(
  //             // @ts-ignore
  //             (item: any) => item.id === data[i]?.profiles[0]?.role_id
  //           )
  //         )
  //       ) {
  //         temp.push(data[i]);
  //       }
  //     }

  //     setAggregatedUsers(temp);
  //   } else {
  //     setAggregatedUsers(data);
  //   }
  // }, [activeRoleFilter]);

  const StatusComponent = (item: any) => {
    return <Status status={item?.status} />;
  };

  const ActionsComponent = (item: any) => {
    return (
      <button className="bg-white text-black">
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
