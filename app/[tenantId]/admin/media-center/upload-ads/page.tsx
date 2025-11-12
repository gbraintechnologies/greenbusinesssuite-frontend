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
import { IoArrowBackSharp } from "react-icons/io5";
import ThumbnailUpload from "../component/ThumbnailUpload";
import { MdOutlineInsertLink } from "react-icons/md";
import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";

const UploadAdScheme = Yup.object().shape({
  altText: Yup.string().optional(),
  adDescription: Yup.string(),
  Url: Yup.string().url("Invalid URL").optional(),
});

interface AdFormValues {
  altText: string;
  adDescription: string;
  Url: string;
  thumbnail: File | null;
}

function UploadAds({ params }: any) {
  const tenantId = params.tenantId;
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const adType = searchParams.get("type");

  useEffect(() => {}, [adType]);

  const handleFormSubmit = async (
    values: AdFormValues,
    { setSubmitting, resetForm }: FormikHelpers<AdFormValues>
  ) => {
    const { altText, adDescription, Url } = values;
    const formValuesWithThumbnail = { ...values, thumbnail: thumbnail };

    const loading = toast.info("Saving AD. Please wait...");

    try {
      const formData = new FormData();
      formData.append("mediaType", adType || "ADS");
      formData.append("altText", altText || "");
      formData.append("heading", adDescription || "");
      formData.append("url", Url || "");
      formData.append("isActive", String(isActive));

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      await services.mediaUpload(formData);
      toast.success("AD uploaded successfully!");
      resetForm();
      setThumbnail(null);
      router.push(`/${tenantId}/admin/media-center`);
    } catch (error) {
      console.error("Error uploading AD:", error);
      toast.error("An error occurred while uploading the AD.");
    } finally {
      setSubmitting(false);
      toast.dismiss(loading);
    }
  };

  return (
    <div className="px-5 pb-20">
      <Formik
        initialValues={{
          adDescription: "",
          altText: "",
          Url: "",
          thumbnail: thumbnail,
        }}
        validationSchema={UploadAdScheme}
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
                    className="bg-white border border-gray-200 flex items-center justify-center text-black text-sm p-2 hover:bg-gray-100 hover:opacity-95  gap-2 rounded-xl"
                  >
                    <IoArrowBackSharp />
                  </Link>
                  <h3 className="font-semibold text-xl">Upload Ads</h3>
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

            <div className="max-w-2xl rounded-lg py-5 pb-3">
              <div className="">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Ad Thumbnail
                </label>
                <ThumbnailUpload onImageChange={setThumbnail} />
              </div>

              <div className="input-holder mt-5">
                <label htmlFor="adDescription">Ad Description</label>
                <Field
                  id="adDescription"
                  as="textarea"
                  name="adDescription"
                  placeholder="Type Description here"
                  style={getStyles(errors, "adDescription")}
                  className="w-full h-32 resize-none bg-slate-50 border border-slate-200 px-4 py-3 rounded-md"
                />
                <ShowError name="categoryDescription" />
              </div>

              <div className="input-holder">
                <label
                  htmlFor="altext"
                  className="flex justify-between items-center"
                >
                  Alt Text
                  <span className="text-sm text-gray-500 ml-2">Optional</span>
                </label>
                <Field
                  id="altext"
                  name="altext"
                  placeholder="Type alternate here"
                  style={getStyles(errors, "altext")}
                  className="w-full border border-gray-200 px-4 py-2 rounded-md"
                />
                <ShowError name="altext" />
              </div>

              <div className="input-holder relative">
                <label
                  htmlFor="Url"
                  className="flex justify-between items-center"
                >
                  URL
                  <span className="text-sm text-gray-500 ml-2">Optional</span>
                </label>
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
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default UploadAds;
