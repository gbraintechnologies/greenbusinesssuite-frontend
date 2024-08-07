"use client";

import React, { useEffect, useState } from "react";

import DataTable from "@/components/DataTable/DataTable";
import SearchBox from "@/components/SearchBox/SearchBox";

import Link from "next/link";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";

import { BsThreeDots } from "react-icons/bs";

import UserIcon from "@/public/icons/UserIcon";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

import useCompany from "@/hooks/useCompany";

function Customers() {
  const { companyBranding: company } = useCompany();

  const [searchTerm, setSearchTerm] = useState("");

  const [rows, setRows] = useState<{ id: number | undefined; data: any }[]>([]);

  const { data: customers, isLoading } = useQuery({
    queryKey: ["all customers", company?.id],
    queryFn: services.companyCustomersWithFormCount(company?.id),
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["all users"],
    queryFn: services.allUsers(),
  });

  useEffect(() => {
    let temp: any = [];

    if (customers?.customersDetail && users) {
      for (let i = 0; i < customers?.customersDetail.length; i++) {
        let customer = customers?.customersDetail[i];
        // @ts-ignore
        const userData = users?.find(
          (item: any) => item.id === customer.userId
        );

        // @ts-ignore
        temp.push({
          id: customer.userId,
          count: customer.submitFormsCount,
          data: userData,
        });
      }

      setRows(temp);
    }
  }, [customers, isLoading, loadingUsers, users]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
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

    {
      field: "status",
      headerName: "Submitted forms count",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="w-2/12">
          {params.row.count}
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
                href={"/company/customers/profile?id=" + params.row.data.id}
              >
                View User
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      ],
    },
  ];

  return (
    <div className="w-full pb-20 mt-4 py-2 ">
      <div className="flex items-center px-5 justify-between my-4">
        <h3 className="px-1 text-xl font-semibold">Customers</h3>
        {/* <div className="flex items-center gap-3">
          <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div> */}
      </div>
      <DataTable isLoading={isLoading} rows={rows} columns={columns} />
    </div>
  );
}

export default Customers;
