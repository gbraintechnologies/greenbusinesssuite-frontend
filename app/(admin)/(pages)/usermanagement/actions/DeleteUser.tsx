"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import services from "@/services";
import { getUserId } from "@/services/localService";

type Props = {
  userId: string | number;
  userName?: string;
  setShow: (open: boolean) => void;
  /** React Query keys to refresh after a successful delete */
  invalidateKeys?: unknown[][];
  onDeleted?: () => void;
};

function DeleteUser({
  userId,
  userName,
  setShow,
  invalidateKeys = [["all users"]],
  onDeleted,
}: Props) {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  const runDelete = async () => {
    const currentUserId = getUserId();
    if (
      currentUserId != null &&
      String(currentUserId) === String(userId)
    ) {
      toast.error("You cannot delete your own account");
      setShow(false);
      return;
    }

    setDeleting(true);
    toast.info("Deleting user...");

    try {
      await services.deleteUser(userId);
      toast.dismiss();
      toast.success(
        userName ? `${userName} deleted successfully` : "User deleted successfully"
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
          "Failed to delete user"
      );
      console.error("Error deleting user", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <p className="mt-5 px-5 text-[#334155]">
        Deleting{" "}
        <span className="font-semibold">
          {userName || "this user"}
        </span>{" "}
        will permanently remove their account from Mesh Suite. This action
        cannot be undone.
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
          {deleting ? "Deleting..." : "Yes, delete user"}
        </button>
      </div>
    </div>
  );
}

export default DeleteUser;
