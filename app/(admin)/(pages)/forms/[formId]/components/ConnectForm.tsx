"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import services from "@/services";
import useForm from "@/hooks/useForm";
import Modal from "@/components/Modal/Modal";

function ConnectForm({ style = "shadow" }: { style?: string }) {
  const { form } = useForm();
  const formId = form?.id;

  const [apiKey, setApiKey] = useState<string>(
    form?.apiKey || form?.api_key || ""
  );
  const [generating, setGenerating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const generateKey = async () => {
    if (!formId) {
      toast.error("Form ID is missing");
      return;
    }

    setGenerating(true);
    toast.info("Generating new API key...");

    try {
      const res = await services.regenerateAPIKey(formId);
      const newKey =
        res?.data?.apiKey ??
        res?.data?.api_key ??
        res?.data?.key ??
        res?.data?.data?.apiKey ??
        res?.data?.data?.api_key ??
        (typeof res?.data === "string" ? res.data : "");

      if (!newKey) {
        throw new Error("No API key returned from server");
      }

      setApiKey(newKey);
      toast.dismiss();
      toast.success("New API key generated");
      setShowConfirm(false);
    } catch (error: any) {
      toast.dismiss();
      toast.error(
        error?.response?.data?.message ??
          error?.response?.data ??
          error?.message ??
          "Failed to generate API key"
      );
      console.error("Error regenerating API key", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <div className={`${style === "raw" ? "" : "boxshadow "} w-[40rem]`}>
        <div className="p-5">
          <h5 className="mb-5 text-lg font-semibold">Connect form via API</h5>

          <input
            disabled
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-[#16A34A]"
            value={apiKey || "No API key generated yet"}
            type="text"
          />
        </div>

        <p className="mx-5 my-3 text-sm font-light text-[#475569]">
          Use this key to submit responses to this form via the API. Generating
          a new key invalidates the previous one.
        </p>

        <div
          className={`${
            style === "raw"
              ? ""
              : "border-t-[1px] border-t-gray-200 bg-[#F1F5F9] "
          } mt-5 flex justify-between p-5`}
        >
          <button
            type="button"
            disabled={generating || !formId}
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-8 py-2 text-sm text-primary-dark shadow-md hover:opacity-95 disabled:opacity-70"
          >
            {generating ? "Generating..." : "Generate new key"}
          </button>
          <button
            type="button"
            disabled={!apiKey}
            className="flex items-center gap-2 rounded-xl bg-primary-green px-4 py-3 text-sm text-white shadow-md hover:opacity-95 disabled:opacity-70"
            onClick={() => {
              navigator.clipboard.writeText(apiKey).then(() => {
                toast.success("API Key copied!");
              });
            }}
          >
            Copy API Key
          </button>
        </div>
      </div>

      <Modal
        isOpen={showConfirm}
        setIsOpen={setShowConfirm}
        title="Generate a new API key?"
      >
        <div>
          <p className="mt-5 px-5 text-[#334155]">
            Generating a new key will invalidate the current one. Any
            integrations using the old key will stop working until they are
            updated.
          </p>
          <div className="mt-5 flex justify-between border-t border-t-gray-200 bg-[#F1F5F9] p-5">
            <button
              type="button"
              disabled={generating}
              onClick={() => setShowConfirm(false)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-8 py-2 text-sm text-primary-dark shadow-md hover:opacity-95 disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={generating}
              onClick={generateKey}
              className="flex items-center gap-2 rounded-xl bg-primary-green px-4 py-3 text-sm text-white shadow-md hover:opacity-95 disabled:opacity-70"
            >
              {generating ? "Generating..." : "Yes, generate key"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ConnectForm;
