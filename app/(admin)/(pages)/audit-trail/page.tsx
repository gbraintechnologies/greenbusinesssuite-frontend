"use client";
import React, { useEffect } from "react";
import Dropdown from "./components/Dropdown";
import DatePicker from "@/components/DatePicker/DatePicker";
import Image from "next/image";
import UserIcon from "@/public/icons/UserIcon";
import StatusPill from "@/components/StatusPill/StatusPill";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/DataTable/DataTable";
import FormatDate from "@/utils/FormatDate/FormatDate";
import Link from "next/link";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

function AuditTrail() {
  const dropdownOptions = [
    { value: "approvals", label: "Approvals" },
    { value: "userlogins", label: "User Logins" },
    { value: "reportextractions", label: "Report Extractions" },
    { value: "configurationchanges", label: "Configuration Changes" },
    { value: "usermanagementactivities", label: "User Management Activities" },
    { value: "dataupdates", label: "Data Updates" },
  ];

  const [selectedOption, setSelectedOption] = React.useState(
    dropdownOptions[0]
  );

  const [selectedCompany, setSelectedCompany] = React.useState({
    company_name: "All Companies",
  });

  const [selectedTimeline, setSelectedTimeline] = React.useState<any>()

  const [rows, setRows] = React.useState([]);

  const { data, isLoading: usersLoading } = useQuery({
    queryKey: ["all users"],
    queryFn: services.allUsers(),
  });

  const { data: companies, isLoading: companyDataLoading } = useQuery({
    queryKey: ["all companies"],
    queryFn: services.getAllCompanies(),
  });

  useEffect(() => {
    if (data?.length > 1) {
      setRows(data);
    }
  }, [data]);

  const columns: any[] = [
    {
      field: "name",
      renderHeader: () => (
        <div className="text-sm text-[#667085] capitalize font-medium">
          Timestamp
        </div>
      ),
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 1,
      getActions: (params: any) => [
        <div className="flex flex-col gap-3">
          <div className="text-[#101828] text-sm font-medium">
            {new Date().toLocaleDateString("en-us", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="text-sm text-[#667085] font-normal">
            {new Date().toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>,
      ],
    },
    {
      field: "Name",
      renderHeader: () => (
        <div className="text-sm text-[#667085] capitalize font-medium">
          Name
        </div>
      ),
      flex: 2,
      headerAlign: "left",
      align: "left",
      type: "actions",
      getActions: (params: any) => [
        <div className="flex gap-2 items-center">
          <div className="">
            {params.row?.custom_profile_values &&
            params.row?.custom_profile_values.find(
              (item: any) => item.custom_profile_item_id === 1
            )?.value?.length > 1 ? (
              <Image
                alt="profile"
                src={
                  params.row?.custom_profile_values.find(
                    (item: any) => item.custom_profile_item_id === 1
                  ).value
                }
                width={150}
                height={150}
                className="rounded-full w-10 h-10 object-cover"
              />
            ) : (
              <div className="bg-gray-100 w-10 h-10 flex items-center justify-center font-medium text-sm rounded-full">
                {params.row?.first_name &&
                  params.row?.first_name[0]?.toUpperCase()}
                {params.row?.last_name &&
                  params.row?.last_name[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">
              {params.row?.first_name} {params.row?.last_name}
            </p>
            <p className="text-[#667085] text-sm font-normal">
              {params.row?.email}
            </p>
          </div>
        </div>,
      ],
    },
    {
      field: "userActions",
      renderHeader: () => (
        <div className="text-sm text-[#667085] capitalize font-medium">
          User Actions
        </div>
      ),
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div>
          <StatusPill
            status={params?.row?.id % 2 === 0 ? "User Login" : "Failed Login"}
            success={params?.row?.id % 2 === 0 ? true : false}
            textTransform="uppercase font-medium"
          />
        </div>,
      ],
    },
    {
      field: "action",
      renderHeader: () => (
        <div className="text-sm text-[#667085] capitalize font-medium">
          Action
        </div>
      ),
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <Link
          href={`/audit-trail/profile?id=${params.row.id}`}
          className="text-sm text-blue-500"
        >
          Show Details
        </Link>,
      ],
    },
  ];

  if (usersLoading || companyDataLoading) {
    return (
      <div className="h-[20rem] flex items-center justify-center">
        <div>
          <LoadingIcon />
          <p className="mt-2 text-xs text-gray-500">Fetching users</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5">
      <div className="w-full text-[#0F172A] ">
        <h3 className="font-semibold text-xl">Audit Trail</h3>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Dropdown
              options={dropdownOptions}
              selected={selectedOption}
              setSelected={setSelectedOption}
              labelName={"label"}
            />

            <Dropdown
              options={[{ company_name: "All Companies" }, ...companies]}
              selected={selectedCompany}
              setSelected={setSelectedCompany}
              width="w-64"
              labelName={"company_name"}
            />

            <DatePicker selectedTimeline={selectedTimeline} setSelectedTimeline={setSelectedTimeline} />
          </div>
        </div>
      </div>
      <div className="mt-5">
        <DataTable rows={rows} columns={columns} />
      </div>
    </div>
  );
}

export default AuditTrail;
