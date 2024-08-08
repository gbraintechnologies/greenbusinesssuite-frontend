"use client";
import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import Link from "next/link";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/DataTable/DataTable";
import DeleteIcon from "@/public/icons/DeleteIcon";
import EditIconSetup from "@/public/icons/EditIconSetup";
import { useRouter } from "next/navigation";
import toSpace from "@/utils/UnderScore/UnderScore";

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
  const [rows, setRows] = useState<RowData[]>([]);
  const [limit, setLimit] = useState(15);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["all user roles", limit],
    queryFn: services.allUserRoles(limit),
  });

  useEffect(() => {
    if (data) {
      const transformedData = data.map((role: Role) => ({
        id: role.id,
        roleName: role.role_name,
        roleDescription: role.role_description,
        permissions: role.permissions.map(p => p.permission_name).join(", "),
      }));
      setRows(transformedData);
    }
    refetch();
  }, [data, refetch]);

  const columns = [
    {
      field: "roleName",
      headerName: "Name of Role",
      flex: 1,
      renderCell: (params: any) => (
        <div className="flex py-3 gap-4 my-3 items-center h-12"> 
          <div className="h-10 flex items-center justify-center">
            {params.value}
          </div>
        </div>
      ),
    },
    {
      field: "roleDescription",
      headerName: "Role Description",
      flex: 1,
      renderCell: (params: any) => (
        <div
          className="flex flex-col gap-2 my-2 h-12" 
          style={{ whiteSpace: "normal", wordBreak: "break-word" }}
        >
          <p className="font-medium text-sm">{params.value}</p>
        </div>
      ),
    },
    {
      field: "permissions",
      headerName: "Permissions",
      flex: 4,
      renderCell: (params: any) => (
        <div
          className="flex flex-col gap-2 my-2 h-12"  
          style={{ whiteSpace: "normal", wordBreak: "break-word" }}
        >
          <p className="font-medium text-sm">{toSpace(params.value)}</p>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params: any) => (
        <div className="flex items-center justify-end h-12">
          <button
            type="button"
            className="rounded-full"
            style={{ right: "-10px" }}
            onClick={() => router.push(`/usermanagement/edit-role?roleId=${params.row.id}`)}
          >
            <EditIconSetup />
          </button>
          {/* <button
            type="button"
            className="rounded-full"
            style={{ right: "-10px" }}
          >
            <DeleteIcon />
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full p-5">
      <div className="w-full">
        <div className="w-full text-primary-dark flex justify-between">
          <div>
            <h3 className="font-semibold text-xl">View all roles</h3>
          </div>
          <div className="flex gap-3 items-center justify-end">
            <Link href="/usermanagement/new-role">
              <button
                type="button"
                className="button bg-primary-green border border-gray-200 shadow-sm py-3 px-4 flex text-white text-sm hover:opacity-95 items-center gap-2 rounded-xl"
              >
                <IoIosAddCircleOutline /> Add new Roles
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full mt-10">
        <DataTable rows={rows} isLoading={isLoading} columns={columns} />
      </div>
    </div>
  );
}

export default ViewRoles;
