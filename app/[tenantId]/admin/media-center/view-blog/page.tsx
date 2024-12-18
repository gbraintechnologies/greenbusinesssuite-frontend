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
import { MdOutlineInsertLink } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import { useQuery } from "@tanstack/react-query";
import { changeStatus } from "@/services/features/mediaService";
import { FormatDateWithDayShort } from "@/utils/FormatDate/FormatDate";

const UploadBlogScheme = Yup.object().shape({
  altText: Yup.string().optional(),
  blogHead: Yup.string(),
  Url: Yup.string().url("Invalid URL").optional(),
});

function ViewBlog({ params }: any) {
  const tenantId = params.tenantId;
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["mediaType", blogId],
    queryFn: services.getMediaTypeByID(Number(blogId)),
    enabled: !!blogId,
  });

  const [isActivated, setIsActivated] = useState(data?.isActive);

  useEffect(() => {
  }, [data, refetch]);


  const toggleStatus = async () => {
    try {
      const newStatus = !isActivated;
      setIsActivated(newStatus);

      await changeStatus(data?.id, newStatus);
      toast.success(`Blog has been ${newStatus ? "activated" : "deactivated"} successfully!`);
      refetch();
    } catch (error) {
      toast.error("An error occurred while updating the blog status.");
    }
  };


  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="px-5 pb-20">
      <Formik
        initialValues={{
          altText: data?.altText || "",
          blogHead: data?.heading || "",
          Url: data?.url || "",
          thumbnail: null,
        }}
        validationSchema={UploadBlogScheme}
        onSubmit={() => { }}
      >
        {({ errors, isSubmitting }) => (
          <Form>
            <div className="w-full text-primary-dark flex pt-4 justify-between">
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <Link
                    href={`/${tenantId}/admin/media-center`}
                    className="bg-white border border-gray-200 flex items-center justify-center text-black text-sm p-2 hover:bg-gray-100 hover:opacity-95  gap-2 rounded-xl"
                  >
                    <IoArrowBackSharp />
                  </Link>
                  <h3 className="font-semibold text-xl">View Blog</h3>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href={`/${tenantId}/admin/media-center/edit-blog?id=${data?.id}`}>
                  <button
                    type="button"
                    className="bg-gray-50 border border-gray-200 shadow-sm py-2 flex text-primary-dark text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                  >
                    <FaRegEdit /> Edit
                  </button>
                </Link>
                <CompanyThemedButton
                  type="button"
                  onClick={toggleStatus}
                  className="disabled:bg-gray-400 h-10 flex items-center justify-center text-white text-sm px-4 hover:opacity-95 gap-2 rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingIcon />
                      Activating
                    </>
                  ) : (
                    <>
                      <HiOutlineInboxArrowDown /> {isActivated ? "Deactivate" : "Activate"}
                    </>
                  )}
                </CompanyThemedButton>

              </div>
            </div>

            {/* Form Body */}
            <div className="max-w-2xl rounded-lg py-5 pb-3">
              {/* Thumbnail Section */}
              <div className="relative w-full h-[10rem] rounded-t-lg overflow-hidden cursor-pointer">
                <img
                  src={data?.thumbnail}
                  alt={data?.heading}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4">
                <div className="font-bold">{data?.heading}</div>
                <div className="flex items-center text-sm mt-2">
                  <span
                    className={`${data?.isActive ? "text-green-500" : "text-red-500"
                      } font-semibold`}
                  >
                    {data?.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="ml-4">{FormatDateWithDayShort(data?.createdOn)}</span>
                </div>
              </div>

              {/* URL Section */}
              <div className="input-holder relative mt-6">
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
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ViewBlog;
