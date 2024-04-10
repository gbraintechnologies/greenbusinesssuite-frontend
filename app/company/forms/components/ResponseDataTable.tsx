"use client";
import DataTable from "@/components/DataTable/DataTable";
import ListIcon from "@/public/icons/ListIcon";
import UserIcon from "@/public/icons/UserIcon";
import { GridColDef, GridColumnHeaderParams } from "@mui/x-data-grid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";

export interface IResponse {
  email: string;
  rating: string;
  comment: string;
  full_name: string;
  phone_number: string;
  recommendation: string;
}
type Props = {
  responseData: IResponse[];
  isResponseLoading: boolean;
};

const ResponseDataTable: React.FC<Props> = ({
  responseData,
  isResponseLoading,
}) => {
  const [aggregatedResponses, setAggregatedResponses] = useState([]);

  const [rows, setRows] = useState<any>([]);

  useEffect(() => {
    if (responseData?.length > 0) {
      const preparedRows = responseData.map(
        (response: IResponse, index: number) => {
          return {
            id: index,
            data: response,
          };
        }
      );
      setRows(preparedRows);
      console.log(preparedRows);
    } else {
      setRows([]);
    }
  }, [responseData]);

  const columns: GridColDef[] = [
    {
      field: "name",
      renderHeader: (params: GridColumnHeaderParams) => (
        <div className="flex justify-between items-center gap-9">
          <div className="flex items-center gap-3">
            <input type="checkbox" className="form-check-input" checked={false} />
          <div className="font-semibold">Response Id</div>
            </div>
          <ListIcon />
        </div>
      ),
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 1,
      getActions: (params: any) => [
        <div
          className="flex justify-between items-center gap-4"
          key={params.row.data?.id}
        >
          <input
            id={params.row.id}
            type="checkbox"
            className="form-check-input"
            checked={false}
          />
          <div>{params.row.id}</div>
        </div>,
      ],
    },
    {
      field: "Name",
      headerName: "Name",
      flex: 2,
      headerAlign: "left",
      align: "left",
      type: "actions",
      getActions: (params: any) => [
        <div className="flex gap-2 items-center">
          <div className="bg-gray-100 w-10 h-10 flex items-center justify-center font-light text-sm rounded-full">
            <UserIcon />
          </div>
          <div key={params.row.id} className="flex flex-col gap-2">
            <p className="font-medium text-sm">{params.row.data?.full_name}</p>
            <p className="text-[#475569] text-sm font-normal">
              {params.row.data?.email}
            </p>
          </div>
        </div>,
      ],
    },
    {
      field: "dateCompleted",
      headerName: "Date Completed",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id}>{new Date().toLocaleDateString()}</div>,
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
    <div>
      <DataTable isLoading={isResponseLoading} rows={rows} columns={columns} />
    </div>
  );
};

export default ResponseDataTable;
