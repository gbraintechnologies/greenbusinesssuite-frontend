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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { IoArrowBackSharp } from "react-icons/io5";
import ThumbnailUpload from "../component/ThumbnailUpload";
import { MdOutlineInsertLink } from "react-icons/md";
import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import { useQuery } from "@tanstack/react-query";
import { S3BucketFileUpload } from "@/services/features/mediaService";

const UploadAdScheme = Yup.object().shape({
  altText: Yup.string().optional(),
  adDescription: Yup.string(),
  Url: Yup.string().url("Invalid URL").optional(),
});

function EditAd() {
  const params = useParams();
  const tenantId = params.tenantId as string;
  const router = useRouter();
  const searchParams = useSearchParams(); // Access the search params
  const AdId = searchParams.get("id");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["mediaType", AdId],
    queryFn: services.getMediaTypeByID(Number(AdId)),
    enabled: !!AdId,
  });

  useEffect(() => {}, [data, refetch]);

  const handleFormSubmit = async (
    values: {
      altText: string;
      adDescription?: string;
      Url?: string;
      thumbnail?: File | null;
    },
    { setSubmitting }: FormikHelpers<any>
  ) => {
    const { altText, adDescription, Url, thumbnail } = values;
    const loading = toast.info("Updating Ad. Please wait...");

    try {
      let thumbnailUrl = data?.thumbnail || "";

      if (thumbnail && thumbnail !== data?.thumbnail) {
        const formData = new FormData();
        formData.append("file", thumbnail);

        const response = await S3BucketFileUpload(formData, thumbnail.name);

        if (response?.data) {
          thumbnailUrl = response.data;
          console.log("Uploaded thumbnail URL:", thumbnailUrl);
        } else {
          console.error("No URL returned from S3 upload");
        }
        toast.success("Thumbnail uploaded successfully!");
      }

      const payload = {
        id: Number(AdId),
        mediaType: "ADS",
        thumbnail: thumbnailUrl,
        altText: altText || "",
        heading: adDescription || "",
        url: Url || "",
        isActive: data?.isActive,
        updatedOn: new Date().toISOString(),
      };
      await services.updateMediaType(payload);
      toast.success("Ad updated successfully!");

      router.push(`/${tenantId}/admin/media-center`);
    } catch (error) {
      console.error("Error uploading Ad:", error);
      toast.error("An error occurred while saving the Ad.");
    } finally {
      setSubmitting(false);
      toast.dismiss(loading);
    }
  };

  if (isLoading) return <LoadingIcon />;

  return (
    <div className="px-5 pb-20">
      <Formik
        initialValues={{
          altText: data?.altText || "",
          adDescription: data?.heading || "",
          Url: data?.url || "",
          thumbnail: data?.thumbnail || "",
        }}
        validationSchema={UploadAdScheme}
        onSubmit={handleFormSubmit}
      >
        {({ errors, isSubmitting, setFieldValue }) => (
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
                  <h3 className="font-semibold text-xl">Edit Ad</h3>
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
                      <HiOutlineInboxArrowDown /> Save Changes
                    </>
                  )}
                </CompanyThemedButton>
              </div>
            </div>

            {/* Form Body */}
            <div className="max-w-2xl rounded-lg py-5 pb-3">
              <div className="">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Ad Thumbnail
                </label>
                <ThumbnailUpload
                  initialImage={data?.thumbnail}
                  onImageChange={(file: File | null) => {
                    setFieldValue("thumbnail", file);
                  }}
                />
              </div>

              {/* Category Description */}
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
                <ShowError name="adDescription" />
              </div>

              <div className="input-holder">
                <label
                  htmlFor="altText"
                  className="flex justify-between items-center"
                >
                  Alt Text
                  {/* Optional text aligned to the right */}
                  <span className="text-sm text-gray-500 ml-2">Optional</span>
                </label>
                <Field
                  id="altText"
                  name="altText"
                  placeholder="Type alternate here"
                  style={getStyles(errors, "altText")}
                  className="w-full border border-gray-200 px-4 py-2 rounded-md"
                />
                <ShowError name="altText" />
              </div>

              <div className="input-holder relative">
                <label
                  htmlFor="Url"
                  className="flex justify-between items-center"
                >
                  URL
                  {/* Optional text aligned to the right */}
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

export default EditAd;
