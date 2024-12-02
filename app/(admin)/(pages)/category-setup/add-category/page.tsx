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
import SwitchButton from "../components/SwitchButton";

const CategoryScheme = Yup.object().shape({
    categoryName: Yup.string().required("Required"),
    categoryDescription: Yup.string(),
    moduleName: Yup.string(),
    moduleType: Yup.string(),
    moduleDescription: Yup.string()
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
                        moduleName: "",
                        moduleType: "",
                        moduleDescription: "",
                        isTemplate: false,
                    }}
                    validationSchema={CategoryScheme}
                    onSubmit={handleFormSubmit}
                >
                    {({ errors, isSubmitting, setFieldValue, values }) => {
                        return (
                            <Form>
                                <div className="w-full text-primary-dark flex justify-between">
                                    <div>
                                        <h3 className="font-semibold text-xl mb-10">Create Category</h3>
                                        <p className="font-semibold text-lg">Category Details</p>
                                    </div>
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
                                    <div>
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
