import useForm from "@/hooks/useForm";
import React, { useEffect } from "react";

// components
import FormPreviewIcon from "@/public/icons/FormPreviewIcon";
import FieldOptions from "./FieldOptions";

function GeneralFormSettings({ refetch }: any) {
  const { formLayout, setFormLayout, activeField, setActiveField } = useForm();

  useEffect(() => {
    setActiveField(null);
  }, []);

  if (activeField) {
    return <FieldOptions refetch={refetch} />;
  }
  return (
    <div className="bg-white min-h-[100vh]  border-l-2 border-gray-200 p-3">
      <h4 className="font-semibold text-lg mt-4">General form settings</h4>

      <div className="flex text-sm mt-5 items-center justify-between gap-4">
        <button
          onClick={() => setFormLayout("classic")}
          className={`${
            formLayout === "classic"
              ? "border-2 border-primary-green bg-primary-green bg-opacity-10 font-semibold "
              : " "
          } flex flex-col h-[10rem] items-center justify-between gap-1 p-4 bg-[#F1F5F9] rounded-xl w-1/2`}
        >
          <FormPreviewIcon />
          <FormPreviewIcon />
          <p className="">Classical layout</p>
        </button>

        <button
          onClick={() => setFormLayout("card")}
          className={`${
            formLayout === "card"
              ? "border-2 border-primary-green bg-primary-green bg-opacity-10 font-semibold"
              : " "
          } flex flex-col h-[10rem] items-center justify-between gap-1 p-4 bg-[#F1F5F9] rounded-xl w-1/2`}
        >
          <FormPreviewIcon />

          <p className="">Card layout</p>
        </button>
      </div>
    </div>
  );
}

export default GeneralFormSettings;
