"use client";

import "./index.css";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import React from "react";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import Link from "next/link";
import { toast } from "sonner";
import services from "@/services";
import { useRouter } from "next/navigation";

const CategoryScheme = Yup.object().shape({
    categoryName: Yup.string().required("Category Name is required"),
    categoryDescription: Yup.string().optional(),
});

function AddCategory() {
    const router = useRouter();
    const handleFormSubmit = async (
        values: { categoryName: string; categoryDescription?: string },
        { setSubmitting, resetForm }: FormikHelpers<any>
    ) => {
        const { categoryName, categoryDescription } = values;

        const loading = toast.loading("Creating Category. Please wait...");

        try {
            await services.createCategory({
                id: 0,
                categoryName,
                categoryDescription,
                createdOn: new Date().toISOString(),
                updatedOn: new Date().toISOString(),
            });

            toast.success("Category created successfully!");
            resetForm();
            router.back();
        } catch (error: any) {
            toast.error(
                error?.message || "An error occurred while creating the category."
            );
        } finally {
            toast.dismiss(loading);
            setSubmitting(false);
        }
    };

    return (
        <div className="px-5 pb-20">
            <Formik
                initialValues={{
                    categoryName: "",
                    categoryDescription: "",
                }}
                validationSchema={CategoryScheme}
                onSubmit={handleFormSubmit}
            >
                {({ errors, isSubmitting }) => (
                    <Form>
                        {/* Header */}
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

                        {/* Form Body */}
                        <div className="max-w-2xl rounded-lg py-5 pb-3">
                            {/* Category Name */}
                            <div className="input-holder">
                                <label htmlFor="categoryName">Category Name</label>
                                <Field
                                    id="categoryName"
                                    name="categoryName"
                                    placeholder="Type Category Name here"
                                    style={getStyles(errors, "categoryName")}
                                    className="w-full border border-gray-200 px-4 py-2 rounded-md"
                                />
                                <ShowError name="categoryName" />
                            </div>

                            {/* Category Description */}
                            <div className="input-holder mt-5">
                                <label htmlFor="categoryDescription">Category Description</label>
                                <Field
                                    id="categoryDescription"
                                    as="textarea"
                                    name="categoryDescription"
                                    placeholder="Type Category Description here"
                                    style={getStyles(errors, "categoryDescription")}
                                    className="w-full h-32 resize-none bg-slate-50 border border-slate-200 px-4 py-3 rounded-md"
                                />
                                <ShowError name="categoryDescription" />
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default AddCategory;
