"use client";

import React, { useEffect, useState } from "react";

// icons
import { MdOutlineFileDownload } from "react-icons/md";

import Image from "next/image";

// components
import DataTable from "@/components/DataTable/DataTable";
import { lowerCaseNoSpace } from "@/utils/LowerCaseNoSpace/LowerCaseNoSpace";
import UserIcon from "@/public/icons/UserIcon";
import { CompanyInfo } from "@/types";
import FormatDate from "@/utils/FormatDate/FormatDate";
import { AiFillPauseCircle } from "react-icons/ai";

function Company({ companies, companyName, assignDate }: any) {
  // table column headers
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
          key={params.row.data?.id}
        >
          {params.row.data?.company_logo?.length > 1 ? (
            <Image
              alt="profile"
              src={params.row.data?.company_logo}
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
            <p className="font-medium text-sm">
              {params.row.data?.company_name}
            </p>
          </div>
        </div>,
      ],
    },
    {
      field: "date",
      headerName: "Date Assigned",
      flex: 1,
      align: "left",
      headerAlign: "left",
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id}>{params.row.data?.dateAssigned}</div>,
      ],
    },

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

  const [aggregatedCompanies, setAggregatedCompanies] = useState<any>([]);

  // for late data loads
  useEffect(() => {
    if (companyName) {
      setAggregatedCompanies([
        companies?.find(
          (company: any) =>
            lowerCaseNoSpace(company?.company_name) == companyName
        )]
      );
    }
  }, [companyName, companies]);

  const [rows, setRows] = useState<any>([]);

  useEffect(() => {
    if (aggregatedCompanies?.length > 0) {
      console.log('aggregated companies is true ', aggregatedCompanies?.length)
      const preparedRows = aggregatedCompanies?.map(
        (company: Partial<CompanyInfo>) => {
          return {
            id: company?.id ? company?.id : Math.random(),
            data: {
              ...company,
              dateAssigned: FormatDate(assignDate),
            },
          };
        }
      );
      setRows(preparedRows);
    } else {
      setRows([]);
    }
  }, [aggregatedCompanies]);

  useEffect(()=> {
    console.log('rows changed to ', rows)
    console.log('aggregated companies changed to ', aggregatedCompanies)
  }, [rows, aggregatedCompanies, companyName])
  return (
    <div className="mt-4">
      <DataTable isLoading={false} rows={rows} columns={columns} />
    </div>
  );
}

export default Company;
