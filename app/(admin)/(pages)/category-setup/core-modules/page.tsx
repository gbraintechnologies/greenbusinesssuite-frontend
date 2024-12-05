"use client";
import React, { useEffect } from "react";
import CardDescription from "../components/CustomCard";
import Link from "next/link";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoArrowBackSharp } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

function CreateModule() {
  const { data: modules } = useQuery({
    queryKey: ["all_modules"],
    queryFn: services.getAllCoreModules(),
  });

  useEffect(() => { }, [modules]);

  return (
    <div className="w-full px-5 pb-20 py-5">
      <div className="w-full text-primary-dark flex justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/category-setup"
            className="bg-white border border-gray-200 flex justify-center text-black text-sm p-2 hover:bg-gray-100 hover:opacity-95 items-center gap-2 rounded-xl"
          >
            <IoArrowBackSharp />
          </Link>
          <h3 className="font-semibold text-2xl my-4">Core Modules</h3>
        </div>

        <div>
          <Link
            href="/category-setup/core-modules/create"
            className="bg-primary-green flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
          >
            <IoIosAddCircleOutline /> Create new module
            <div className="border-opacity-50 border-white h-10"></div>
          </Link>
        </div>
      </div>

      <div className="max-w-full">
        <div className="w-full py-6 grid grid-cols-3 gap-6">
          {modules &&
            modules.map((item: any) => (
              <Link
                key={item.id}
                href={`/category-setup/core-modules/${item.id}`} // Pass the category id as a query parameter
              >
                <CardDescription
                  name={item.moduleName || "Unnamed Module"} // Fallback for missing moduleName
                  description={[
                    item.adminFeatures ? `Company Admin: ${item.adminFeatures}` : "",
                    item.clientFeatures ? `Client Portal: ${item.clientFeatures}` : "",
                  ].filter(Boolean)} // Add prefixes and filter out empty stringsFilter out empty strings or falsy values
                />
              </Link>
            ))}
        </div>

      </div>
    </div>
  );
}

export default CreateModule;
