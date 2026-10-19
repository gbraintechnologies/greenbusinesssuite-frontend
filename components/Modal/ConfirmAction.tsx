"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import Modal from "./Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  pendingLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  tone?: "danger" | "primary";
  onConfirm: () => Promise<unknown>;
};

/** Confirmation modal that runs an async action and reports the result. */
export default function ConfirmAction({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = "Yes, delete",
  pendingLabel = "Deleting...",
  successMessage = "Done",
  errorMessage = "Something went wrong",
  tone = "danger",
  onConfirm,
}: Props) {
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    try {
      await onConfirm();
      toast.success(successMessage);
      onClose();
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ??
        error?.response?.data?.message ??
        (typeof error?.response?.data === "string" ? error.response.data : null);
      toast.error(detail || errorMessage);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={(open: boolean) => {
        if (!open && !running) onClose();
      }}
      title={title}
    >
      <p className="mt-5 px-5 text-[#334155]">{message}</p>
      <div className="mt-5 flex justify-between border-t border-t-gray-200 bg-[#F1F5F9] p-5">
        <button
          type="button"
          disabled={running}
          onClick={onClose}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-8 py-2 text-sm text-primary-dark shadow-md hover:opacity-95 disabled:opacity-70"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={running}
          onClick={run}
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-white shadow-md hover:opacity-95 disabled:opacity-70 ${
            tone === "danger" ? "bg-primary-red" : "bg-brand-600"
          }`}
        >
          {running ? pendingLabel : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
