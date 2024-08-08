"use client";

import ComboSearch from "@/components/SearchBox/ComboSearch";
import services from "@/services";
import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { MdOutlineSettingsSuggest } from "react-icons/md";

function CompanyAdmins({ companyId }: any) {
  // fetch all users
  const { data: options, isLoading } = useQuery({
    queryKey: ["all users"],
    queryFn: services.allUsers(),
  });

  const {
    data: companyData,
    isLoading: companyDataLoading,
    refetch,
  } = useQuery({
    queryKey: ["company", companyId],
    queryFn: services.getCompanyById(Number(companyId)),
  });

  useEffect(() => {
    if (companyData?.status !== "ACTIVE") {
      setInterval(() => {
        refetch();
      }, 5000);
    }
  }, [companyData]);

  const [searchAdminEmail, setSearchAdminEmail] = useState("");

  //
  const [selectedAdminOption, setSelectedAdminOption] = useState(null);

  const filteredOptions =
    searchAdminEmail === ""
      ? options
      : options?.filter((option: any) =>
          option?.email
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(searchAdminEmail.toLowerCase().replace(/\s+/g, ""))
        );

  const [loading, setLoading] = useState(false);

  const assignAdmin = () => {
    toast.loading("Assgning...", {
      description: "Assigning new administrator, please wait",
    });
    setLoading(true);
    services
      .assignAdminToCompany(
        // @ts-ignore
        selectedAdminOption?.id,
        companyId
      )
      .then((res) => {
        // console.log("assigned", res?.data);
        toast.dismiss();
        setLoading(false);
        setSelectedAdminOption(null);
        toast.success(
          // @ts-ignore
          `${selectedAdminOption?.first_name} assigned to company!`
        );
      })
      .catch((e) => {
        toast.dismiss();
        setLoading(false);
        setSelectedAdminOption(null);
        toast.error("Error assigning user to company");
      });
  };

  return (
    <div className="min-h-[40vh] py-5">
      {/* Check if company is done building: DB CREATED AND PROVISIONED FOR IT  */}
      {!companyDataLoading &&
      companyData &&
      companyData?.status !== "ACTIVE" ? (
        <div className="h-40 flex items-center justify-center">
          <div className="flex flex-col text-gray-700 items-center justify-center gap-2">
            <MdOutlineSettingsSuggest className="" size={40} />
            <p className="text-gray-400 text-sm">
              [ Company is being setup, please wait... ]
            </p>
          </div>
        </div>
      ) : (
        <>
          <h4 className="font-semibold text-lg">Assign New Administrator</h4>
          <p className="mb-5 text-gray-600">
            Search from the list of users by email and select a user to assign
            to this company as an administrator
          </p>
          <div className="max-w-md">
            <ComboSearch
              search={searchAdminEmail}
              setSearch={setSearchAdminEmail}
              setSelected={setSelectedAdminOption}
              selected={selectedAdminOption}
              placeholder="Search users by email"
              data={filteredOptions ? filteredOptions : []}
            />

            <Button
              onClick={assignAdmin}
              disabled={selectedAdminOption === null || loading}
              className="bg-black text-sm disabled:cursor-not-allowed disabled:bg-gray-500 text-white mt-5 px-4 py-2 rounded-lg"
            >
              Assign New Admin
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default CompanyAdmins;
