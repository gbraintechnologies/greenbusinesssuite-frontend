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
  formId?: number | string;
};

const ResponseDataTable: React.FC<Props> = ({
  responseData,
  isResponseLoading,
  exportToExcel,
  formId,
}) => {
  const [aggregatedResponses, setAggregatedResponses] = useState([]);

  const [rows, setRows] = useState<any>([]);

  const [fetchingUserData, setFetchingUserData] = useState(false);

  const [pdfGenerating, setPdfGenerating] = useState(false);
  const hiddenRef = React.useRef(null);

  
  const downloadPDF = (data: any ) => {
    console.log('data ', data)
    // Simulate fetching data
    // const mergedForm = mergeForm(responseId, formData, responseData); 

    // // Render data to hidden element
    // renderToHiddenElement(mergedForm);

    // const input = hiddenRef.current;
    // if (input) {
    //   setPdfGenerating(true);
    //   html2canvas(input, { scale: 2 }).then((canvas) => { 
    //     const imgData = canvas.toDataURL("image/png");
    //     const pdf = new jsPDF("p", "mm", "a4");
    //     const width = pdf.internal.pageSize.getWidth();
    //     const height = pdf.internal.pageSize.getHeight();
    //     const imgWidth = canvas.width;
    //     const imgHeight = canvas.height;
    //     const ratio = Math.min(width / imgWidth, height / imgHeight);
    //     const imgX = (width - imgWidth * ratio) / 2;
    //     const imgY = 10; 

    //     // Add metadata
    //     const date = new Date().toLocaleDateString();
    //     const responseName = "Response Name"; 
    //     pdf.setFontSize(12);
    //     pdf.text(`Date Printed: ${date}`, 10, 10);
    //     pdf.text(`Response Name: ${responseName}`, 10, 20);

    //     pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    //     pdf.save("response.pdf");
    //     setPdfGenerating(false);
    //   }).catch(() => {
    //     setPdfGenerating(false);
    //   });
    // }
  };

  // Function to render data to the hidden element
  // const renderToHiddenElement = (mergedForm: any) => {
  //   const hiddenDiv = document.createElement('div');
  //   hiddenDiv.style.position = 'absolute';
  //   hiddenDiv.style.top = '-9999px';
  //   hiddenDiv.style.left = '-9999px';
  //   hiddenDiv.style.width = '210mm'; // A4 width in mm
  //   hiddenDiv.style.padding = '20px';
  //   hiddenDiv.style.backgroundColor = 'white';

  //   const element = (
  //     <div ref={hiddenRef}>
  //       <FormResponse mergedForm={mergedForm} />
  //     </div>
  //   );

  //   hiddenDiv.appendChild(React.createElement(element));
  //   document.body.appendChild(hiddenDiv);
  // };
  

  useEffect(() => {
    // fetching user data for each response
    const fetchUserData = async () => {
      if (responseData?.length > 0) {
        setFetchingUserData(true);
        const preparedRows = await Promise.all(
          responseData.map(async (response: any, index: number) => {
            const userRes = await services.userByIDRaw(response?.userId);
            setFetchingUserData(false);
            return {
              id: index,
              data: response,
              userData: userRes,
            };
          })
        );
        setRows(preparedRows);
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
            <div className="font-semibold">Response Id</div>
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
            <p className="text-[#475569] text-sm font-normal">
              {params.row.userData?.email}
            </p>
          </div>
        </div>,
      ],
    },
    {
      field: "completedStatus",
      headerName: "Completed Status",
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
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.data.id} className="flex items-center gap-4">
          <button onClick={() => downloadPDF(params.row.data)}>
            <DownloadIcon />
          </button>
          <Link
            href={`/company/forms/${formId}/response?user=${params.row.userData?.id}`}
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
