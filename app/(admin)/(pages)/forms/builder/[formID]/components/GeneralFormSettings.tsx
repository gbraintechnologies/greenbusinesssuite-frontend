"use client";

import useForm from "@/hooks/useForm";
import React, { useEffect, useState } from "react";

import { Switch } from "@headlessui/react";

// icons
import { HiOutlineDocument } from "react-icons/hi";

// components
import FormPreviewIcon from "@/public/icons/FormPreviewIcon";
import FieldOptions from "./FieldOptions";
import { toast } from "sonner";

function GeneralFormSettings({ refetch, activeTab, setActiveTab }: any) {
  const {
    formLayout,
    setFormLayout,
    activeField,
    setActiveField,
    form,
    updateRedirectUrl,
    updateIsTemplate,
    updateDeadline,
    updateIsAnonymous,
    updateAllowMultipleResponses,
  } = useForm();

  useEffect(() => {
    setActiveField(null);
  }, []);

  // if (activeField) {
  //   return <FieldOptions refetch={refetch} />;
  // }

  const [redirectUrl, setRedirectUrl] = useState(form?.redirectUrl ?? "");

  useEffect(() => {
    setRedirectUrl(form?.redirectUrl ?? "");
  }, [form?.redirectUrl]);

  return (
    <div className="bg-white min-h-[100vh]   p-3">
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
              onClick={() => setFormLayout("GENERAL")}
              className={`${
                formLayout?.toLowerCase() === "general"
                  ? "border-2 border-primary-green bg-primary-green bg-opacity-10 font-semibold "
                  : " "
              } flex flex-col h-[10rem] items-center justify-between gap-1 p-4 bg-[#F1F5F9] rounded-xl w-1/2`}
            >
              <FormPreviewIcon />
              <FormPreviewIcon />
              <p className="">Classical layout</p>
            </button>

            <button
              onClick={() => setFormLayout("CARD")}
              className={`${
                formLayout?.toLowerCase() === "card"
                  ? "border-2 border-primary-green bg-primary-green bg-opacity-10 font-semibold"
                  : " "
              } flex flex-col h-[10rem] items-center justify-center relative gap-1 p-4 bg-[#F1F5F9] rounded-xl w-1/2`}
            >
              <FormPreviewIcon />

              <p className="absolute bottom-4">Card layout</p>
            </button>
          </div>
          {/* FORM DEADLINE */}
          <div className="mt-5 px-3">
            <h4 className="font-semibold text-gray-700">Deadline</h4>
            <p className="text-xs font-light text-gray-500">
              Specify a date after which form would be inaccessible to new
              clients
            </p>
            <input
              value={form?.deadline ? form.deadline.split("T")[0] : ""}
              onChange={(e) => updateDeadline(e.target.value)}
              className="block mt-2 w-full border-gray-400 text-gray-500 border px-3 py-2 rounded-lg"
              type="date"
            />
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
          {/*  */}
          {/* Form Access */}
          <div className="bg-[#F8FAFC] py-3 mt-5 px-5  rounded-lg flex gap-3 items-center justify-between">
            <div>
              <p className="font-medium text-base">Form Public / Open</p>{" "}
              <p className="text-xs font-light text-gray-500">
                A public form is accessible to anyone with the link, whereas a
                private form is restricted to the company's clients only.
              </p>
            </div>
            <Switch
              checked={form?.isAnonymous}
              onChange={() => {
                //  set form as template
                updateIsAnonymous(!form?.isAnonymous);
              }}
              className={`${
                form?.isAnonymous ? "bg-primary-green" : "bg-gray-500"
              }
          relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
            >
              <span
                aria-hidden="true"
                className={`${
                  form?.isAnonymous ? "translate-x-6" : "translate-x-0"
                }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
          {/* multiple responses: for private forms */}
          <div className="bg-[#F8FAFC] py-3 mt-5 px-5  rounded-lg flex gap-3 items-center justify-between">
            <div>
              <p className="font-medium text-base">Allow Multiple Responses</p>{" "}
              <p className="text-xs font-light text-gray-500">
                Allow a single client to submit multple responses to the form
              </p>
            </div>
            <Switch
              checked={form?.multipleForms}
              onChange={() => {
                //  set form as template
                updateAllowMultipleResponses(!form?.multipleForms);
              }}
              className={`${
                form?.multipleForms ? "bg-primary-green" : "bg-gray-500"
              }
          relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
            >
              <span
                aria-hidden="true"
                className={`${
                  form?.multipleForms ? "translate-x-6" : "translate-x-0"
                }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
          {/* Redirect URL */}
          {form.isAnonymous && (
            <div className="bg-[#F8FAFC] py-3 mt-5 px-5  rounded-lg flex gap-3 items-center justify-between">
              <div>
                <p className="font-medium text-base">Redirect URL</p>{" "}
                <p className="text-xs font-light text-gray-500">
                  The website / URL the user should be redirected to after
                  successfully filling a form
                </p>
                <input
                  value={redirectUrl ?? ""}
                  className="w-full mt-4 rounded-xl"
                  placeholder="Redirect URL"
                  onChange={(e) => setRedirectUrl(e.target.value)}
                />
                <button
                  onClick={() => {
                    toast.info("Please wait...");
                    updateRedirectUrl(redirectUrl);
                  }}
                  className="mt-3 bg-black text-white px-4 py-2 text-sm  w-full rounded-xl"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
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
