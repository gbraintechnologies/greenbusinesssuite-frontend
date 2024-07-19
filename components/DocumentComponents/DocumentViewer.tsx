"use client";

import React, { useState } from "react";

//
import { startWithCapital } from "@/utils/Capitalize/startWithCapital";
import { Button } from "@nextui-org/button";

import { Document, Page, pdfjs } from "react-pdf";

import { FaLinkSlash } from "react-icons/fa6";

//
import { IoCloseCircleOutline } from "react-icons/io5";

// pdf viewer worker for rendering
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function DocumentViewer({ fileName, url, onClose }: any) {
  // file type extraction from url
  const getFileType = (url: any) => {
    const extension = url.split(".").pop().toLowerCase();
    return extension;
  };

  const fileType = getFileType(url);

  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="mt-[3.5rem]">
      <div className="w-full flex items-center justify-between">
        <p className="font-medium text-lg"> {startWithCapital(fileName)}</p>
        <Button onPress={onClose}>
          <IoCloseCircleOutline className="font-light" size={30} />
        </Button>
      </div>

      <hr />
      <div className="min-h-[60vh] overflow-y-auto mt-10">
        <div>
          {fileType.match(/(jpg|jpeg|png)/) ? (
            <img
              src={url}
              alt={fileName}
              className="w-full h-[60vh] object-contain"
              // style={{ maxWidth: "100%", height: "auto" }}
            />
          ) : fileType.match(/(pdf)/) ? (
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
          ) : (
            <div className="h-[20rem] flex flex-col items-center justify-center">
              <FaLinkSlash size={80} />
              <h4 className="mt-3 text-2xl font-semibold">
                {" "}
                Unsupported file type
              </h4>
              <p className="mb-8 mt-1">
                This file cannot be previewed, instead you can download it
              </p>
              <a
                className={` py-2 rounded-lg text-semibold  text-white px-10 font-light hover:opacity-90 cursor text-left block bg-black`}
                download={fileName}
                target="_blank"
                href={url}
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentViewer;

// react-pdf -  https://www.npmjs.com/package/react-pdf
