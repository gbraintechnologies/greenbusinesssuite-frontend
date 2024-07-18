"use client";

import React, { useState } from "react";

//
import { startWithCapital } from "@/utils/Capitalize/startWithCapital";
import { Button } from "@nextui-org/button";

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

//
import { IoCloseCircleOutline } from "react-icons/io5";

function DocumentViewer({ fileName, url, onClose }: any) {
  const docs = [
    { uri: url }, // Remote file
  ];
  const [activeDocument, setActiveDocument] = useState(docs[0]);

  return (
    <div className="mt-[3.5rem]">
      <div className="w-full flex items-center justify-between">
        <p className="font-medium text-lg"> {startWithCapital(fileName)}</p>
        <Button onPress={onClose}>
          <IoCloseCircleOutline className="font-light" size={30} />
        </Button>
      </div>

      <hr />
      <div className="min-h-[80vh]">
        <DocViewer
          documents={docs}
          activeDocument={activeDocument}
          pluginRenderers={DocViewerRenderers}
        />
      </div>
    </div>
  );
}

export default DocumentViewer;
