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
        toast.loading("Creating form...");
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

  // console.log("forms", forms);

  return (
    <div className="px-5 pb-10">
      <h3 className="font-semibold mb-8 text-xl">Forms</h3>

      <div className="grid grid-cols-3 gap-2">
        {actions.map((action, idx) => {
          return (
            <button
              disabled={loading}
              onClick={action.func}
              className="flex gap-1 disabled:cursor-not-allowed disabled:opacity-90 items-center rounded-lg p-2 py-3 border-[#E2E8F0] border bg-[#F8FAFC]"
              key={idx}
            >
              {action.icon}
              <div className="text-left">
                <h4 className="font-medium text-base">{action.title}</h4>
                <p className="font-light text-sm">{action.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* recent forms  */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold mb-8 mt-10 text-lg">Recent Forms</h3>
        <div className="flex gap-2 items-center">
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
            <div className="grid grid-cols-4 gap-5">
              {forms &&
                forms?.content
                  ?.filter((form: any) => form.isTemplate !== true)
                  ?.map((form: any) => {
                    return <React.Fragment key={form?.id}>
                      <FormCard key={form.id} form={form} />
                      </React.Fragment>
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
