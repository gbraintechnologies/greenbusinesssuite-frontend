"use client";

import React, { useState } from "react";
import Nav from "./components/Nav";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

// icons
import { BsThreeDots } from "react-icons/bs";

function UserManagement() {
  const [filters, setFilters] = useState([
    { id: 1, name: "All" },
    { id: 2, name: "Active" },
    { id: 3, name: "Inactive" },
    { id: 4, name: "Limited access" },
    { id: 5, name: "Suspended" },
    { id: 6, name: "Deleted" },
  ]);
  const [activeFilter, setActiveFilter] = useState({ id: 1, name: "All" });

  // fetch all users
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["all users"],
    queryFn: services.allUsers(),
  });

  console.log("data", data);

  return (
    <div className="w-full ">
      <Nav />

      {/* Sear5ch and filters */}
      <div className="flex justify-between my-4">
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
          <input
            className="border focus:outline-primary-green border-gray-200 rounded-lg px-3 py-2"
            placeholder="Search"
          />
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
          {data &&
            data.map((user: any) => {
              return (
                <div className="py-3   w-full flex justify-between px-5 items-center">
                  <p className="w-6/12 flex gap-3">
                    <div className="bg-gray-200 w-10 h-10 rounded-full"></div>
                    <div>
                      <p className="font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="opacity-80 text-sm">{user.email}</p>
                    </div>
                  </p>
                  <p className="w-2/12">N/A</p>
                  <p className="w-2/12"> N/A</p>
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
