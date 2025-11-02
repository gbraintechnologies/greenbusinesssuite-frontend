"use client";
import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import Link from "next/link";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { Button } from "@heroui/react";
import Table from "@/components/Table/Table";
import { BsEye } from "react-icons/bs";

interface Permission {
  app_id: number;
  permission_name: string;
  description: string;
  is_super_admin_only: boolean | null;
  id: number;
}

interface Role {
  role_name: string;
  app_id: number;
  role_description: string;
  is_support: boolean;
  is_admin_role: boolean;
  id: number;
  permissions: Permission[];
}

interface RowData {
  id: number;
  roleName: string;
  roleDescription: string;
  permissions: string;
}

function ViewRoles() {
  const router = useRouter();

  const { data: roles, isLoading } = useQuery({
    queryKey: ["mesh roles"],
    queryFn: services.getMeshBusinessSuiteRoles(),
  });

  const ActionsComponent = (role: any) => {
    return (
      <button
        type="button"
        className="rounded-full"
        onClick={() =>
          router.push(`/usermanagement/edit-role?roleId=${role?.id}`)
        }
      >
        <BsEye />
      </button>
    );
  };

  return (
    <div className="w-full p-5">
      <div className="w-full">
        <div className="w-full text-primary-dark flex justify-between">
          <div className="flex items-center gap-2">
            <div
              className="my-3 cursor-pointer flex text-sm items-center gap-2"
              onClick={() => router.back()}
            >
              <IoIosArrowBack size={12} />
            </div>
            <h3 className="font-semibold text-xl">All Roles</h3>
          </div>
          <div className="flex gap-3 items-center justify-end">
            <Link href="/usermanagement/new-role">
              <Button
                type="button"
                className="button bg-primary-green border border-gray-200 shadow-sm py-3 px-4 flex text-white text-sm hover:opacity-95 items-center gap-2 rounded-xl"
              >
                <IoIosAddCircleOutline /> Add new role
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full mt-10">
        <Table
          columns={[
            { name: "ID", uid: "id" },
            { name: "Name", uid: "roleName" },
            { name: "Description", uid: "description" },

            { name: "VIEW", uid: "actions" },
          ]}
          data={
            roles
              ? roles?.content?.map((role: any) => ({
                  ...role,
                }))
              : []
          }
          hasSearch={false}
          isLoading={isLoading}
          title="Roles & Permissions"
          page={1}
          // statusComponent={StatusComponent}
          actionsComponent={ActionsComponent}
        />
      </div>
    </div>
  );
}

export default ViewRoles;
