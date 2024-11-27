"use client";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { IoCheckmark } from "react-icons/io5";
import ModuleCard from "../../components/ModuleCard";

const page = () => {
  const router = useRouter();

  const dummyCategories = ["Business Consultancy", "Micro-lending", "Business Association", "Manufacturing", "Special Economic Zones (SEZs)"];

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
    {
      title: "Form Builder",
      description: [
        {
          role: "CompanyAdmin",
          details: "Create and publish forms and surveys.",
        },
        {
          role: "Client",
          details: "View and fill published forms and surveys.",
        },
      ],
    },
    {
      title: "Support and Help",
      description: [
        {
          role: "CompanyAdmin",
          details: "Create and publish FAQs.",
        },
        {
          role: "Client",
          details: "View FAQs and send concerns to customer service.",
        },
      ],
    },
  ];

  const dummyCategoryModules = [
    {
      "title": "Home Page Template 1",
      "description": [
        {
          "role": "Client",
          "details": "Home screen for a lending-focused company."
        }
      ]
    },
    {
      "title": "Home Page Template 2",
      "description": [
        {
          "role": "Client",
          "details": "Home screen for a lending-focused company."
        }
      ]
    }
  ]

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(dummyCategories[0]);

  return (
    <div className="px-5 pb-20">
      <div className="w-full text-primary-dark pb-3 flex justify-between">
        <div className="flex items-center gap-3">
          {/* <div
                    className="my-3 cursor-pointer flex text-sm items-center gap-2"
                    onClick={() => router.back()}
                  >
                    <IoIosArrowBack size={12} />
                  </div> */}
          <h3 className="font-semibold text-xl">Configuration</h3>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            type="button"
            className="bg-gray-50 border border-gray-200 shadow-sm py-2 flex text-primary-dark text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
          >
            {isSubmitting ? (
              <>
                <LoadingIcon />
                Saving
              </>
            ) : (
              <>
                {" "}
                <HiOutlineInboxArrowDown /> Save
              </>
            )}
          </button>
        </div>
      </div>

      <div className="w-full  py-5 pb-3">
      {/* SELECT CATEGORY */}
        <header className="pb-2  ">
          <h3 className="text-lg text-primary-dark font-semibold">
            Select Category
          </h3>
          <p className="text-sm text-[#667085]">
            Select the category template that best fits the company
          </p>
        </header>
        {/* SELECTING CATEGORIES */}
        <div className="max-w-2xl">
          <label className="text-xs text-slate-700 mb-2">Category</label>
          <Dropdown>
            <DropdownTrigger>
              <button className="outline-none border w-full py-2 px-1 border-[#E2E8F0] bg-[#F8FAFC] text-[#334155] rounded-lg my-1">
                <div className="flex gap-2 w-full justify-between items-center py-0 px-4">
                  <p className=" font-normal text-sm">{selectedCategory}</p>

                  <div className="">
                    <BiChevronDown size={21} color="#94A3B8" />
                  </div>
                </div>
              </button>
            </DropdownTrigger>
            <DropdownMenu
              className="shadow-md bg-white border border-[#F1F5F9] w-[42rem] rounded-lg flex flex-col gap-3"
              aria-label="Static Actions"
            >
              {dummyCategories?.map((cat: any) => (
                <DropdownItem
                  key="view"
                  className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                    onClick={() => setSelectedCategory(cat)}
                >
                  <div className="flex w-full items-center justify-between">
                    <p>{cat}</p>
                    {cat == selectedCategory && (
                      <IoCheckmark size={20} color="#334155" />
                    )}
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* DISPLAYING MODULES */}
        <div className="border-l-2 border-[#F1F5F9] px-4 mt-6">
          {/* CORE MODULES */}
          <div>
            <header className="pb-2 ">
              <h3 className="text-lg text-primary-dark font-semibold">
                Core Modules
              </h3>
              <p className="text-sm text-[#667085]">
                Core Modules that apply to all categories{" "}
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
                  index={index + "core"}
                />
              ))}
            </div>
          </div>

          {/* CATEGORY SPECIFIC MODULES */}
          <div className="mt-6">
            <header className="pb-2 ">
              <h3 className="text-lg text-primary-dark font-semibold">
                Category-Specific Modules{" "}
              </h3>
              <p className="text-sm text-[#667085]">
                Modules tailor-made for specific categories{" "}
              </p>
            </header>
            <div className="mt-3 grid grid-cols-3 gap-2 w-full">
              {dummyCategoryModules?.map((module: any, index: number) => (
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
                  index={index + "category"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
