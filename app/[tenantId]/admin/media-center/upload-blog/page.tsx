"use client";

import "./index.css";
import { Field, Form, Formik, FormikHelpers, FormikErrors } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import Link from "next/link";
import { toast } from "sonner";
import services from "@/services";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { IoArrowBackSharp } from "react-icons/io5";
import ThumbnailUpload from "../component/ThumbnailUpload";
import { MdOutlineInsertLink } from "react-icons/md";
import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";

// Define the interface for the form values
interface BlogFormValues {
  altText: string;
  blogHead: string;
  Url: string;
  thumbnail: File | null;
}

// Define the validation schema using Yup
const UploadBlogScheme = Yup.object().shape({
  altText: Yup.string().optional(),
  blogHead: Yup.string().required("News heading is required"),
  Url: Yup.string().url("Invalid URL").required("URL is required"),
});

function UploadBlog() {
  const params = useParams();
  const tenantId = params.tenantId as string;
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const blogType = searchParams.get("type");

  useEffect(() => {}, [blogType]);

  const handleFormSubmit = async (
    values: BlogFormValues,
    { setSubmitting, resetForm }: FormikHelpers<BlogFormValues>
  ) => {
    const { altText, blogHead, Url } = values;
    const formValuesWithThumbnail = { ...values, thumbnail: thumbnail };

    const loading = toast.info("Saving News. Please wait...");

    try {
      const formData = new FormData();
      formData.append("mediaType", blogType || "BLOGS");
      formData.append("altText", altText || "");
      formData.append("heading", blogHead || "");
      formData.append("url", Url || "");
      formData.append("isActive", String(isActive));

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      await services.mediaUpload(formData);
      toast.success("News uploaded successfully!");
      resetForm();
      setThumbnail(null);
      router.push(`/${tenantId}/admin/media-center`);
    } catch (error) {
      console.error("Error uploading News:", error);
      toast.error("An error occurred while uploading the News.");
    } finally {
      setSubmitting(false);
      toast.dismiss(loading);
    }
  };

  return (
    <div className="px-5 pb-20">
      <Formik
        initialValues={{
          altText: "",
          blogHead: "",
          Url: "",
          thumbnail: thumbnail,
        }}
        validationSchema={UploadBlogScheme}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {/* Header */}
            <div className="w-full text-primary-dark flex pt-4 justify-between">
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <Link
                    href={`/${tenantId}/admin/media-center`}
                    className="bg-white border border-gray-200 flex items-center justify-center text-black text-sm p-2 hover:bg-gray-100 hover:opacity-95 gap-2 rounded-xl"
                  >
                    <IoArrowBackSharp />
                  </Link>
                  <h3 className="font-semibold text-xl">Upload News</h3>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href={`/${tenantId}/admin/media-center`}>
                  <button
                    type="button"
                    className="bg-gray-50 border border-gray-200 shadow-sm py-2 flex text-primary-dark text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                  >
                    Cancel
                  </button>
                </Link>
                <CompanyThemedButton
                  type="submit"
                  disabled={isSubmitting}
                  className="disabled:bg-gray-400 h-10 flex items-center justify-center text-white text-sm px-4 hover:opacity-95 gap-2 rounded-xl"
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
                </CompanyThemedButton>
              </div>
            </div>

            {/* Form Body */}
            <div className="max-w-2xl rounded-lg py-5 pb-3">
              <div className="">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  News Thumbnail
                </label>
                <ThumbnailUpload onImageChange={setThumbnail} />
              </div>

              {/* Blog Heading */}
              <div className="input-holder">
                <label
                  htmlFor="blogHead"
                  className="flex justify-between items-center"
                >
                  News Heading
                </label>
                <Field
                  id="blogHead"
                  name="blogHead"
                  placeholder="Type description here"
                  style={getStyles(errors, "blogHead")}
                  className="w-full border border-gray-200 px-4 py-2 rounded-md"
                />
                <ShowError name="blogHead" />
              </div>

              {/* URL */}
              <div className="input-holder relative">
                <label htmlFor="Url">URL</label>
                <div className="relative w-full">
                  <Field
                    id="Url"
                    name="Url"
                    placeholder="Paste link here"
                    style={getStyles(errors, "Url")}
                    className="w-full px-4 py-2 rounded-md pr-10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    <MdOutlineInsertLink size={24} />
                  </div>
                </div>
                <ShowError name="Url" />
              </div>

              {/* Alt Text */}
              <div className="input-holder">
                <label
                  htmlFor="altText"
                  className="flex justify-between items-center"
                >
                  Alt Text
                  <span className="text-sm text-gray-500 ml-2">Optional</span>
                </label>
                <Field
                  id="altText"
                  name="altText"
                  placeholder="Type alternate text here"
                  style={getStyles(errors, "altText")}
                  className="w-full border border-gray-200 px-4 py-2 rounded-md"
                />
                <ShowError name="altText" />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default UploadBlog;
