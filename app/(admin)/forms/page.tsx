"use client";

import AddFormIcon from "@/public/icons/AddFormIcon";
import React, { useState } from "react";

//
import { useQueryClient } from "@tanstack/react-query";

// icons
import EmptyList from "./components/EmptyList";
import ImportFormIcon from "@/public/icons/ImportFormIcon";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import toast from "react-hot-toast";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import FormCard from "./components/FormCard";

function Forms() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);

  let sampleFormData = {
    id: 0,
    name: "string",
    url: "string",
    description: "string",
    formInstruction: "string",
    formSections: [
      {
        id: 0,
        name: "string",
        description: "string",
        instruction: "string",
        form: {
          id: 0,
          name: "string",
          url: "string",
          description: "string",
          formInstruction: "string",
          formSections: [
            {
              id: 0,
              name: "string",
              description: "string",
              instruction: "string",
              form: "string",
              formFields: [
                {
                  id: 0,
                  name: "string",
                  description: "string",
                  formSection: "string",
                  instruction: "string",
                  ordering: 0,
                  isDeleted: true,
                  fieldDataType: "string",
                  choiceValues: ["string"],
                  isMandatory: true,
                  createdOn: "2024-03-11T15:32:02.915Z",
                  updatedOn: "2024-03-11T15:32:02.915Z",
                  deletedOn: "2024-03-11T15:32:02.915Z",
                },
              ],
              ordering: 0,
              isDeleted: true,
              createdOn: "2024-03-11T15:32:02.915Z",
              updatedOn: "2024-03-11T15:32:02.915Z",
              deletedOn: "2024-03-11T15:32:02.915Z",
            },
          ],
          userMandatory: true,
          deadline: "2024-03-11T15:32:02.915Z",
          publishStatus: "DRAFT",
          isDeleted: true,
          createdOn: "2024-03-11T15:32:02.915Z",
          updatedOn: "2024-03-11T15:32:02.915Z",
          deletedOn: "2024-03-11T15:32:02.915Z",
        },
        formFields: [
          {
            id: 0,
            name: "string",
            description: "string",
            formSection: {
              id: 0,
              name: "string",
              description: "string",
              instruction: "string",
              form: "string",
              formFields: [
                {
                  id: 0,
                  name: "string",
                  description: "string",
                  formSection: "string",
                  instruction: "string",
                  ordering: 0,
                  isDeleted: true,
                  fieldDataType: "string",
                  choiceValues: ["string"],
                  isMandatory: true,
                  createdOn: "2024-03-11T15:32:02.915Z",
                  updatedOn: "2024-03-11T15:32:02.915Z",
                  deletedOn: "2024-03-11T15:32:02.915Z",
                },
              ],
              ordering: 0,
              isDeleted: true,
              createdOn: "2024-03-11T15:32:02.915Z",
              updatedOn: "2024-03-11T15:32:02.915Z",
              deletedOn: "2024-03-11T15:32:02.915Z",
            },
            instruction: "string",
            ordering: 0,
            isDeleted: true,
            fieldDataType: "string",
            choiceValues: ["string"],
            isMandatory: true,
            createdOn: "2024-03-11T15:32:02.915Z",
            updatedOn: "2024-03-11T15:32:02.915Z",
            deletedOn: "2024-03-11T15:32:02.915Z",
          },
        ],
        ordering: 0,
        isDeleted: true,
        createdOn: "2024-03-11T15:32:02.915Z",
        updatedOn: "2024-03-11T15:32:02.915Z",
        deletedOn: "2024-03-11T15:32:02.915Z",
      },
    ],
    userMandatory: true,
    deadline: "2024-03-11T15:32:02.915Z",
    publishStatus: "DRAFT",
    isDeleted: true,
    createdOn: "2024-03-11T15:32:02.915Z",
    updatedOn: "2024-03-11T15:32:02.915Z",
    deletedOn: "2024-03-11T15:32:02.915Z",
  };
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
            url: "string",
            description: "untitled",
            formInstruction: "untitled",
            formSections: [],
            userMandatory: false,
            deadline: "2024-03-11T15:32:02.915Z",
            publishStatus: "DRAFT",
            isDeleted: false,
            createdOn: "2024-03-11T15:32:02.915Z",
            updatedOn: "2024-03-11T15:32:02.915Z",
            deletedOn: "2024-03-11T15:32:02.915Z",
          })
          .then((res) => {
            setLoading(false);
            toast.dismiss();
            console.log("created form", res?.data);
            queryClient.invalidateQueries({
              queryKey: ["all forms"],
            });
            //
            // router.push("/forms/builder/${res.data.id}");
          })
          .catch((e: Error) => {
            console.log("error creating form", e);
          });
      },
    },
    {
      icon: <ImportFormIcon />,
      title: "Use existing template",
      desc: "Create a form based of another form",

      func: () => {
        //
      },
    },
  ];

  const recentForms = [];

  // fetch all users
  const { data: forms, isLoading } = useQuery({
    queryKey: ["all forms"],
    queryFn: services.allForms(),
  });

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
      <h3 className="font-semibold mb-8 mt-10 text-lg">Recent Forms</h3>

      {isLoading ? (
        <div className="h-[20rem] flex items-center justify-center">
          <div>
            <LoadingIcon />
            <p className="mt-2 text-xs text-gray-500">Fetching all forms</p>
          </div>
        </div>
      ) : (
        // ALL FORMS
        <>
          {forms?.length === 0 ? (
            <div className="">
              <EmptyList />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-5">
              {forms &&
                forms?.map((form: any) => {
                  return <FormCard key={form.id} form={form} />;
                })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Forms;
