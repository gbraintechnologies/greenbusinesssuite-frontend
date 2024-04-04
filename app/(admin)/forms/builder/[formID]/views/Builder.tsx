import { useRouter } from "next/navigation";

// icons
import { GoArrowLeft } from "react-icons/go";
import { CiCirclePlus } from "react-icons/ci";

// hooks
import useForm from "@/hooks/useForm";

// uids
import { v4 as uuidv4 } from "uuid";

//
import React, { useEffect, useState } from "react";

//
import { FormatDateTime } from "@/utils/FormatDate/FormatDate";
import FormSection from "../components/FormSection";

//
import { useQueryClient } from "@tanstack/react-query";
import services from "@/services";
import toast from "react-hot-toast";

function isObjEmpty(obj: any) {
  return Object.keys(obj).length === 0;
}

function Builder({ data, refetch }: any) {
  // scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    form,
    selectForm,
    addFormSection,
    triggerRemoteUpdate,
    updateNameAndDescription,
  } = useForm();

  // local variables
  const [formName, setFormName] = useState(form?.name);
  const [formDesc, setFormDesc] = useState(
    form?.description ? form?.description : "No description set"
  );

  useEffect(() => {
    if (isObjEmpty(form) && data) {
      selectForm(data);
      setFormDesc(data?.description ? data?.description : "No description set");
      setFormName(data?.name);
    }
  }, [form, data]);

  // USE EFFECT FOR UPDATING FORM REMOTELY
  useEffect(() => {
    if (!isObjEmpty(form)) {
      services
        .updateForm({ ...form, updatedOn: new Date() })
        .then((res) => {
          // REFETCH AND SYNC FROM REMOTE SERVER
          refetch();
          // queryClient.invalidateQueries({
          //   queryKey: ["form", form?.id],
          // });
          toast.dismiss();
          toast.success("Form updated");
        })
        .catch((e) => {
          toast.dismiss();
          toast.error("Error updating form");
          console.log("error", e);
        });
    }
  }, [triggerRemoteUpdate]);

  // RENDERING FORM BUILDER
  if (!isObjEmpty(form)) {
    const { updatedOn, createdOn, formSections, id } = form;

    const rename = () => {
      toast.dismiss();
      services
        .renameForm(id, formName)
        .then((res) => {
          updateNameAndDescription({ name: formName, description: formDesc });
          queryClient.invalidateQueries({
            queryKey: ["all forms"],
          });
          queryClient.invalidateQueries({
            queryKey: ["form", id],
          });
        })
        .catch((e) => {
          toast.dismiss();
          toast.error("Error renaming form");
          console.log("error ", e);
        });
    };

    const updateDesc = () => {
      updateNameAndDescription({ name: formName, description: formDesc });
    };

    // TODO: SORT SECTIONS BY ORDER
    // let sortByOrder = (data: any) => {
    //   return data.sort(function (a: any, b: any) {
    //     return a.ordering - b.ordering;
    //   });
    // };

    return (
      <div className="pt-10 pb-20 flex px-10">
        <div className="w-2/6">
          <button
            className="px-4 py-2 flex items-center gap-2 text-sm rounded-lg bg-white border border-gray-200"
            onClick={() => {
              router.back();
            }}
          >
            <GoArrowLeft />
            Exit form builder
          </button>
        </div>
        <div className="w-4/6">
          {/* HEADER: TITLE, DESCRIPTION & LAST UPDATED */}
          <div className="boxshadow w-full mb-10">
            <div className="p-5">
              <h5 className="font-semibold text-lg mb-1">
                <input
                  value={formName}
                  className="outline-none focus:outline-none w-full"
                  onBlur={rename}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </h5>
              <div className="flex gap-5 justify-between items-center">
                <p className="font-light text-sm flex-1">
                  {" "}
                  <input
                    value={formDesc}
                    className="outline-none focus:outline-none w-full"
                    onBlur={updateDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  />
                </p>

                <p className="text-primary-green text-sm flex gap-2 items-center">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-green"></span>
                  </span>
                  <span>
                    {" "}
                    Changes saved{" "}
                    {FormatDateTime(updatedOn ? updatedOn : createdOn)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* FORM SECTIONS */}
          {formSections?.map((section: any, idx: any) => {
            return <FormSection key={idx} section={section} />;
          })}

          {/* Add New Section */}
          <div className="flex justify-end items-end w-full">
            <button
              onClick={() => {
                let template = {
                  // id: uuidv4(),
                  name: "",
                  description: "",
                  instruction: "",
                  formFields: [],
                  isDeleted: false,
                  createdOn: new Date(),
                  updatedOn: new Date(),
                  deletedOn: null,
                };

                addFormSection(template);
              }}
              className="bg-white border text-sm shadow-sm hover:bg-black hover:text-white border-gray-200 px-3 py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <CiCirclePlus size={18} /> Add section
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Builder;

//SECTION:
// {
//   id: 1,
//   name: "Personal Information",
//   description: "Enter your personal details.",
//   instruction: "Please provide accurate information.",
//   formFields: [

//   ],
//   isDeleted: false,
//   createdOn: "2024-03-22T09:07:40.598049",
//   updatedOn: "2024-03-22T09:07:40.598078",
//   deletedOn: null,
// },

// FIELD
//  {
//       id: 3,
//       name: "full_name",
//       description: "Your full name",
//       label: "Full Name",
//       placeHolder: "Enter your full name",
//       instruction: "Enter your full name as per official records",
//       ordering: 1,
//       isDeleted: false,
//       fieldDataType: "string",
//       choiceValues: [],
//       isMandatory: true,
//       horizontalAlign: false,
//       validPattern: null,
//       createdOn: "2024-03-22T09:07:40.646085",
//       updatedOn: "2024-03-22T09:07:40.646112",
//       deletedOn: null,
//     },
