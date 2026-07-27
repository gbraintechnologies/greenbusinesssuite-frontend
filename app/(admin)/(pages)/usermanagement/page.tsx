"use client";

import React, { useEffect, useState } from "react";

// services
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// icons
import { BsEye, BsThreeDots, BsTrash } from "react-icons/bs";

// shared components
import Status from "@/components/Status/Status";
import Table from "@/components/Table/Table";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import Modal from "@/components/Modal/Modal";
import Nav from "./components/Nav";
import DeleteUser from "./actions/DeleteUser";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/react";

function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["all users", page, limit],
    queryFn: services.allUsers(page * limit, limit),
  });

  const { data: searchData } = useQuery({
    queryKey: ["all users", searchTerm],
    queryFn: services.searchUsers(searchTerm),
    enabled: Boolean(searchTerm),
  });

  const [aggregatedUsers, setAggregatedUsers] = useState([]);

  useEffect(() => {
    if (searchTerm.length > 1 && searchData) {
      setAggregatedUsers(searchData);
    }

    if (data && searchTerm.length < 1) {
      setAggregatedUsers(data);
    }
  }, [searchData, data, searchTerm]);

  const StatusComponent = (item: any) => {
    return <Status status={item?.status} />;
  };

  const ActionsComponent = (item: any) => {
    const userId = item?.__originalId ?? item?.id;
    const displayName =
      item?.name ||
      `${item?.firstName ?? item?.first_name ?? ""} ${
        item?.lastName ?? item?.last_name ?? ""
      }`.trim();

    return (
      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="min-w-8 text-slate-600"
            aria-label="User actions"
          >
            <BsThreeDots size={18} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="User actions"
          className="-mt-1 flex flex-col gap-1 rounded-lg border border-[#F1F5F9] bg-white shadow-md"
        >
          <DropdownItem
            key="view"
            className="rounded-md p-0 text-sm text-[#334155]"
            textValue="View user"
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-[#F1F5F9]"
              onClick={() =>
                router.push(`/usermanagement/profile?id=${userId}`)
              }
            >
              <BsEye /> View User
            </button>
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="rounded-md p-0 text-sm text-red-600"
            textValue="Delete user"
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-red-600 hover:bg-red-50"
              onClick={() =>
                setUserToDelete({
                  id: userId,
                  name: displayName || item?.email || "this user",
                })
              }
            >
              <BsTrash /> Delete User
            </button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  };

  const tableData = (aggregatedUsers?.length ? aggregatedUsers : data) ?? [];

  return (
    <div className="w-full pb-20">
      <Nav />

      <Table
        columns={[
          { name: "ID", uid: "id" },
          { name: "Name", uid: "name" },
          { name: "Email", uid: "email" },
          { name: "Phone", uid: "phone" },
          { name: "STATUS", uid: "status" },
          { name: "ACTIONS", uid: "actions" },
        ]}
        data={
          Array.isArray(tableData)
            ? tableData.map((user: any) => ({
                ...user,
                name: `${user?.firstName ?? user?.first_name ?? ""} ${
                  user?.lastName ?? user?.last_name ?? ""
                }`.trim(),
              }))
            : []
        }
        hasSearch={false}
        isLoading={isLoading}
        title="Users"
        page={1}
        statusComponent={StatusComponent}
        actionsComponent={ActionsComponent}
      />

      <div className="flex w-full justify-between">
        <ItemsPerPageSelector limit={limit} setLimit={setLimit} />
        <Pagination
          currentData={data}
          limit={limit}
          page={page}
          setPage={setPage}
        />
      </div>

      <Modal
        isOpen={Boolean(userToDelete)}
        setIsOpen={(open: boolean) => {
          if (!open) setUserToDelete(null);
        }}
        title={`Delete "${userToDelete?.name ?? "user"}"?`}
      >
        {userToDelete && (
          <DeleteUser
            userId={userToDelete.id}
            userName={userToDelete.name}
            setShow={(open) => {
              if (!open) setUserToDelete(null);
            }}
            invalidateKeys={[["all users", page, limit], ["all users"]]}
          />
        )}
      </Modal>
    </div>
  );
}

export default UserManagement;
