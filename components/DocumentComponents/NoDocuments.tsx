import React from "react";

import { HiOutlineDocumentText } from "react-icons/hi";

function NoDocuments({ text = "No documents for display" }: any) {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="flex flex-col items-center justify-center">
        <HiOutlineDocumentText className="text-gray-500" size={40} />
        <p className="text-gray-500 mt-2">{text}</p>
      </div>
    </div>
  );
}

export default NoDocuments;
