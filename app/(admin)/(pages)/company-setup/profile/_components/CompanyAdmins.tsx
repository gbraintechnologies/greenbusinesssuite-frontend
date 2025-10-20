"use client";

import ComboSearch from "@/components/SearchBox/ComboSearch";
import services from "@/services";
import { Autocomplete, AutocompleteItem, Button, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { MdOutlineSettingsSuggest } from "react-icons/md";
import { PiUserCircleCheck } from "react-icons/pi";
import Loader from "@/components/Loader/Loader";
import Border from "@/components/Border/Border";
import { CompanyType } from "@/types";

function CompanyAdmins({ companyId }: any) {
  // fetch all users

  const {
    data: companyData,
    isLoading: companyDataLoading,
    refetch,
  } = useQuery<CompanyType>({
    queryKey: ["company", companyId],
    queryFn: services.getCompanyById(Number(companyId)),
  });

  const { data: adminDetails, isLoading: loadingAdminDetails } = useQuery({
    queryKey: ["admin Details", companyData?.companyAdminId],
    queryFn: services.userByID(Number(companyData?.companyAdminId)),
    enabled: !!companyData && !!companyData?.companyAdminId,
  });

  useEffect(() => {
    refetch();
  }, []);

  const [searchAdminEmail, setSearchAdminEmail] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["all users", searchAdminEmail],
    queryFn: services.allUsers(),
  });

  //
  const [selectedAdminOption, setSelectedAdminOption] = useState(null);

  const [loading, setLoading] = useState(false);

  const assignAdmin = () => {
    toast.info("Assigning...", {
      description: "Assigning new administrator, please wait",
    });
    setLoading(true);
    services
      .assignAdminToCompany(
        // @ts-ignore
        selectedAdminOption,
        companyId
      )
      .then((res) => {
        console.log("assigned", res?.data);
        toast.dismiss();
        setLoading(false);
        setSelectedAdminOption(null);
        toast.success(`Assigning successful`);
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
      {companyData && companyData?.buildStatus != "ACTIVE" ? (
        <div className="border rounded-xl p-20  flex items-center justify-center">
          <div className="flex flex-col text-gray-700 items-center justify-center gap-2">
            <Spinner size="lg" color="primary" />
            <p className="text-gray-500 mt-2">
              [ Company is being setup, please wait... ]
            </p>
          </div>
        </div>
      ) : (
        <>
          {!!companyData?.companyAdminId ? (
            // display current admin
            <div className="flex items-start gap-5 w-full justify-start mt-4 text-gray-600">
              <PiUserCircleCheck size={60} />
              <h4 className="max-w-4xl">
                An administrator has successfully been assigned to{" "}
                <span className="font-bold"> {companyData?.companyName}</span>
                <Border />
                {loadingAdminDetails && <Spinner />}
                {adminDetails && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 h-24 flex items justify-between flex-col">
                      <p className="text-sm font-light">Administrator</p>
                      <p className="text-bold text-lg text-black">
                        {adminDetails?.firstName}, {adminDetails?.lastName}
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
                        {adminDetails?.phone}
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
                <Autocomplete
                  variant="bordered"
                  className="w-full"
                  placeholder="Select an admin"
                  selectedKey={selectedAdminOption ?? null}
                  scrollShadowProps={{
                    isEnabled: false,
                  }}
                  popoverProps={{
                    offset: 10,
                    classNames: {
                      content:
                        "shadow-md bg-white border border-[#F1F5F9] p-0 rounded-lg min-w-72 flex flex-col gap-3",
                    },
                  }}
                  onSelectionChange={(key: any) => {
                    setSelectedAdminOption(key);
                  }}
                >
                  {users?.map((user: any) => (
                    <AutocompleteItem
                      key={user?.id}
                      className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[rgb(241,245,249)]"
                    >
                      {user?.email}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>

                <Button
                  onPress={assignAdmin}
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
