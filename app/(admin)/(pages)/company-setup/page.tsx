"use client";
import React, { Fragment, useEffect, useState } from "react";
import Nav from "./components/Nav";
import TabItem from "./components/TabItem";
import SearchIcon from "@/public/icons/SearchIcon";
import SearchBox from "./components/SearchBox";
import Tabs from "./components/Tabs";
import RoleFilter from "../usermanagement/components/RoleFilter";
import Image from "next/image";
import UserIcon from "@/public/icons/UserIcon";
import StatusPill from "@/components/StatusPill/StatusPill";
import { BsThreeDots } from "react-icons/bs";
import DataTable from "@/components/DataTable/DataTable";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import { CompanyInfo } from "@/types";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { GridColDef } from "@mui/x-data-grid";

export interface IFilter {
  id: number;
  name: string;
  value: string;
}

interface IRowData {
  companyName: string;
  contact_person: {
    firstName: string;
    lastName: string;
    email: string;
  };
  user_status: string;
  custom_profile_values: any[];
}
interface IRow {
  id: string;
  data: IRowData;
}
function CompanySetup() {
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

  const [activeRoleFilter, setActiveRoleFilter] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRow, setSelectedRow] = useState();

  const [aggregatedCompanies, setAggregatedCompanies] = useState([]);

  const [rows, setRows] = useState<
    { id: number | undefined; data: Partial<CompanyInfo> }[]
  >([]);

  const { data: companies, isLoading } = useQuery({
    queryKey: ["all companies"],
    queryFn: services.getAllCompanies(),
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["all users", searchTerm],
    queryFn: services.searchCompany(searchTerm),
    enabled: Boolean(searchTerm),
  });

  //Status Filter
  useEffect(() => {
    if (activeFilter.value === "all") {
      setAggregatedCompanies(companies);
    } else {
      const filteredCompanies = companies.filter(
        (company: any) =>
          company.status.toLowerCase() === activeFilter.value.toLowerCase()
      );
      setAggregatedCompanies(filteredCompanies);
    }
  }, [activeFilter, companies]);

  //Search Filter
  useEffect(() => {
    if (searchTerm.length > 1 && searchData) {
      setAggregatedCompanies(searchData);
    }

    if (companies && searchTerm.length < 1) {
      setActiveRoleFilter([]);
      setAggregatedCompanies(companies);
    }
  }, [searchTerm, companies, searchData]);

  useEffect(() => {
    if (aggregatedCompanies?.length > 0) {
      setRows(aggregatedCompanies);
    }
  }, [aggregatedCompanies]);

  useEffect(() => {
    if (aggregatedCompanies?.length > 0) {
      const preparedRows = aggregatedCompanies
        .filter((item: any) => {
          return !item.is_deleted;
        })
        .map((company: Partial<CompanyInfo>) => {
          return {
            id: company.id,
            data: company,
          };
        });
      setRows(preparedRows);
    } else {
      setRows([]);
    }
  }, [aggregatedCompanies]);

  const columns: GridColDef[] = [
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
            <Link href={`/company-setup/profile?id=${params.row.data?.id}`}>
              <Image
                alt="profile"
                src={params.row.data?.company_logo}
                width={100}
                height={100}
                className="w-10 h-10 object-cover"
              />
            </Link>
          ) : (
            <Link href={`/company-setup/profile?id=${params.row.data?.id}`}>
              <div className="bg-gray-100 w-10 h-10 flex items-center justify-center font-light text-sm rounded-full">
                <UserIcon />
              </div>
            </Link>
          )}
          <div>
            <Link href={`/company-setup/profile?id=${params.row.data?.id}`}>
              <p className="font-medium text-sm">
                {params.row.data?.company_name}
              </p>
            </Link>
          </div>
        </div>,
      ],
    },
    {
      field: "contactPerson",
      headerName: "Contact Person",
      flex: 2,
      headerAlign: "left",
      align: "left",
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="flex flex-col gap-2">
          <p className="font-medium text-sm">
            {params.row.data?.primary_contact_name}
          </p>
          <p className="text-[#475569] text-sm font-normal">
            {params.row.data?.primary_contact_email}
          </p>
        </div>,
      ],
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="w-2/12">
          <StatusPill status={params.row.data?.status ?? ""} />
        </div>,
      ],
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
          <Menu as="div" className="absolute text-left z-50">
            <Menu.Button as="button">
              <BsThreeDots size={20} />
            </Menu.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Menu.Items className="absolute right-0 w-56 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[10000000000000]">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        href={"/company-setup/profile?id=" + params.row.data.id}
                      >
                        View Company
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                      className={`${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      href={"/company-setup/profile/edit?id=" + params.row.data.id}
                    >
                      Edit Company
                    </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                  {({ active }) => (
                      <button
                      className={`${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >
                      Edit Company
                    </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
      ],
    },
  ];

  const roles: any = [];
  return (
    <div className="w-full pb-20 ">
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
        </div>
      </div>
        <DataTable
          isLoading={isLoading || searchLoading}
          rows={rows}
          columns={columns}
        />
    </div>
  );
}

export default CompanySetup;
