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
import ModuleCard from "../components/ModuleCard";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";

const CompanyConfig = () => {
  const router = useRouter();

  // Query to fetch all categories
  const { data: allCategories, isLoading: isLoadingAllCategories } = useQuery({
    queryKey: ["all_categories"],
    queryFn: services.getAllCategories,
  });

  // Query to fetch all modules
  const { data: allModules, isLoading: loadingModules } = useQuery({
    queryKey: ["all modules"],
    queryFn: services.getAllModules,
  });

  const [selectedModules, setSelectedModules] = useState<any>([]);

  const [selectedCategoryModules, setSelectedCategoryModules] = useState<any>(
    []
  );

  // function to handle core modules checkbox change
  const handleCoreModulesCheckboxChange = (
    moduleData: any,
    isChecked: boolean
  ) => {
    setSelectedModules((prevSelected: any) => {
      if (isChecked) {
        return [...prevSelected, moduleData];
      } else {
        return prevSelected.filter(
          (module: any) => module?.id !== moduleData?.id
        );
      }
    });
  };

  //function to handle category modules checkbox change
  const handleCategoryModulesCheckboxChange = (
    moduleData: any,
    isChecked: boolean
  ) => {
    setSelectedCategoryModules((prevSelected: any) => {
      if (isChecked) {
        return [...prevSelected, moduleData];
      } else {
        return prevSelected.filter(
          (module: any) => module?.id !== moduleData?.id
        );
      }
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  React.useEffect(() => {
    if (allCategories) {
      setSelectedCategory(allCategories[0]);
    }
    console.log("selected modules are", selectedModules);
  }, [allCategories, selectedModules]);

  if (isLoadingAllCategories || loadingModules)
    return <Loader text="Loading categories and modules" />;

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
        {/* SELECT CATEGORIES */}
        <div className="max-w-2xl">
          <label className="text-xs text-slate-700 mb-2">Category</label>
          <Dropdown>
            <DropdownTrigger>
              <button className="outline-none border w-full py-2 px-1 border-[#E2E8F0] bg-[#F8FAFC] text-[#334155] rounded-lg my-1">
                <div className="flex gap-2 w-full justify-between items-center py-0 px-4">
                  <p className=" font-normal text-sm">
                    {selectedCategory?.categoryName}
                  </p>
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
              {allCategories?.map((cat: any) => (
                <DropdownItem
                  key="view"
                  className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                  onClick={() => setSelectedCategory(cat)}
                >
                  <div className="flex w-full items-center justify-between">
                    <p>{cat?.categoryName}</p>
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
              {allModules?.map((module: any, index: number) => {
                let parsedDescription;
                try {
                  parsedDescription = JSON.parse(module?.moduleDescription);
                } catch (error) {
                  parsedDescription = null;
                }

                return (
                  <ModuleCard
                    key={index + "core"}
                    moduleData={module}
                    companyAdminPortal={
                      parsedDescription?.companyAdminPortal ??
                      module?.moduleDescription
                    }
                    clientPortal={
                      parsedDescription?.clientPortal ??
                      module?.moduleDescription
                    }
                    index={index + "core"}
                    onCheckboxChange={handleCoreModulesCheckboxChange}
                  />
                );
              })}
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
              {allModules?.map((module: any, index: number) => {
                let parsedDescription;
                try {
                  parsedDescription = JSON.parse(module?.moduleDescription);
                } catch (error) {
                  parsedDescription = null;
                }

                return (
                  <ModuleCard
                    key={index + "category"}
                    moduleData={module}
                    companyAdminPortal={
                      parsedDescription?.companyAdminPortal ??
                      module?.moduleDescription
                    }
                    clientPortal={
                      parsedDescription?.clientPortal ??
                      module?.moduleDescription
                    }
                    index={index + "core"}
                    onCheckboxChange={handleCategoryModulesCheckboxChange}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyConfig;
