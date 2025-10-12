"use client";

import ComboSearch from "@/components/SearchBox/ComboSearch";
import services from "@/services";
import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { MdOutlineSettingsSuggest } from "react-icons/md";
import { PiUserCircleCheck } from "react-icons/pi";
import Loader from "@/components/Loader/Loader";
import Border from "@/components/Border/Border";

function CompanyAdmins({ companyId }: any) {
  // fetch all users

  const {
    data: companyData,
    isLoading: companyDataLoading,
    refetch,
  } = useQuery({
    queryKey: ["company", companyId],
    queryFn: services.getCompanyById(Number(companyId)),
  });

  const { data: adminDetails } = useQuery({
    queryKey: ["admin Details", companyData?.company_admin_id],
    queryFn: services.userByID(Number(companyData?.company_admin_id)),
    enabled: !!companyData && !!companyData?.company_admin_id,
  });

  useEffect(() => {
    refetch();
  }, []);

  const [searchAdminEmail, setSearchAdminEmail] = useState("");

  const { data: options, isLoading } = useQuery({
    queryKey: ["user by email", searchAdminEmail],
    queryFn: services.searchUsersByEmailFull(searchAdminEmail),
    enabled: !!searchAdminEmail,
  });

  //
  const [selectedAdminOption, setSelectedAdminOption] = useState(null);

  const filteredOptions = searchAdminEmail === "" ? [] : options?.data;

  const [loading, setLoading] = useState(false);

  const assignAdmin = () => {
    toast.info("Assigning...", {
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

        console.log("error assigning", e);
        toast.error("Error assigning user to company");
      });
  };

  if (companyDataLoading) {
    return (
      <div className="min-h-[30vh] flex items-start justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-[40vh] py-5">
      {/* Check if company is done building: DB CREATED AND PROVISIONED FOR IT  */}
      {!companyDataLoading &&
      companyData &&
      companyData?.status !== "ACTIVE" ? (
        <div className="h-40 flex items-start justify-start">
          <div className="flex flex-col text-gray-700 items-center justify-center gap-2">
            <MdOutlineSettingsSuggest className="" size={40} />
            <p className="text-gray-400 text-sm">
              [ Company is being setup, please wait... ]
            </p>
          </div>
        </div>
      ) : (
        <>
          {!!companyData?.company_admin_id ? (
            // display current admin
            <div className="flex items-start gap-5 w-full justify-start mt-4 text-gray-600">
              <PiUserCircleCheck size={60} />
              <h4 className="max-w-4xl">
                An administrator has successfully been assigned to{" "}
                <span className="font-bold"> {companyData?.company_name}</span>
                <Border />
                {adminDetails && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 h-24 flex items justify-between flex-col">
                      <p className="text-sm font-light">Administrator</p>
                      <p className="text-bold text-lg text-black">
                        {adminDetails?.first_name}, {adminDetails?.last_name}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 h-24 flex items justify-between flex-col">
                      <p className="text-sm font-light">Email</p>
                      <p className="text-bold text-lg text-black">
                        {adminDetails?.email}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 h-24 flex items justify-between flex-col">
                      <p className="text-sm font-light">Phone number</p>
                      <p className="text-bold text-lg text-black">
                        {adminDetails?.phone_number}
                      </p>
                    </div>
                  </div>
                )}
              </h4>
            </div>
          ) : (
            // assign

            <>
              {" "}
              <h4 className="font-semibold text-lg">
                Assign New Administrator
              </h4>
              <p className="mb-5 text-gray-600">
                Search from the list of users by email and select a user to
                assign to this company as an administrator
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
              </div>{" "}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default CompanyAdmins;
