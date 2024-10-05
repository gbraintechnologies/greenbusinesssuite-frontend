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
function FormCard({ form, type = "uncompleted" }: Props) {
  //
  let { id, updatedOn } = form;

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
        filename: `${form?.name}-${userData?.first_name} ${userData?.last_name}-${responseId}-response.pdf`,
        image: { type: "jpeg", quality: 0.75 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
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
            pdf.setPage(i); // Set the current page
            pdf.setFontSize(8);
            pdf.text(`Date Printed: ${date}`, 5, 5); // Top-left corner
            pdf.text("|", 60, 5); // Top, between the two texts
            pdf.text(`Response: ${responseName}`, 65, 5); // Top-right corner
          }
        })
        .save()
        .then(() => {
          // setPdfGenerating(false);
        })
        .catch(() => {
          // setPdfGenerating(false);
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
        router.push(`/${auth?.tenantId}/client/form/view?id=${form?.id}`);
      },
    },
    {
      title: "Download",
      func: async () => {
        toast.promise(
          (async () => {
            const resData = await services.retrieveFormUserResponseRaw(
              user?.id,
              form?.id
            );

            if (resData) {
              const mergedForm = mergeForm(
                resData[0]?.id,
                form,
                resData[0]?.inputData
              );
              renderToHiddenElement(mergedForm, user, resData[0]?.id);
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
          `/${auth?.tenantId}/client/form?id=${form?.id}&company=${form?.companyId}`
        );
      },
    },
  ];

  //  7 colors to pick at random from
  const colors = [
    { a: "#392F5A", b: "#584B81" },
    { a: "#FFA245", b: "#FF8811" },
    { a: "#FFCAD4", b: "#FEA7B7" },
    { a: "#E2E8F0", b: "#E2E8F0" },
    { a: "#F4D06F", b: "#F7CC5A" },
  ];

  function getRandomInt(min: any, max: any) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let color = colors[getRandomInt(0, 4)];

  const {
    data: formUserResponse,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["form", user?.id, id],
    queryFn: services.retrieveFormUserResponses(user?.id, id),
    enabled: Boolean(id && user?.id),
  });

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

  const deleteUserForm = () => {
    services
      .hardDeleteUserForm(user?.id, id)
      .then((res) => {
        console.log("user form deleted");
        toast.success("deleted");
      })
      .catch((e) => {
        console.log("error", e);
      });
  };

  return (
    <>
      <div className="w-full rounded-lg shadow-md bg-[#F8FAFC]">
        {/* <button
          className="my-4 bg-red-500 text-white rounded-lg"
          onClick={deleteUserForm}
        >
          Delete
        </button> */}
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
          {formUserResponse && (
            <div className="-mt-1">
              <StatusPill status={formUserResponse[0]?.status} />
            </div>
          )}

          <div className="flex items-center justify-between">
            {formUserResponse && (
              <p className="text-xs font-light pr-4">
                Updated on{" "}
                {formUserResponse &&
                  FormatDateShort(formUserResponse[0]?.updatedOn)}
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
                        <Menu.Item>
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
}

export default FormCard;
