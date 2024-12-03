"use client";
import React, { useEffect } from "react";
import CardDescription from "../components/CustomCard";
import Link from "next/link";
import { LuPlusCircle } from "react-icons/lu";
import { IoArrowBackSharp } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";


function CreateModule() {

    const { data: modules } = useQuery({
        queryKey: ["all_modules"],
        queryFn: services.getAllModules,
    });

    useEffect(() => {
    }, [modules]);

    return (
        <div className="w-full px-5 pb-20 py-5">
            <div className="w-full text-primary-dark flex justify-between">
                <div>
                    <h3 className="font-semibold text-xl mb-10">Core Modules</h3>
                </div>
                <div>
                    <Link href="/category-setup/core-modules/create" className="bg-primary-green flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl">
                        <LuPlusCircle /> Create new module
                        <div className="border-opacity-50 border-white h-10"></div>
                    </Link>

                </div>
            </div>
            <div>
                <Link
                    href="/category-setup"
                    className="bg-white border border-gray-200 flex text-black text-sm px-2 hover:bg-gray-100 py-1 hover:opacity-95 items-center gap-2 rounded-xl w-24"
                >
                    <IoArrowBackSharp />&nbsp;Back
                    <div className="border-opacity-50 border-white h-10"></div>
                </Link>
            </div>
            <div className="max-w-full">
                <div className="w-full p-6 grid grid-cols-3 gap-6">
                    {modules && modules.map((item: any) => (
                        <Link
                            key={item.id}
                            href={`/category-setup/core-modules/${item.id}`} // Pass the category id as a query parameter
                        >
                            <CardDescription
                                name={item.moduleName}
                                description={item.moduleDescription}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CreateModule;
