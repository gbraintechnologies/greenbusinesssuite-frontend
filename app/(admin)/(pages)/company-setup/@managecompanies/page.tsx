"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";

import StatusPill from "@/components/StatusPill/StatusPill";
import { BsEye, BsThreeDots } from "react-icons/bs";
import DataTable from "@/components/DataTable/DataTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import services from "@/services";
import { CompanyInfo } from "@/types";
import Link from "next/link";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/react";
import { toast } from "sonner";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import { RiImageCircleLine } from "react-icons/ri";
import Nav from "../components/Nav";
import SearchBox from "@/components/SearchBox/SearchBox";
import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";

import Tabs from "@/components/Tabs/Tabs";
import Table from "@/components/Table/Table";
import Status from "@/components/Status/Status";
import { SlEye } from "react-icons/sl";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

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

  const [limit, setLimit] = useState(8);

  const [showNotificationsModal, setShowNotificationsModal] =
    useState<boolean>(false);

  const { checkPermission } = useAdmin();

  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies", page, limit],
    queryFn: services.getAllCompanies(page * limit, limit),
  });

  console.log("comp", companies);

  // const { data: searchData, isLoading: searchLoading } = useQuery({
  //   queryKey: ["all users", searchTerm],
  //   queryFn: services.searchCompany(searchTerm),
  //   enabled: Boolean(searchTerm),
  // });

  const StatusComponent = (item: any) => {
    return <Status status={item?.status} />;
  };

  const ActionsComponent = (item: any) => {
    return (
      <button
        onClick={() => {
          router.push(`/company-setup/profile?id=${item?.id}`);
        }}
        className="bg-white text-black"
      >
        <SlEye />
      </button>
    );
  };

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

  return (
    <>
      <div className="w-full pb-20 ">
        <Nav />
        <div className="flex items-center px-5 justify-between my-4">
          {/* FILTERS AND SEARCHBOX */}
          <div>
            {/* <Tabs
              filters={filters}
              setActiveFilter={setActiveFilter}
              activeFilter={activeFilter}
            /> */}
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

        <Table
          columns={[
            { name: "ID", uid: "id" },
            { name: "Name", uid: "companyName" },
            { name: "Email", uid: "primaryContactEmail" },
            { name: "Phone", uid: "primaryContactPhoneNumber" },
            { name: "STATUS", uid: "status" },
            { name: "VIEW", uid: "actions" },
          ]}
          data={
            companies
              ? companies?.content?.map((company: any) => ({
                  ...company,
                }))
              : []
          }
          hasSearch={false}
          isLoading={isLoading}
          totalPages={companies?.totalPages}
          rowsPerPage={limit}
          showTopPagination={false}
          page={companies?.page}
          // setLimit={setLimit}
          setPage={setPage}
          statusComponent={StatusComponent}
          actionsComponent={ActionsComponent}
        />
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
