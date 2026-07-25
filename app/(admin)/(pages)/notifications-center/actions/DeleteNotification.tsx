"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import services from "@/services";

type Props = {
  notificationId: string | number;
  subject?: string;
  setShow: (open: boolean) => void;
  invalidateKeys?: unknown[][];
  onDeleted?: () => void;
};

function DeleteNotification({
  notificationId,
  subject,
  setShow,
  invalidateKeys = [
    ["all messages"],
    ["all recurring messages"],
    ["all recurring messages by type"],
  ],
  onDeleted,
}: Props) {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  const runDelete = async () => {
    setDeleting(true);
    toast.info("Deleting notification...");

    try {
      await services.deleteNotification(notificationId);
      toast.dismiss();
      toast.success("Notification deleted successfully");

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
          "Failed to delete notification"
      );
      console.error("Error deleting notification", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <p className="mt-5 px-5 text-[#334155]">
        Deleting{" "}
        <span className="font-semibold">
          {subject ? `"${subject}"` : "this notification"}
        </span>{" "}
        will permanently remove it from message history. This action cannot be
        undone.
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
          {deleting ? "Deleting..." : "Yes, delete"}
        </button>
      </div>
    </div>
  );
}

export default DeleteNotification;
