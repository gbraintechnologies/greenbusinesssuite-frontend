"use client";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import DownloadIcon from "@/public/icons/DownloadIcon";
import UserIcon from "@/public/icons/UserIcon";
import services from "@/services";
import mergeForm from "@/utils/MergeFormFields/MergeFormFields";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import FormResponse from "../../components/FormResponse/FormResponse";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

const page = ({ params }: any) => {
  let formID = params.formId;

  const [pdfGenerating, setPdfGenerating] = React.useState(false);

  const searchParams = useSearchParams();

  const userId = searchParams.get("user") ? searchParams.get("user") : "";

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", parseInt(formID)],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
  });

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", userId ? parseInt(userId) : null],
    queryFn: services.userByID(userId),
    enabled: Boolean(userId),
  });

  // GET USER RESPONSE
  const { data: formUserResponse, isLoading: userResponseLoading } = useQuery({
    queryKey: ["form", userId, formID],
    queryFn: services.retrieveFormUserResponses(userId, formID),
    enabled: Boolean(formID && userId),
  });

  let mergedForm =
    form &&
    formUserResponse &&
    mergeForm(formUserResponse[0]?.id, form, formUserResponse[0]?.inputData);

  const router = useRouter();

  const pdfRef = React.useRef(null);

  const downloadPDF = async () => {
    setPdfGenerating(true);
    const input: any = pdfRef?.current;


    if (input) {
      html2canvas(input, {
        scale: 3, 
        width: input.scrollWidth,
        height: input.scrollHeight,
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4", true);
          console.log('pdf ', pdf);
          const width = pdf.internal.pageSize.getWidth();
          const height = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(width / imgWidth, height / imgHeight);
          const imgX = (width - imgWidth * ratio) / 2;
          const imgY = 10;
          // meta data
          const date = new Date().toLocaleDateString("en-us", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          const responseName = `${userData?.first_name} ${userData?.last_name}`;
          pdf.setFontSize(8);
          pdf.text(`Date Printed: ${date}`, 5, 5);
          pdf.text("|", 60, 5);
          pdf.text(`Response: ${responseName}`, 65, 5);

          pdf.addImage(
            imgData,
            "PNG",
            imgX,
            imgY,
            imgWidth * ratio,
            imgHeight * ratio
          );
          pdf.save(
            `${form?.name}-${userData?.first_name} ${userData?.last_name}-${mergedForm?.responseId}-response`
          );
          setPdfGenerating(false);
        })
        .catch(() => {
          setPdfGenerating(false);
        });
    } else {
      setPdfGenerating(false);
    }
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="h-[20rem] flex items-center justify-center">
        <div>
          <LoadingIcon />
          <p className="mt-2 text-xs text-gray-500">
            Fetching response details
          </p>
        </div>
      </div>
    );
  }
  // if(form){
  return (
    <div className="px-5 pb-20 bg-[#F8FAFC] pt-4 h-full">
      {/* HEADER */}
      <div>
        <h3 className="text-xl font-semibold">
          <span className="font-light text-gray-500">Forms /</span> {form?.name}{" "}
        </h3>
      </div>

      <button
        className="mt-5 flex items-center gap-3"
        onClick={() => router.back()}
      >
        <BsArrowLeft />
        <p className="text-sm font-medium">Back</p>
      </button>

      {/* USER DATA */}
      <div className="mt-8 flex  items-center justify-between w-[70%] ">
        <div className="flex gap-2 items-center">
          <div className="">
            {userData?.custom_profile_values &&
            userData?.custom_profile_values.find(
              (item: any) => item.custom_profile_item_id === 1
            )?.value?.length > 1 ? (
              <Image
                alt="profile"
                src={
                  userData.custom_profile_values.find(
                    (item: any) => item.custom_profile_item_id === 1
                  ).value
                }
                width={150}
                height={150}
                className="rounded-full w-24 h-24 object-cover"
              />
            ) : (
              <div className="bg-gray-100 w-24 h-24 flex items-center justify-center font-light text-sm rounded-full">
                <UserIcon />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">
              {userData?.first_name} {userData?.last_name}
            </p>
            <p className="text-[#475569] text-sm font-normal">
              {userData?.email}
            </p>
            <p className="text-[#15803D] text-sm underline cursor-pointer w-auto">
              Go to user profile
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 bg-white border border-[#E2E8F0] drop-shadow-sm px-2 py-2 text-sm rounded-md"
          onClick={downloadPDF}
          disabled={pdfGenerating}
        >
          {pdfGenerating ? <LoadingIcon /> : <DownloadIcon />}
          <p className="text-sm font-medium text-[#334155]">
            {pdfGenerating ? "Generating..." : "Download"}
          </p>
        </button>
      </div>

      {/* FORM RESPONSE */}
      <div className="mt-4">
        <FormResponse mergedForm={mergedForm} ref={pdfRef} />
      </div>
    </div>
  );
};

export default page;
