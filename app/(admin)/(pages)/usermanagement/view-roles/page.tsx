"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosAddCircleOutline, IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@heroui/react";
import Table from "@/components/Table/Table";
import { BsEye, BsThreeDots, BsTrash } from "react-icons/bs";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import Modal from "@/components/Modal/Modal";
import DeleteRole from "../actions/DeleteRole";

function ViewRoles() {
  const router = useRouter();
  const [roleToDelete, setRoleToDelete] = useState<{
    id: number | string;
    name: string;
  } | null>(null);

  const { data: roles, isLoading } = useQuery({
    queryKey: ["mesh roles"],
    queryFn: services.getMeshBusinessSuiteRoles(),
  });

  const ActionsComponent = (role: any) => {
    const roleId = role?.__originalId ?? role?.id;

    return (
      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="min-w-8 text-slate-600"
            aria-label="Role actions"
          >
            <BsThreeDots size={18} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Role actions"
          className="-mt-1 flex flex-col gap-1 rounded-lg border border-[#F1F5F9] bg-white shadow-md"
        >
          <DropdownItem
            key="view"
            className="rounded-md p-0 text-sm text-[#334155]"
            textValue="View role"
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-[#F1F5F9]"
              onClick={() =>
                router.push(`/usermanagement/edit-role?roleId=${roleId}`)
              }
            >
              <BsEye /> View Role
            </button>
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="rounded-md p-0 text-sm text-red-600"
            textValue="Delete role"
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-red-600 hover:bg-red-50"
              onClick={() =>
                setRoleToDelete({
                  id: roleId,
                  name: role?.role_name || role?.roleName || "this role",
                })
              }
            >
              <BsTrash /> Delete Role
            </button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  };

  return (
    <div className="w-full p-5">
      <div className="w-full">
        <div className="flex w-full justify-between text-primary-dark">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="my-3 flex cursor-pointer items-center gap-2 text-sm"
              onClick={() => router.back()}
            >
              <IoIosArrowBack size={12} />
            </button>
            <h3 className="text-xl font-semibold">All Roles</h3>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Link href="/usermanagement/new-role">
              <Button
                type="button"
                className="button flex items-center gap-2 rounded-xl border border-gray-200 bg-primary-green px-4 py-3 text-sm text-white shadow-sm hover:opacity-95"
              >
                <IoIosAddCircleOutline /> Add new role
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-10 w-full">
        <Table
          columns={[
            { name: "ID", uid: "id" },
            { name: "Name", uid: "roleName" },
            { name: "Description", uid: "description" },
            { name: "Actions", uid: "actions" },
          ]}
          data={roles ? roles?.content?.map((role: any) => ({ ...role })) : []}
          hasSearch={false}
          isLoading={isLoading}
          title="Roles & Permissions"
          page={1}
          actionsComponent={ActionsComponent}
        />
      </div>

      <Modal
        isOpen={Boolean(roleToDelete)}
        setIsOpen={(open) => {
          if (!open) setRoleToDelete(null);
        }}
        title={`Delete "${roleToDelete?.name ?? "role"}"?`}
      >
        {roleToDelete && (
          <DeleteRole
            roleId={roleToDelete.id}
            roleName={roleToDelete.name}
            setShow={(open) => {
              if (!open) setRoleToDelete(null);
            }}
            invalidateKeys={[["mesh roles"]]}
          />
        )}
      </Modal>
    </div>
  );
}

export default ViewRoles;
