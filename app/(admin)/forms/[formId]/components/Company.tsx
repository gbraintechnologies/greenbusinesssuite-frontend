"use client";

import React, { useState } from "react";

// icons
import { MdOutlineFileDownload } from "react-icons/md";

import Image from "next/image";

// components
import DataTable from "@/components/DataTable/DataTable";

function Company() {
  // table column headers
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
              *
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
    { field: "date", headerName: "Date Assigned", flex: 1 },

    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id}>
          <MdOutlineFileDownload size={20} />
        </div>,
      ],
    },
  ];

  const [rows, setRows] = useState([]);

  return (
    <div className="mt-4">
      <DataTable isLoading={false} rows={rows} columns={columns} />
    </div>
  );
}

export default Company;
