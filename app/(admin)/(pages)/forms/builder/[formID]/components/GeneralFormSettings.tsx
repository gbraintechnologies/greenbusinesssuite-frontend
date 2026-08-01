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
    <div className="min-h-[100vh] bg-surface-muted p-3">
      <div className="flex items-center justify-center gap-3 rounded-lg bg-brand-50 p-1 text-sm ring-1 ring-brand-100">
        <button
          onClick={() => setActiveTab("general")}
          className={`${
            activeTab === "general" && "bg-white text-brand-700 shadow-sm"
          }  text-center font-medium p-1 flex-1 rounded-lg text-slate-500`}
        >
          Form Settings
        </button>
        <button
          onClick={() => setActiveTab("field")}
          className={`${
            activeTab === "field" && "bg-white text-brand-700 shadow-sm"
          }  text-center font-medium p-1 flex-1 rounded-lg text-slate-500`}
        >
          Field Options
        </button>
      </div>

      {activeTab == "general" && (
        <>
          {" "}
          <div className="mt-5 px-3">
            <h4 className="font-semibold text-slate-700">Form Layout</h4>
            <p className="text-xs font-light text-slate-500">
              Display of the form to the clients
            </p>
          </div>
          <div className="flex text-sm mt-5 items-center justify-between gap-4">
            <button
              onClick={() => setFormLayout("GENERAL")}
              className={`${
                formLayout?.toLowerCase() === "general"
                  ? "border-2 border-brand-600 bg-brand-50 font-semibold text-brand-700"
                  : " "
              } flex flex-col h-[10rem] items-center justify-between gap-1 rounded-xl border border-slate-200 bg-white p-4 w-1/2`}
            >
              <FormPreviewIcon />
              <FormPreviewIcon />
              <p className="">Classical layout</p>
            </button>

            <button
              onClick={() => setFormLayout("CARD")}
              className={`${
                formLayout?.toLowerCase() === "card"
                  ? "border-2 border-brand-600 bg-brand-50 font-semibold text-brand-700"
                  : " "
              } flex flex-col h-[10rem] items-center justify-center relative gap-1 rounded-xl border border-slate-200 bg-white p-4 w-1/2`}
            >
              <FormPreviewIcon />

              <p className="absolute bottom-4">Card layout</p>
            </button>
          </div>
          {/* FORM DEADLINE */}
          <div className="mt-5 px-3">
            <h4 className="font-semibold text-slate-700">Deadline</h4>
            <p className="text-xs font-light text-slate-500">
              Specify a date after which form would be inaccessible to new
              clients
            </p>
            <input
              value={form?.deadline ? form.deadline.split("T")[0] : ""}
              onChange={(e) => updateDeadline(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-600"
              type="date"
            />
          </div>
          {/* use as template */}
          <div className="mt-10 flex items-center justify-between gap-3 rounded-lg border border-brand-100 bg-white px-5 py-3">
            <div>
              <p className="font-medium text-base">Use form as template</p>{" "}
              <p className="text-xs font-light text-slate-500">
                The form will be used by the assigned company, and a similar
                template will be created for reuse with other forms.
              </p>
            </div>
            <Switch
              checked={Boolean(form?.isTemplate)}
              onChange={() => {
                //  set form as template
                updateIsTemplate(!Boolean(form?.isTemplate));
              }}
              className={`${
                Boolean(form?.isTemplate) ? "bg-brand-600" : "bg-slate-400"
              }
          relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
            >
              <span
                aria-hidden="true"
                className={`${
                  Boolean(form?.isTemplate) ? "translate-x-6" : "translate-x-0"
                }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
          {/*  */}
          {/* Form Access */}
          <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-brand-100 bg-white px-5 py-3">
            <div>
              <p className="font-medium text-base">Form Public / Open</p>{" "}
              <p className="text-xs font-light text-slate-500">
                A public form is accessible to anyone with the link, whereas a
                private form is restricted to the company's clients only.
              </p>
            </div>
            <Switch
              checked={Boolean(form?.isAnonymous)}
              onChange={() => {
                //  set form as template
                updateIsAnonymous(!Boolean(form?.isAnonymous));
              }}
              className={`${
                Boolean(form?.isAnonymous) ? "bg-brand-600" : "bg-slate-400"
              }
          relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
            >
              <span
                aria-hidden="true"
                className={`${
                  Boolean(form?.isAnonymous) ? "translate-x-6" : "translate-x-0"
                }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
          {/* multiple responses: for private forms */}
          <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-brand-100 bg-white px-5 py-3">
            <div>
              <p className="font-medium text-base">Allow Multiple Responses</p>{" "}
              <p className="text-xs font-light text-slate-500">
                Allow a single client to submit multple responses to the form
              </p>
            </div>
            <Switch
              checked={Boolean(form?.multipleForms)}
              onChange={() => {
                //  set form as template
                updateAllowMultipleResponses(!Boolean(form?.multipleForms));
              }}
              className={`${
                Boolean(form?.multipleForms) ? "bg-brand-600" : "bg-slate-400"
              }
          relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
            >
              <span
                aria-hidden="true"
                className={`${
                  Boolean(form?.multipleForms) ? "translate-x-6" : "translate-x-0"
                }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
          {/* Redirect URL */}
          {form.isAnonymous && (
            <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-brand-100 bg-white px-5 py-3">
              <div>
                <p className="font-medium text-base">Redirect URL</p>{" "}
                <p className="text-xs font-light text-slate-500">
                  The website / URL the user should be redirected to after
                  successfully filling a form
                </p>
                <input
                  value={redirectUrl ?? ""}
                  className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2"
                  placeholder="Redirect URL"
                  onChange={(e) => setRedirectUrl(e.target.value)}
                />
                <button
                  onClick={() => {
                    toast.info("Please wait...");
                    updateRedirectUrl(redirectUrl);
                  }}
                  className="mt-3 w-full rounded-xl bg-brand-600 px-4 py-2 text-sm text-white"
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
            <div className="flex min-h-[30vh] items-center justify-center text-center text-slate-500">
              <div className="flex flex-col gap-2 items-center justify-center">
                <HiOutlineDocument size={40} />
                <p className="text-sm text-slate-400">
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
