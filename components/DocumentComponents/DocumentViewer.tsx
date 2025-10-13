"use client";

import React, { useEffect, useState } from "react";

//
import { startWithCapital } from "@/utils/Capitalize/startWithCapital";
import { Button } from "@heroui/react";

import { FaLinkSlash } from "react-icons/fa6";

//
import { IoCloseCircleOutline } from "react-icons/io5";

function DocumentViewer({ fileName, url, onClose }: any) {
  // file type extraction from url
  const getFileType = (url: any) => {
    const extension = url.split(".").pop().toLowerCase();
    return extension;
  };

  const fileType = getFileType(url);

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
            />
          ) : (
            // : fileType.match(/(pdf)/) ? (
            //   <iframe src={url} width="400px" height="300px" />
            // )

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
