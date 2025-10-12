"use client";
import useCompany from "@/hooks/useCompany";
import services from "@/services";
import formatBytes from "@/utils/FormatBytes/formatBytes";
import { Button } from "@heroui/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { HiOutlineDocumentText } from "react-icons/hi";
import { IoCloseCircleOutline } from "react-icons/io5";

function UploadFileToIssue({ formId, userId, onClose, refetch }: any) {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { companyBranding: company } = useCompany();

  const onDrop = useCallback((acceptedFiles: any, fileRejections: any) => {
    // @ts-ignore
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);

    // show errors for rejected files
    fileRejections.map(({ file, errors }: any) => {
      for (const error of errors) {
        if (error.code === "file-too-large") {
          toast.error(`${file.name} is larger than 1Mb`);
        }

        if (error.code === "file-invalid-type") {
          toast.error(
            `${file.name} is invalid and doesn't meet upload criteria`
          );
        }
      }
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 1048576,
    accept: {
      // 'image/jpeg': ['.jpeg', '.png']
    },
  });

  const [loading, setLoading] = useState(false);

  const uploadFiles = async () => {
    setLoading(true);

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      // @ts-ignore
      let fileName = file?.name;
      let companyId = company.id;

      try {
        let res: any = await services.issueFileToUserWithFormId(
          userId,
          companyId,
          formId,
          formData,
          fileName
        );
        toast.success(`Issued ${fileName} successfully!`);

        try {
          await services.notifyClientForDocumentIssued({
            companyId,
            userId,
            docLink: res?.data,
          });

          toast.success("Client notified successfully.");
        } catch (e) {
          toast.error("Error notifying client");
        }
      } catch (e) {
        toast.error(`Error issuing ${fileName}`);
      }
    }

    onClose();
    refetch();
    setLoading(false);
  };

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="border border-gray-400 text-sm cursor-pointer rounded-lg border-dashed flex items-center min-h-[8rem] justify-center">
          {isDragActive ? (
            <div className="flex items-center justify-center flex-col">
              {" "}
              <HiOutlineDocumentText className="text-gray-500" size={30} />
              <p>Drop files here</p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 flex-col">
              <HiOutlineDocumentText className="text-gray-500" size={30} />
              <p>Drop files here or click to upload files</p>
              <p>Max size: {formatBytes(1048576)}</p>
            </div>
          )}
        </div>
      </div>

      {/*  */}
      {selectedFiles?.length > 0 && (
        <div>
          <div className="my-4 text-gray-500 font-light">Selected Files</div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            {selectedFiles?.map((file: any) => {
              return (
                <div className="flex gap-4 bg-gray-100 p-2 pl-3 justify-between rounded-lg">
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">{file?.name}</p>
                    <p className="text-xs text-gray-600">
                      {formatBytes(file?.size)}
                    </p>
                  </div>
                  <IoCloseCircleOutline
                    size={20}
                    className="text-gray-500 w-10 hover:text-black cursor-pointer"
                    onClick={() => {
                      setSelectedFiles((prev) => [
                        ...prev.filter((item: any) => item.name !== file.name),
                      ]);
                    }}
                  />
                </div>
              );
            })}
          </div>
          <Button
            disabled={loading}
            onClick={uploadFiles}
            className="bg-black rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed text-sm text-white"
          >
            {loading ? "Issuing. Please wait..." : "Issue Uploaded files"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default UploadFileToIssue;
