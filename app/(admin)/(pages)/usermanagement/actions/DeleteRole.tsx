"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import services from "@/services";

type Props = {
  roleId: string | number;
  roleName?: string;
  setShow: (open: boolean) => void;
  invalidateKeys?: unknown[][];
  onDeleted?: () => void;
};

function DeleteRole({
  roleId,
  roleName,
  setShow,
  invalidateKeys = [["mesh roles"]],
  onDeleted,
}: Props) {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  const runDelete = async () => {
    setDeleting(true);
    toast.info("Deleting role...");

    try {
      await services.deleteRole(roleId);
      toast.dismiss();
      toast.success(
        roleName ? `${roleName} deleted successfully` : "Role deleted successfully"
      );

      await Promise.all(
        invalidateKeys.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey })
        )
      );

      onDeleted?.();
      setShow(false);
    } catch (error: any) {
      toast.dismiss();
      toast.error(
        error?.response?.data?.message ??
          error?.response?.data ??
          "Failed to delete role"
      );
      console.error("Error deleting role", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <p className="mt-5 px-5 text-[#334155]">
        Deleting{" "}
        <span className="font-semibold">{roleName || "this role"}</span> will
        permanently remove it and its permissions. Users assigned to this role
        may lose access. This action cannot be undone.
      </p>

      <div className="mt-5 flex justify-between border-t border-t-gray-200 bg-[#F1F5F9] p-5">
        <button
          type="button"
          disabled={deleting}
          onClick={() => setShow(false)}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-8 py-2 text-sm text-primary-dark shadow-md hover:opacity-95 disabled:opacity-70"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={runDelete}
          className="flex items-center gap-2 rounded-xl bg-primary-red px-4 py-3 text-sm text-white shadow-md hover:opacity-95 disabled:opacity-70"
        >
          {deleting ? "Deleting..." : "Yes, delete role"}
        </button>
      </div>
    </div>
  );
}

export default DeleteRole;
