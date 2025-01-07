"use client";

import "./index.css";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import React, { useEffect } from "react";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import Link from "next/link";
import { toast } from "sonner";
import services from "@/services";
import { useRouter, useSearchParams } from "next/navigation";
import { IoArrowBackSharp } from "react-icons/io5";
import ThumbnailUpload from "../component/ThumbnailUpload";
import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import { useQuery } from "@tanstack/react-query";
import { S3BucketFileUpload } from "@/services/features/mediaService";
import { MdOutlineInsertLink } from "react-icons/md";

const UploadBlogScheme = Yup.object().shape({
  altText: Yup.string().optional(),
  blogHead: Yup.string().required("Blog Heading is required"),
  Url: Yup.string().url("Invalid URL").optional(),
  thumbnail: Yup.mixed().required("Thumbnail is required") // Ensure thumbnail is required
});

function EditBlog({ params }: any) {
  const tenantId = params.tenantId;
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");

  const { data, isLoading } = useQuery({
    queryKey: ["mediaType", blogId],
    queryFn: services.getMediaTypeByID(Number(blogId)),
    enabled: !!blogId,
  });

  useEffect(() => { }, [data]);

  const handleFormSubmit = async (
    values: { altText: string; blogHead?: string; Url?: string; thumbnail?: File | null },
    { setSubmitting }: FormikHelpers<any>
  ) => {
    const { altText, blogHead, Url, thumbnail } = values;
    const loading = toast.loading("Updating Blog. Please wait...");

    try {
      let thumbnailUrl = data?.thumbnail || "";

      if (thumbnail && thumbnail !== data?.thumbnail) {
        const formData = new FormData();
        formData.append("file", thumbnail);

        console.log("FormData being sent to S3:", formData);
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
        id: Number(blogId),
        mediaType: "BLOGS",
        thumbnail: thumbnailUrl,
        altText: altText || "",
        heading: blogHead || "",
        url: Url || "",
        isActive: data?.isActive,
        updatedOn: new Date().toISOString(),
      };

      await services.updateMediaType(payload);
      toast.success("Blog updated successfully!");

      router.push(`/${tenantId}/admin/media-center`);
    } catch (error) {
      console.error("Error uploading blog:", error);
      toast.error("An error occurred while saving the blog.");
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
          blogHead: data?.heading || "",
          Url: data?.url || "",
          thumbnail: data?.thumbnail || "", // Initialize as the existing thumbnail
        }}
        enableReinitialize
        validationSchema={UploadBlogScheme}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting, setFieldValue, errors }) => (
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
                  <h3 className="font-semibold text-xl">Edit News</h3>
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

            <div className="max-w-2xl rounded-lg py-5 pb-3">
              <div className="">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  News Thumbnail
                </label>
                <ThumbnailUpload
                  initialImage={data?.thumbnail} 
                  onImageChange={(file: File | null) => {
                    setFieldValue("thumbnail", file);
                  }}
                />
              </div>

              <div className="input-holder">
                <label htmlFor="blogHead">News Heading</label>
                <Field id="blogHead" name="blogHead" className="w-full px-4 py-2 rounded-md" />
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
                <label htmlFor="altText">Alt Text</label>
                <Field id="altText" name="altText" className="w-full px-4 py-2 rounded-md" />
                <ShowError name="altText" />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EditBlog;
