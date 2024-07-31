"use client";

import React, { useState } from "react";

//
import Tabs from "@/components/Tabs/Tabs";
import Uploaded from "./components/Uploaded";
import Issued from "./components/Issued";

function Documents() {
  //
  const [tabs, setTabs] = useState([
    { id: 1, name: "Uploaded", value: "Uploaded" },
    { id: 2, name: "Issued", value: "Issued" },
  ]);

  const [activeTab, setActiveTab] = useState({
    id: 1,
    name: "Uploaded",
    value: "Uploaded",
  });

  return (
    <div className="px-5 pt-5  ">
      <div className="text-slate-900 font-semibold text-lg mb-5">Documents</div>
      <div className="mt-3">
        <Tabs
          filters={tabs}
          setActiveFilter={setActiveTab}
          activeFilter={activeTab}
        />
      </div>

      <div className="mt-6">
        {activeTab?.id === 1 && <Uploaded />}
        {activeTab?.id === 2 && <Issued />}{" "}
      </div>
    </div>
  );
}

export default Documents;
