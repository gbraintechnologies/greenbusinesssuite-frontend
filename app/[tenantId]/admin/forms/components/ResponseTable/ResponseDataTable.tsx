"use client";
import DataTable from "@/components/DataTable/DataTable";
import StatusPill from "@/components/StatusPill/StatusPill";
import DownloadIcon from "@/public/icons/DownloadIcon";
import EyeIcon from "@/public/icons/EyeIcon";
import ListIcon from "@/public/icons/ListIcon";
import UserIcon from "@/public/icons/UserIcon";
import services from "@/services";
import { GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import mergeForm from "@/utils/MergeFormFields/MergeFormFields";
import FormResponse from "../FormResponse/FormResponse";
import { createRoot } from "react-dom/client";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import html2pdf from "html2pdf.js";


export interface IResponse {
  email: string;
  rating: string;
  comment: string;
  full_name: string;
  phone_number: string;
  recommendation: string;
}
type Props = {
  responseData: IResponse[];
  isResponseLoading: boolean;
  exportToExcel: (responses: any) => void;
  form?: any;
};

const ResponseDataTable: React.FC<Props> = ({
  responseData,
  isResponseLoading,
  exportToExcel,
  form,
}) => {
  const [aggregatedResponses, setAggregatedResponses] = useState([]);

  const [activeResponseId, setActiveResponseId] = useState<any>();

  const { auth } = useAuth();

  const [rows, setRows] = useState<any>([]);

  const [fetchingUserData, setFetchingUserData] = useState(false);

  const [pdfGenerating, setPdfGenerating] = useState(false);
  const hiddenRef = React.useRef(null);

  const captureAndGeneratePDF = (userData: any, responseId: string) => {
    const input = hiddenRef?.current;
  
    if (input) {
      const options = {
        margin: 10,
        filename: `${form?.name}-${userData?.first_name} ${userData?.last_name}-${responseId}-response.pdf`,
        image: { type: "jpeg", quality: 0.75 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: 'avoid-all', before: '#newsection' }
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
          setPdfGenerating(false);
        })
        .catch(() => {
          setPdfGenerating(false);
        });
    }
  };
  
  


  const downloadPDF = async (responseId: number, userData: any) => {
    try {
      setPdfGenerating(true);
      setActiveResponseId(responseId);
      const resData = await services.retrieveFormUserResponseRaw(
        userData?.id,
        form?.id
      );

      if (resData) {
        console.log('response id ', responseId);
        console.log('form ', form);
        console.log('res data input data', resData[0]?.inputData);
        const mergedForm = mergeForm(responseId, form, resData[0]?.inputData);

        console.log('merged form', mergedForm);

        renderToHiddenElement(mergedForm, userData, responseId);
      }
    } catch (error) {
      toast.error("An error occurred while generating PDF");
      setPdfGenerating(false);
    } finally {
      setPdfGenerating(false);
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

  useEffect(() => {
    // console.log("in use effect", responseData, responseData?.length);
    // fetching user data for each response
    const fetchUserData = async () => {
      if (responseData?.length > 0) {
        setFetchingUserData(true);
        try {
          const preparedRows = await Promise.all(
            responseData.map(async (response: any, index: number) => {
              try {
                if (Boolean(response?.userId)) {
                  const userRes = await services.userByIDRaw(response?.userId);
                  return {
                    id: index,
                    data: response,
                    userData: userRes,
                  };
                } else {
                  return {
                    id: index, 
                    data: response,
                    userData: null, 
                  };
                }
              } catch (error) {
                toast.error(`Error fetching user data for userId: ${response?.userId}`);
                console.error(`Error fetching user data for userId: ${response?.userId}`, error);
                return {
                  id: index,
                  data: response,
                  userData: null, 
                };
              }
            })
          );

          
          setRows(preparedRows.filter((item) => item?.id !== null));
        } catch (error) {
          toast.error("Error fetching user details for responses");
          console.log("error occured", error);
          setRows([]);
        } finally {
          setFetchingUserData(false);
        }
      } else {
        setRows([]);
      }
    };

    fetchUserData();
  }, [responseData]);

  const columns: GridColDef[] = [
    {
      field: "name",
      renderHeader: () => (
        <div className="flex justify-between items-center gap-9">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="form-check-input"
              defaultChecked={false}
            />
            <div className="font-semibold uppercase">Response Id</div>
          </div>
          <ListIcon />
        </div>
      ),
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 1,
      getActions: (params: any) => [
        <div
          className="flex justify-between items-center gap-4"
          key={params.row.data?.id}
        >
          <input
            id={params.row.data?.id}
            type="checkbox"
            className="form-check-input"
            defaultChecked={false}
          />
          <div>{params.row.data?.id}</div>
        </div>,
      ],
    },
    {
      field: "Name",
      headerName: "Name",
      flex: 2,
      headerAlign: "left",
      align: "left",
      type: "actions",
      getActions: (params: any) => [
        <div className="flex gap-2 items-center">
          <div className="">
            {params.row.userData.custom_profile_values &&
            params.row.userData.custom_profile_values.find(
              (item: any) => item.custom_profile_item_id === 1
            )?.value?.length > 1 ? (
              <Image
                alt="profile"
                src={
                  params.row.userData.custom_profile_values.find(
                    (item: any) => item.custom_profile_item_id === 1
                  ).value
                }
                width={150}
                height={150}
                className="rounded-full w-10 h-10 object-cover"
              />
            ) : (
              <div className="bg-gray-100 w-10 h-10 flex items-center justify-center font-light text-sm rounded-full">
                <UserIcon />
              </div>
            )}
          </div>
          <div key={params.row.id} className="flex flex-col gap-2">
            <p className="font-medium text-sm">
              {params.row.userData?.first_name} {params.row.userData?.last_name}
            </p>
            <p className="text-[#475569] -mt-2 text-sm font-normal">
              {params.row.userData?.email}
            </p>
          </div>
        </div>,
      ],
    },
    {
      field: "completedStatus",
      headerName: "User Status",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id}>
          {params.row.data?.isCompleted ? (
            <StatusPill status="complete" />
          ) : (
            <StatusPill status="incomplete" />
          )}
        </div>,
      ],
    },
    {
      field: "adminStatus",
      headerName: "Processing Status",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id}>
          {params.row.data?.status && (
            <StatusPill status={params.row.data?.status} />
          )}
        </div>,
      ],
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.data.id} className="flex items-center gap-4">
          <button
            onClick={() =>
              downloadPDF(params.row.data?.id, params.row.userData)
            }
          >
            {pdfGenerating && activeResponseId == params.row.data?.id ? (
              <LoadingIcon />
            ) : (
              <DownloadIcon />
            )}
          </button>
          <Link
            href={`/${auth?.tenantId}/admin/forms/${form?.id}/response?user=${params.row.userData?.id}`}
          >
            <EyeIcon />
          </Link>
        </div>,
      ],
    },
  ];

  return (
    <div>
      <DataTable
        isLoading={isResponseLoading || fetchingUserData}
        rows={rows}
        columns={columns}
      />
    </div>
  );
};

export default ResponseDataTable;
