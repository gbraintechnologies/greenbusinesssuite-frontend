"use client";

import "./index.css";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import Link from "next/link";
import { toast } from "sonner";
import services from "@/services";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { IoArrowBack } from "react-icons/io5";

const CategoryScheme = Yup.object().shape({
  id: Yup.number(),
  categoryName: Yup.string(),
  categoryDescription: Yup.string(),
});

interface Category {
  id: number;
  categoryName: string;
  categoryDescription: string;
}

function EditCategory() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const { data, isLoading, isError } = useQuery<Category, Error>({
    queryKey: ["category", categoryId],
    queryFn: () => services.getSpecificCategoryByID(Number(categoryId)),
    enabled: !!categoryId,
  });

  useEffect(() => {}, [data]);

  const router = useRouter();

  const handleFormSubmit = async (
    values: { categoryName: string; categoryDescription?: string },
    { setSubmitting, resetForm }: FormikHelpers<any>
  ) => {
    const { categoryName, categoryDescription } = values;

    const loading = toast.loading("Updating Category. Please wait...");

    try {
      if (data) {
        await services.updateSpecificCategory({
          id: data.id,
          categoryName,
          categoryDescription,
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
          categorySpecificModules: [],
        });

        toast.success("Category updated successfully!");
        resetForm();
        router.back();
      }
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while updating the category."
      );
    } finally {
      toast.dismiss(loading);
      setSubmitting(false);
    }
  };

  if (isLoading) return <LoadingIcon />;
  if (isError || !data) return <p>Something went wrong, please try again.</p>;

  return (
    <div className="px-5 pb-20">
      <Formik
        initialValues={{
          categoryName: data?.categoryName || "",
          categoryDescription: data?.categoryDescription || "",
        }}
        validationSchema={CategoryScheme}
        onSubmit={handleFormSubmit}
        enableReinitialize={true}
      >
        {({ errors, isSubmitting }) => (
          <Form>
            {/* Header */}
            <div className="w-full text-primary-dark flex justify-between">
              <div>
                <div className="flex items-center mb-10 gap-3">
                  <button
                    onClick={() => router.back()}
                    type="button"
                    className="bg-white border border-[#CBD5E1] shadow-sm p-2 flex text-[#334155] text-sm  hover:opacity-95 items-center gap-2 rounded-xl"
                  >
                    <IoArrowBack />
                    {/* Back */}
                  </button>
                  <h3 className="font-semibold text-xl">Edit Category</h3>{" "}
                </div>
                <p className="font-semibold text-lg">Category Details</p>
              </div>
              <div className="flex gap-3">
                <Link href="/category-setup/category-details">
                  <button
                    onClick={() => router.back()}
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
                      <HiOutlineInboxArrowDown /> Save Changes
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

              <div className="input-holder mt-5">
                <label htmlFor="categoryDescription">
                  Category Description
                </label>
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

export default EditCategory;
