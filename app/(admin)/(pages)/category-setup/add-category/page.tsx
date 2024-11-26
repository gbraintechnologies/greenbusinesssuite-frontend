"use client";

import "./index.css";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import Link from "next/link";
import CardDescription from "../components/CustomCard";
import { LuPlusCircle } from "react-icons/lu";

const CategoryScheme = Yup.object().shape({
    categoryName: Yup.string().required("Required"),
    categoryDescription: Yup.string(),
});

function AddCategory() {

    const handleFormSubmit = (values: any) => {
        console.log("Form submitted with values:", values);
        // alert(JSON.stringify(values))
    };

    return (
        <div>
            <div className="px-5 pb-20">
                <Formik
                    initialValues={{
                        categoryName: "",
                        categoryDescription: "",
                    }}
                    validationSchema={CategoryScheme}
                    onSubmit={handleFormSubmit}
                >
                    {({ errors, isSubmitting }) => {
                        return (
                            <Form>
                                {/* HEADER */}
                                <div className="w-full text-primary-dark flex justify-between">
                                    {/* HEADER */}
                                    <div>
                                        <h3 className="font-semibold text-xl mb-10">Create Category</h3>
                                        <p className="font-semibold text-lg">Category Details</p>
                                    </div>

                                    {/* ACTION BUTTONS */}
                                    <div className="flex gap-3">
                                        <Link href="/category-setup">
                                            <button
                                                type="button"
                                                className="bg-gray-50 border border-gray-200 shadow-sm py-2 flex text-primary-dark text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                                            >
                                                Cancel
                                            </button>
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-primary-green disabled:bg-gray-400 h-10 flex items-center justify-center text-white text-sm px-4 hover:opacity-95 gap-2 rounded-xl"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <LoadingIcon />
                                                    Saving
                                                </>
                                            ) : (
                                                <>
                                                    <HiOutlineInboxArrowDown /> Save
                                                </>
                                            )}
                                        </button>

                                    </div>
                                </div>


                                {/* BODY */}
                                <div className="max-w-2xl rounded-lg py-5 pb-3">
                                    {/* Category NAME */}
                                    <div className="input-holder">
                                        <label>Category Name</label>
                                        <Field
                                            style={getStyles(errors, "categoryName")}
                                            name="categoryName"
                                            placeholder="Type Category Name here"
                                        />
                                        <ShowError name="categoryName" />
                                    </div>

                                    {/* Category DESCRIPTION */}
                                    <div className="input-holder">
                                        <label>Category Description</label>
                                        <Field
                                            style={getStyles(errors, "categoryDescription")}
                                            as="textarea"
                                            className="h-32 resize-none bg-slate-50 border-1 border-slate-200 px-4 py-3"
                                            name="categoryDescription"
                                            placeholder="Type Category Description here"
                                        />
                                        <ShowError name="categoryDescription" />
                                    </div>
                                </div>
                                {/* PERMISSIONS */}
                                <div className="max-w-full">
                                    <div>
                                        <h3 className="font-semibold text-xl">Core Modules</h3>
                                        <p className="text-gray-400 text-sm">
                                            Core Modules that apply to all categories
                                        </p>
                                    </div>
                                    <div className="w-full p-6 grid grid-cols-3 gap-6">
                                        <CardDescription
                                            name="Dashboard"
                                            description={[
                                                "Company Admin: View Analytics and metrics of the company",
                                            ]}
                                        />
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
                                    <div>
                                        <div className="w-full text-[#0F172A] px-5 flex justify-between mt-10">
                                            <div>
                                                <h3 className="font-semibold text-xl">Category-Specific Modules</h3>
                                                <p className="text-gray-400 text-sm">
                                                    Modules tailor-made for specific categories
                                                </p>
                                            </div>
                                            <div>
                                                <Link href="/category-setup/create-module" className="bg-primary-green flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl">
                                                    <LuPlusCircle /> Create new Module
                                                    <div className="border-opacity-50 border-white h-10"></div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
}

export default AddCategory;
