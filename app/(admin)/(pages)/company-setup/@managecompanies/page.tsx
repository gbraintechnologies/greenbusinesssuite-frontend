"use client";
import React, { Fragment, useEffect, useState } from "react";
import SearchIcon from "@/public/icons/SearchIcon";
import Image from "next/image";
import UserIcon from "@/public/icons/UserIcon";
import StatusPill from "@/components/StatusPill/StatusPill";
import { BsThreeDots } from "react-icons/bs";
import DataTable from "@/components/DataTable/DataTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import services from "@/services";
import { CompanyInfo } from "@/types";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { GridColDef } from "@mui/x-data-grid";
import { createPortal } from "react-dom";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import { RiImageCircleLine } from "react-icons/ri";
import Nav from "../components/Nav";
import Tabs from "../components/Tabs";
import SearchBox from "@/components/SearchBox/SearchBox";
import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";
import Modal from "@/components/Modal/Modal";
import Notifications from "@/app/(admin)/(pages)/notifications-center/_components/Notifications";
import { TbMessage } from "react-icons/tb";

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
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<IFilter[]>([
    { id: 1, name: "All", value: "all" },
    { id: 2, name: "Active", value: "active" },
    { id: 3, name: "Inactive", value: "inactive" },
    { id: 4, name: "Suspended", value: "suspended" },
  ]);

  const [statuses, setStatuses] = useState([
    { id: 2, name: "Active", value: "ACTIVE" },
    { id: 3, name: "Inactive", value: "INACTIVE" },
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

  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(4);

  const [showNotificationsModal, setShowNotificationsModal] =
    useState<boolean>(false);

  const { checkPermission } = useAdmin();

  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies", page, limit],
    queryFn: services.getAllCompanies(page * limit, limit),
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["all users", searchTerm],
    queryFn: services.searchCompany(searchTerm),
    enabled: Boolean(searchTerm),
  });

  const editCompanyStatus = async (companyData: any, status: string) => {
    let companyDataInfo = { ...companyData, status: status };

    const keyToDelete = "company_custom_values";

    let customFields = companyDataInfo[keyToDelete];

    delete companyDataInfo[keyToDelete];

    try {
      const response = await services.editCompanyWithCustomFields(
        companyData.id,
        companyDataInfo,
        customFields
      );

      await queryClient.invalidateQueries({
        queryKey: ["companies", page, limit],
      });
      toast.success("Company status updated successfully");
    } catch (error) {
      toast.error("Failed to update company status");
    }
  };

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
    if (searchTerm.length > 0 && searchData) {
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
                <RiImageCircleLine size={20} />
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
        <>
          {/* TODO: NEW: USING THE DROPDOWN COMPONENT FROM NEXTUI: SUPPORTS
          DYNAMIC POSITIONING OF MENU TO AVOID CLIPPING WHEN ELEMENT IS AT AN
          EDGE */}
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
                  href={"/company-setup/profile?id=" + params.row.data.id}
                  className="w-full block"
                >
                  View Company
                </Link>
              </DropdownItem>
              {checkPermission(PermissionTypes.EDIT_COMPANY) && (
                <DropdownItem
                  key="edit"
                  className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                >
                  <Link
                    href={
                      "/company-setup/profile/edit?id=" + params.row.data.id
                    }
                    className="w-full block"
                  >
                    Edit Company
                  </Link>
                </DropdownItem>
              )}
              {checkPermission(PermissionTypes.EDIT_COMPANY) &&
                (params.row.data?.status?.toLowerCase() === "active" ? (
                  <DropdownItem className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]">
                    <button
                      onClick={() =>
                        editCompanyStatus(params.row.data, "INACTIVE")
                      }
                    >
                      Deactivate Company
                    </button>
                  </DropdownItem>
                ) : (
                  <DropdownItem className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]">
                    <button
                      onClick={() =>
                        editCompanyStatus(params.row.data, "ACTIVE")
                      }
                    >
                      Activate Company
                    </button>
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>
        </>,
      ],
    },
  ];

  const roles: any = [];

  return (
    <>
      <div className="w-full pb-20 ">
        <Nav />
        <div className="flex items-center px-5 justify-between my-4">
          {/* FILTERS AND SEARCHBOX */}
          <div>
            <Tabs
              filters={filters}
              setActiveFilter={setActiveFilter}
              activeFilter={activeFilter}
            />
          </div>
          <div className="flex gap-4">
            {/* <button
              className=" bg-white text-[#334155] border border-[rgba(226, 232, 240, 1)] w-auto flex text-sm px-2 font-medium py-2 hover:opacity-95 items-center justify-center gap-2 rounded-lg "
              onClick={() => setShowNotificationsModal(true)}
            >
              <TbMessage color={"#334155"} size={20}/>
              Send Message
            </button> */}
            {checkPermission(PermissionTypes.SEARCH_COMPANY) && (
              <div className="flex items-center gap-3">
                <SearchBox
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>
            )}
          </div>
        </div>

        <DataTable
          isLoading={isLoading || searchLoading}
          rows={rows}
          columns={columns}
        />
        {/*PAGINATION */}

        <div className="w-full flex justify-between">
          <ItemsPerPageSelector limit={limit} setLimit={setLimit} />
          <Pagination
            currentData={companies}
            limit={limit}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
      {/* <Modal
        isOpen={showNotificationsModal}
        setIsOpen={setShowNotificationsModal}
        size="small"
        showTitle={false}
        hideClose={true}
      >
        <Notifications setShow={setShowNotificationsModal} />
      </Modal> */}
    </>
  );
}

export default CompanySetup;
