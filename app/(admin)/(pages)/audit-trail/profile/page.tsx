"use client";
import UserIcon from "@/public/icons/UserIcon";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useLayoutEffect } from "react";
import UserRole from "../components/UserRole";
import StatusPill from "@/components/StatusPill/StatusPill";
import { BsArrowDown } from "react-icons/bs";
import DataTable from "@/components/DataTable/DataTable";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

const page = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const { data: user, isLoading: userDataLoading } = useQuery({
    queryKey: ["get user by id", id],
    queryFn: services.userByID(id as string),
  });

  const {
    data: roles,
    isLoading: rolesLoading,
    refetch,
  } = useQuery({
    queryKey: ["mesh roles"],
    // ID OF MESH APP IS 1 IN DB
    queryFn: services.getMeshBusinessSuiteRoles(),
  });

  const [role, setRole] = React.useState("");

  const [rows, setRows] = React.useState<any>([]);

  const data = [
    { id: 84732 },
    { id: 95884 },
    { id: 35876 },
    { id: 93841 },
    { id: 95832 },
    { id: 50349 },
    { id: 96943 },
    { id: 96944 },
    { id: 96945 },
  ];

  const columns: any[] = [
    {
      field: "name",
      renderHeader: () => (
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="form-check-input"
              defaultChecked={false}
            />
            <div className="font-medium text-sm text-[#667085] capitalize">
              Event Id
            </div>
          </div>
          <BsArrowDown />
        </div>
      ),
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 1,
      getActions: (params: any) => [
        <div
          className="flex justify-between items-center gap-4"
          key={params.row?.id}
        >
          <input
            id={params.row?.id}
            type="checkbox"
            className="form-check-input"
            defaultChecked={false}
          />
          <div>{params.row?.id}</div>
        </div>,
      ],
    },
    {
      field: "timestamp",
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
            status={
              params?.row?.id % 2 === 0 ? "Login successful" : "Logged out"
            }
            success={params?.row?.id % 2 === 0 ? true : false}
            textTransform="uppercase font-medium"
          />
        </div>,
      ],
    },
  ];
  useLayoutEffect(() => {
    if (user) {
      const roleID = user?.profiles[0]?.role_id;
      const role = roles?.find((role: any) => role.id === roleID);
      setRole(role?.role_name);
      setRows(data);
    }
  }, [user, roles]);

  if (userDataLoading || rolesLoading) {
    return (
      <div className="h-[20rem] flex items-center justify-center">
        <div>
          <LoadingIcon />
          <p className="mt-2 text-xs text-gray-500">Fetching user details</p>
        </div>
      </div>
    );
  }
  return (
    <div className="px-5 w-full">
      <div className="w-full text-[#0F172A] mb-5 ">
        <h3 className="font-semibold text-xl">Audit Trail</h3>
      </div>
      <div className="flex w-full gap-3 items-start">
        <div className="border-b-2 border-b-slate-200 pb-3 w-auto flex gap-3 items-center sticky top-16">
          <div>
            {user?.custom_profile_values &&
            user?.custom_profile_values.find(
              (item: any) => item.custom_profile_item_id === 1
            )?.value?.length > 1 ? (
              <Image
                alt="profile"
                src={
                  user?.custom_profile_values.find(
                    (item: any) => item.custom_profile_item_id === 1
                  ).value
                }
                width={150}
                height={150}
                className="rounded-full w-24 h-24 object-cover"
              />
            ) : (
              <div className="bg-gray-100 w-24 h-24 flex items-center justify-center text-3xl font-bold rounded-full">
                {user?.first_name && user?.first_name[0]?.toUpperCase()}
                {user?.last_name && user?.last_name[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-[#101828] font-bold text-lg">
              {user?.first_name} {user?.last_name}
            </div>
            <UserRole role={role} />
          </div>
        </div>
        <DataTable rows={rows} columns={columns} />
      </div>
    </div>
  );
};

export default page;
