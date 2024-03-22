import { useRouter } from "next/navigation";

// icons
import { GoArrowLeft } from "react-icons/go";
import { CiCirclePlus } from "react-icons/ci";

// hooks
import useForm from "@/hooks/useForm";

//
import React, { useEffect, useState } from "react";

//
import FormatDate from "@/utils/FormatDate/FormatDate";
import FormSection from "../components/FormSection";

//
import { useQueryClient } from "@tanstack/react-query";
import services from "@/services";
import toast from "react-hot-toast";

function isObjEmpty(obj: any) {
  return Object.keys(obj).length === 0;
}

function Builder({ data }: any) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { form, selectForm } = useForm();
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

  if (!isObjEmpty(form)) {
    const { updatedOn, createdOn, formSections, id } = form;

    const rename = () => {
      toast.dismiss();
      services
        .renameForm(id, formName)
        .then((res) => {
          console.log("renaming form", res);
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
          <div className="boxshadow w-full mb-10">
            <div className="p-5">
              <h5 className="font-semibold text-lg mb-1">
                <input
                  value={formName}
                  className="outline-none focus:outline-none"
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
                    // onBlur={}
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
                    {FormatDate(updatedOn ? updatedOn : createdOn)}
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
            <button className="bg-white border text-sm shadow-sm hover:bg-black hover:text-white border-gray-200 px-3 py-2 rounded-lg flex items-center justify-center gap-2">
              <CiCirclePlus size={18} /> Add section
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Builder;
