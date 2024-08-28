"use client";

import useForm from "@/hooks/useForm";
import React, { useEffect, useState } from "react";

import { Tabs, Tab, useTabs } from "@nextui-org/tabs";

import { Switch } from "@headlessui/react";

// icons
import { HiOutlineDocument } from "react-icons/hi";

// components
import FormPreviewIcon from "@/public/icons/FormPreviewIcon";
import FieldOptions from "./FieldOptions";

function GeneralFormSettings({ refetch }: any) {
  const [activeTab, setActiveTab] = useState("general");
  const {
    formLayout,
    setFormLayout,
    activeField,
    setActiveField,
    form,
    updateIsTemplate,
  } = useForm();

  useEffect(() => {
    setActiveField(null);
  }, []);

  // if (activeField) {
  //   return <FieldOptions refetch={refetch} />;
  // }
  return (
    <div className="bg-white min-h-[80vh]  border-l-2 border-gray-200 p-3">
      <div className="bg-gray-100 p-1 text-sm rounded-lg flex gap-3 items-center justify-center">
        <button
          onClick={() => setActiveTab("general")}
          className={`${
            activeTab === "general" && "bg-white"
          }  text-center font-medium p-1 flex-1 rounded-lg`}
        >
          Form Settings
        </button>
        <button
          onClick={() => setActiveTab("field")}
          className={`${
            activeTab === "field" && "bg-white"
          }  text-center font-medium p-1 flex-1 rounded-lg`}
        >
          Field Options
        </button>
      </div>

      {activeTab == "general" && (
        <>
          {" "}
          <div className="mt-5 px-3">
            <h4 className="font-semibold text-gray-700">Form Layout</h4>
            <p className="text-xs font-light text-gray-500">
              Display of the form to the clients
            </p>
          </div>
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
              } flex flex-col h-[10rem] items-center justify-center relative gap-1 p-4 bg-[#F1F5F9] rounded-xl w-1/2`}
            >
              <FormPreviewIcon />

              <p className="absolute bottom-4">Card layout</p>
            </button>
          </div>
          {/* use as template */}
          <div className="bg-[#F8FAFC] py-3 mt-10 px-5  rounded-lg flex gap-3 items-center justify-between">
            <div>
              <p className="font-medium text-base">Use form as template</p>{" "}
              <p className="text-xs font-light text-gray-500">
                The form will be used by the assigned company, and a similar
                template will be created for reuse with other forms.
              </p>
            </div>
            <Switch
              checked={form?.isTemplate}
              onChange={() => {
                //  set form as template
                updateIsTemplate(!form?.isTemplate);
              }}
              className={`${
                form?.isTemplate ? "bg-primary-green" : "bg-gray-500"
              }
          relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
            >
              <span
                aria-hidden="true"
                className={`${
                  form?.isTemplate ? "translate-x-6" : "translate-x-0"
                }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
        </>
      )}

      {activeTab == "field" && (
        <>
          {activeField ? (
            <FieldOptions refetch={refetch} />
          ) : (
            <div className="min-h-[30vh] flex text-center items-center justify-center text-gray-500">
              <div className="flex flex-col gap-2 items-center justify-center">
                <HiOutlineDocument size={40} />
                <p className="text-sm text-gray-400">
                  [ No form field selected ]
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default GeneralFormSettings;
