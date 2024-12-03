import React from "react";
import ModuleCard from "../../components/ModuleCard";
import "../index.css"

const Configuration = () => {
  const dummyCoreModules = [
    {
      title: "Dashboard",
      description: [
        {
          role: "CompanyAdmin",
          details: "View analytics and metrics of the company.",
        },
      ],
    },
    {
      title: "Documents",
      description: [
        {
          role: "CompanyAdmin",
          details: "Upload and assign documents to users.",
        },
        {
          role: "Client",
          details: "View and download assigned documents.",
        },
      ],
    },
    {
      title: "Notifications",
      description: [
        {
          role: "CompanyAdmin",
          details: "Send messages through SMS, email or in-app.",
        },
        {
          role: "Client",
          details: "View in-app messages.",
        },
      ],
    },
    {
      title: "User Management",
      description: [
        {
          role: "CompanyAdmin",
          details: "Manage users and roles in company.",
        },
      ],
    },
    
  ];

  const dummyCategoryModules = [
    {
      title: "Home Page Template 1",
      description: [
        {
          role: "Client",
          details: "Home screen for a lending-focused company.",
        },
      ],
    },
    {
      title: "Home Page Template 2",
      description: [
        {
          role: "Client",
          details: "Home screen for a lending-focused company.",
        },
      ],
    },
  ];

  return (
    <div className="w-full my-6">
      <div className=" ">
        <h3 className="text-lg text-primary-dark font-semibold">
          Category Details
        </h3>

        <div>
          <label className="text-[#334155] text-sm font-normal">
            Category Name
          </label>
          <p className="text-[#334155] text-sm font-medium">Micro-lending </p>
        </div>
        <div>
          <label className="text-[#334155] text-sm font-normal">
            Category Description
          </label>
          <p className="text-[#334155] text-sm font-medium">
            This category is for companies that provide micro-lending services.
          </p>
        </div>
      </div>
      <div className="mt-4">
        <div>
          <header>
            <h3 className="text-lg text-primary-dark font-semibold">
              Industry Modules
            </h3>
            <p className="text-[#667085] text-sm">
              Modules tailor-made for specific industries
            </p>
          </header>
          <div className="mt-3 grid grid-cols-3 gap-2 w-full">
              {dummyCoreModules?.map((module: any, index: number) => (
                <ModuleCard
                  moduleName={module?.title}
                  companyAdminPortal={
                    module?.description?.find(
                      (desc: any) => desc?.role == "CompanyAdmin"
                    )?.details ?? ""
                  }
                  clientPortal={
                    module?.description?.find(
                      (desc: any) => desc?.role == "Client"
                    )?.details ?? ""
                  }
                  disableCheckboxes={true}
                  defaultChecked={true}
                  index={index + "core"}
                />
              ))}
            </div>
        </div>
        <div>
          <header>
            <h3 className="text-lg text-primary-dark font-semibold">
              Core Modules
            </h3>
            <p className="text-[#667085] text-sm">
              Core Modules that apply to all industries{" "}
            </p>
          </header>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
