"use client";
import React from "react";
import CardDescription from "../components/CustomCard";
import Link from "next/link";
import { LuPlusCircle } from "react-icons/lu";
import { IoArrowBackSharp } from "react-icons/io5";


function CreateModule() {

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
                    <Link href={"/category-setup/1"}>
                    <CardDescription
                        name="Dashboard"
                        description={[
                            "Company Admin: View Analytics and metrics of the company",
                        ]}
                    />
                    </Link>
                    <CardDescription
                        name="Documents"
                        description={[
                            "Company Admin: Upload and assign documents to users.",
                            "Client Portal: View and download assigned documents.",
                        ]}
                    />
                    <CardDescription
                        name="Notifications"
                        description={[
                            "Company Admin: Send messages SMS,email or in-app.",
                            "Client Portal: View in-app messages.",
                        ]}
                    />
                    <CardDescription
                        name="User Management"
                        description={[
                            "Company Admin: Manage users and roles in the company.",
                        ]}
                    />
                    <CardDescription
                        name="Form Builder"
                        description={[
                            "Company Admin: Create and publish forms and surveys.",
                            "Client Portal: View and fill published forms and surveys.",
                        ]}
                    />
                    <CardDescription
                        name="Support and Help"
                        description={[
                            "Company Admin: Create and publish FAQs.",
                            "Client Portal: View FAQs and send concerns to customer service.",
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

export default CreateModule;
