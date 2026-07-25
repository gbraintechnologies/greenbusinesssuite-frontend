"use client";

import AddFormIcon from "@/public/icons/AddFormIcon";
import React, { useEffect, useState } from "react";

//
import { useQueryClient } from "@tanstack/react-query";

// icons
import EmptyList from "./components/EmptyList";
import ImportFormIcon from "@/public/icons/ImportFormIcon";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import { toast } from "sonner";

// types
import { TimelineType, TimelineValues } from "@/types";

//
import FormCard from "./components/FormCard";
import useForm from "@/hooks/useForm";
import Modal from "@/components/Modal/Modal";
import UsingTemplate from "./components/UsingTemplate";
import Pagination from "@/components/Pagination/Pagination";
import FormGridLoader from "./components/FormGridLoader";
import DatePicker from "@/components/DatePicker/DatePicker";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";

function Forms() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { selectForm } = useForm();

  const [loading, setLoading] = useState(false);

  const [showTemplateModal, setShowTemplateModal] = useState(false);

  //timeline
  const [selectedTimeline, setSelectedTimeline] = useState<
    { label: TimelineValues; value: TimelineType } | undefined
  >();

  // ACTIONS
  const actions = [
    {
      icon: <AddFormIcon />,
      title: "Start a new form",
      desc: "Create a new form from scratch",
      func: () => {
        // create form then push to builder with id of form
        setLoading(true);
        toast.info("Creating form...");
        services
          .createNewForm({
            name: "Untitled",
            url: "",
            description: "",
            formInstruction: "",
            formSections: [],
            userMandatory: false,
            publishStatus: "DRAFT",
            isDeleted: false,
            createdOn: new Date(),
            updatedOn: new Date(),
          })
          .then((res) => {
            setLoading(false);
            toast.dismiss();
            queryClient.invalidateQueries({
              queryKey: ["all forms"],
            });
            //
            router.push(`/forms/builder/${res.data}`);
          })
          .catch((e: Error) => {
            toast.dismiss();
            toast.error("Error occured");
          });
      },
    },
    {
      icon: <ImportFormIcon />,
      title: "Use existing template",
      desc: "Create a form using a template",

      func: () => {
        setShowTemplateModal(true);
      },
    },
  ];

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  // fetch all forms
  const { data: forms, isLoading } = useQuery({
    queryKey: ["all forms", page, limit, selectedTimeline?.value],
    queryFn: services.allForms(page, limit, selectedTimeline?.value),
  });

  // unselecting any previous form
  useEffect(() => {
    selectForm({});
  }, []);

  return (
    <div className="px-3 pb-10 sm:px-5">
      <h3 className="mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl">Forms</h3>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
        {actions.map((action, idx) => {
          return (
            <button
              disabled={loading}
              onClick={action.func}
              className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-left shadow-sm transition-colors hover:border-brand-200 hover:bg-brand-50/40 disabled:cursor-not-allowed disabled:opacity-90 sm:gap-3 sm:rounded-lg sm:p-3 sm:py-3.5"
              key={idx}
            >
              <span className="shrink-0 scale-90 sm:scale-100">
                {action.icon}
              </span>
              <div className="min-w-0">
                <h4 className="truncate text-xs font-semibold text-slate-900 sm:text-base">
                  {action.title}
                </h4>
                <p className="mt-0.5 line-clamp-2 text-[10px] font-light leading-snug text-slate-500 sm:text-sm">
                  {action.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* recent forms  */}
      <div className="mb-4 mt-6 flex flex-col gap-3 sm:mb-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold sm:text-lg">Recent Forms</h3>
        <div className="flex flex-wrap items-center gap-2">
          <ItemsPerPageSelector limit={limit} setLimit={setLimit} />
          <DatePicker
            selectedTimeline={selectedTimeline}
            setSelectedTimeline={setSelectedTimeline}
          />
          <Pagination
            limit={limit}
            variant="no-text"
            page={page}
            currentData={forms?.content}
            setPage={setPage}
          />
        </div>
      </div>

      {isLoading ? (
        <FormGridLoader />
      ) : (
        // ALL FORMS
        <>
          {forms?.totalElements === 0 ? (
            <div className="">
              <EmptyList
                text={`No forms have been created ${selectedTimeline?.label}`}
              />
            </div>
          ) : (
            <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {forms &&
                forms?.content
                  ?.filter((form: any) => form.isTemplate !== true)
                  ?.map((form: any) => {
                    return (
                      <React.Fragment key={form?.id}>
                        <FormCard key={form.id} form={form} />
                      </React.Fragment>
                    );
                  })}
            </div>
          )}
        </>
      )}

      {/*  */}
      <Modal
        size="big"
        isOpen={showTemplateModal}
        setIsOpen={setShowTemplateModal}
        title="Select an existing template to build from"
      >
        <UsingTemplate setShowTemplateModal={setShowTemplateModal} />
      </Modal>
    </div>
  );
}

export default Forms;
