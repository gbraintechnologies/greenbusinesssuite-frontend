import React from "react";

// @ts-ignore
import FileViewer from "react-file-viewer";

//
import { startWithCapital } from "@/utils/Capitalize/startWithCapital";
import { Button } from "@nextui-org/button";

//
import { IoCloseCircleOutline } from "react-icons/io5";

function DocumentViewer({ fileName, url, onClose }: any) {
  return (
    <div className="mt-[3.5rem]">
      <div className="w-full flex items-center justify-between">
        <p className="font-medium text-lg"> {startWithCapital(fileName)}</p>
        <Button onPress={onClose}>
          <IoCloseCircleOutline className="font-light" size={30} />
        </Button>
      </div>

      <div className="min-h-[80vh]">
        <FileViewer
          fileType={fileName?.split(".")[1]}
          filePath={url}
          // errorComponent={CustomErrorComponent}
          // onError={(e) => {
          //   console.log("erropr", e);
          // }}
        />
      </div>
      <hr />
    </div>
  );
}

export default DocumentViewer;
