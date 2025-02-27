"use client";

import React, { useEffect } from "react";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

// icons
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";

import FormPreviewIcon from "@/public/icons/FormPreviewIcon";

// utils
import FormatDate, { FormatDateShort } from "@/utils/FormatDate/FormatDate";

import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUser from "@/hooks/useUser";
import services from "@/services";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import mergeForm from "@/utils/MergeFormFields/MergeFormFields";
import { createRoot } from "react-dom/client";
import FormResponse from "./FormResponse/FormResponse";
import StatusPill from "@/components/StatusPill/StatusPillText";
import useAuth from "@/hooks/useAuth";
import html2pdf from "html2pdf.js";

type Props = {
  form: any;
  onClick?: () => void;
  type: "completed" | "uncompleted";
};
function FormCard({ form: formResponse, type = "uncompleted" }: Props) {
  //

  const { data: selectedForm, isLoading } = useQuery({
    queryKey: ["form", parseInt(formResponse?.formId)],
    queryFn: services.getFormById(formResponse?.formId),
    enabled: Boolean(formResponse?.formId),
  });

  const { user } = useUser();
  const { auth } = useAuth();

  const queryClient = useQueryClient();

  const hiddenRef = React.useRef(null);

  const router = useRouter();

  const captureAndGeneratePDF = (userData: any, responseId: string) => {
    const input = hiddenRef?.current;

    if (input) {
      const options = {
        margin: 10,
        filename: `${selectedForm?.name}-${userData?.first_name} ${userData?.last_name}-${responseId}-response.pdf`,
        image: { type: "jpeg", quality: 0.75 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: "avoid-all", before: "#newsection" },
      };

      html2pdf()
        .set(options)
        .from(input)
        .toPdf()
        .get("pdf")
        .then((pdf: any) => {
          // Adding the metadata text to every page
          const totalPages = pdf.internal.getNumberOfPages();
          const date = new Date().toLocaleDateString("en-us", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          const responseName = `${userData?.first_name} ${userData?.last_name}`;

          // Loop through each page and add the text
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.text(`Date Printed: ${date}`, 5, 5);
            pdf.text("|", 60, 5);
            pdf.text(`Response: ${responseName}`, 65, 5);
          }
        })
        .save()
        .then(() => {})
        .catch((error: any) => {
          console.log("error generating", error);
        });
    }
  };

  const renderToHiddenElement = (
    mergedForm: any,
    userData: any,
    responseId: any
  ) => {
    const hiddenDiv = document.createElement("div");
    hiddenDiv.style.position = "absolute";
    hiddenDiv.style.top = "-100000px";
    hiddenDiv.style.left = "-100000px";
    hiddenDiv.style.width = "210mm";
    hiddenDiv.style.minHeight = "297mm";
    hiddenDiv.style.backgroundColor = "white";

    document.body.appendChild(hiddenDiv);

    const root = createRoot(hiddenDiv);
    root.render(
      <FormResponse
        mergedForm={mergedForm}
        ref={hiddenRef}
        onRendered={() => captureAndGeneratePDF(userData, responseId)}
      />
    );
  };

  const completedOptions = [
    {
      title: "View",
      func: () => {
        router.push(
          `/${auth?.tenantId}/client/form/view?id=${formResponse?.formId}&response=${formResponse?.id}`
        );
      },
    },
    {
      title: "Download",
      func: async () => {
        toast.promise(
          (async () => {
            const resData = await services.retrieveFormUserResponseRaw(
              formResponse.id
            );

            if (resData) {
              const mergedForm = mergeForm(
                formResponse?.id,
                selectedForm,
                formResponse?.inputData
              );

              renderToHiddenElement(mergedForm, user, resData?.id);
            } else {
              throw new Error("No data found");
            }
          })(),
          {
            loading: "Processing form response...",
            success: "Download will start soon, please wait...",
            error: "Error while downloading file",
          }
        );
      },
    },
  ];

  const uncompletedOptions = [
    {
      title: "Continue editing",
      func: () => {
        router.push(
          `/${auth?.tenantId}/client/form?id=${formResponse?.formId}&response=${formResponse?.id}`
        );
      },
    },
  ];

  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (type === "completed") {
      // @ts-ignore
      setOptions(completedOptions);
    } else {
      // @ts-ignore
      setOptions(uncompletedOptions);
    }
  }, []);

  if (selectedForm && formResponse) {
    const form = mergeForm(
      formResponse.id,
      selectedForm,
      formResponse?.inputData
    );

    return (
      <>
        <div className="w-full rounded-lg shadow-md bg-[#F8FAFC]">
          <button
            className={`flex relative items-center bg-gradient-to-br from-indigo-950 to bg-gray-900 justify-center w-full h-[10rem] rounded-tl-lg rounded-tr-lg`}
          >
            <FormPreviewIcon />
          </button>
          <div className="p-3">
            <button className="text-lg w-full text-left font-medium">
              {/* @ts-ignore */}
              {form?.name?.replace(/"/g, " ")}
            </button>
            {formResponse && (
              <div className="-mt-1">
                <StatusPill status={formResponse?.status} />
              </div>
            )}

            <div className="flex items-center justify-between">
              {formResponse && (
                <p className="text-xs font-light pr-4">
                  Updated on{" "}
                  {formResponse && FormatDateShort(formResponse?.updatedOn)}
                </p>
              )}

              <Menu as="div" className="relative">
                <div className="relative">
                  <Menu.Button className="relative">
                    <BsThreeDots />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute  w-40 right-1 -top-1 rounded-lg shadow-md flex flex-col bg-white text-left">
                    {options &&
                      // @ts-ignore
                      options?.map((option: any, idx: any) => {
                        return (
                          <Menu.Item key={idx}>
                            <div>
                              <button
                                className={`${
                                  option.title.toLowerCase() === "delete"
                                    ? "text-red-600"
                                    : " text-gray-500"
                                } py-3  px-4 font-light hover:bg-gray-50 text-left w-full`}
                                onClick={() => option.func()}
                              >
                                {option.title}
                              </button>

                              {idx % 2 === 0 && (
                                <div className="border-t-[1px] border-gray-200 mx-auto w-[80%] text-center" />
                              )}
                            </div>
                          </Menu.Item>
                        );
                      })}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}

export default FormCard;
