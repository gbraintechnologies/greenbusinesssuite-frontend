"use client";

import React, { useEffect, useState } from "react";
import Nav from "./components/Nav";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

// icons
import { BsThreeDots } from "react-icons/bs";
import SearchIcon from "@/public/icons/SearchIcon";
import Image from "next/image";

function UserManagement() {
  const [filters, setFilters] = useState([
    { id: 1, name: "All", value: "" },
    { id: 2, name: "Active", value: "active" },
    { id: 3, name: "Inactive", value: "inactive" },
    { id: 7, name: "Newly Created", value: "newly_created" },
    { id: 4, name: "Limited access", value: "limited_access" },
    { id: 5, name: "Suspended", value: "suspended" },
    { id: 6, name: "Deleted", value: "deleted" },
  ]);
  const [activeFilter, setActiveFilter] = useState({ id: 1, name: "All" });

  const [searchTerm, setSearchTerm] = useState("");

  // fetch all users
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["all users"],
    queryFn: services.allUsers(),
  });

  const { data: searchData } = useQuery({
    queryKey: ["all users", searchTerm],
    queryFn: services.searchUsers(searchTerm),
    enabled: Boolean(searchTerm),
  });

  const [aggregatedUsers, setAggregatedUsers] = useState([]);

  useEffect(() => {
    if (searchTerm.length > 1 && searchData) {
      setAggregatedUsers(searchData);
    }

    if (data && searchTerm.length < 1) {
      setAggregatedUsers(data);
    }
  }, [searchData, data, searchTerm]);

  return (
    <div className="w-full pb-20 ">
      <Nav />

      {/* Search and filters */}
      <div className="flex items-center justify-between my-4">
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
          <div className="border shadow-sm focus:outline-primary-green border-gray-200 rounded-xl px-3 py-2 text-sm flex gap-2 items-center">
            <SearchIcon />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none focus:outline-none bg-white"
              placeholder="Search"
            />
          </div>
          <button className="border text-gray-400 border-gray-200 rounded-lg px-3 py-2">
            Filter
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="py-2 text-sm bg-gray-100 w-full flex justify-between px-5 items-center">
        <p className="w-6/12">Name</p>
        <p className="w-2/12">Role</p>
        <p className="w-2/12">Status</p>
        <p className="w-2/12">Action</p>
      </div>

      {isLoading ? (
        <div className="h-[40vh] w-full flex items-center justify-center">
          <div>
            <LoadingIcon />
            <p className="text-sm font-light text-gray-600 mt-3">
              Getting all users
            </p>
          </div>
        </div>
      ) : (
        <div>
          {aggregatedUsers
            ?.filter((item: any) => {
              // @ts-ignore
              if (activeFilter?.value?.length > 3) {
                // @ts-ignore
                return item.user_status.toLowerCase() === activeFilter?.value;
              } else {
                return item;
              }
            })
            .map((user: any) => {
              return (
                <div className="py-3   w-full flex justify-between px-5 items-center">
                  <p className="w-6/12 flex gap-3">
                    {user.custom_profile_values &&
                    user.custom_profile_values.find(
                      (item: any) => item.custom_profile_item_id === 1
                    ) ? (
                      <Image
                        alt="profile"
                        src={
                          user.custom_profile_values.find(
                            (item: any) => item.custom_profile_item_id === 1
                          ).value
                        }
                        width={10}
                        height={10}
                        className="rounded-full w-10 h-10 object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 w-10 h-10 rounded-full"></div>
                    )}
                    <div>
                      <p className="font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="opacity-80 text-sm">{user.email}</p>
                    </div>
                  </p>
                  <p className="w-2/12">N/A</p>
                  <p className="w-2/12">
                    <span
                      className={`
                  ${
                    user?.user_status.toLowerCase() === "active" &&
                    "text-[#16A34A] bg-[#F0FDF4]"
                  }
                   ${
                     user?.user_status.toLowerCase() === "inactive" &&
                     "text-[#D97706] bg-[#FFFBEB]"
                   }
                  ${
                    user?.user_status.toLowerCase() === "newly_created" &&
                    "text-[#344054] bg-[#F1F5F9]"
                  }

              capitalize text-xs px-5 rounded-full py-1
                  `}
                    >
                      {user?.user_status.toLowerCase().replaceAll("_", " ")}
                    </span>
                  </p>
                  <p className="w-2/12">
                    <BsThreeDots size={20} />
                  </p>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default UserManagement;
