"use client";
import React, { useEffect, useState } from "react";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// formik
import { Formik, Field, Form } from "formik";

import BigUserIcon from "@/public/icons/BigUserIcon";
//
import { MdOutlineEdit } from "react-icons/md";

// icons
import { HiOutlineInboxArrowDown } from "react-icons/hi2";

import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

import * as Yup from "yup";

import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import toast from "react-hot-toast";

// hooks
import useFileUpload from "@/hooks/useFileUpload";
import Image from "next/image";

//
import "../new-user/index.css";

function page() {
  const search = useSearchParams();
  const router = useRouter();

  const { handleFileUpload, loadingFile } = useFileUpload();

  const [loading, setLoading] = useState(false);

  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  const id = search.get("id");

  const { data, isLoading } = useQuery({
    queryKey: ["all users"],
    queryFn: services.userByID(id),
  });

  const UserSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    lastname: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email address is required"),
  });

  const inputFileRef = React.useRef();

  const editUser = async (values: any, resetForm: any) => {
    let data = {
      email: values.email,
      username: values.firstname.toLowerCase() + values.lastname.toLowerCase(),
      first_name: values.firstname,
      last_name: values.lastname,
      phone_number: phone,
      mobile_phone_number: phone,
      user_status: "ACTIVE",
    };

    let loading = toast.loading("Creating user. Please wait...");

    // upload image first, then use image url when creating user
    const profilePicURL =
      profileImage && (await handleFileUpload(profileImage as File));

    const custom_profiles = [
      {
        custom_profile_item_id: 1,
        value: profilePicURL?.file_url || "",
      },
    ];

    setLoading(true);
    services
      .editUserWithCustomProfiles(data, custom_profiles)
      .then((res: any) => {
        setLoading(false);

        // ASSIGN ROLE TO CREATED USER
        services
          //@ts-ignore
          .assignRoleToUser(res.data.id, selectedRole?.value)
          .then((res) => {
            toast.dismiss(loading);
            resetForm();
            setProfileImage(null);
            setPhone("");
            setSelectedRole(null);
            toast.success("Edited user successfully");
          })
          .catch((e: any) => {
            toast.error("Error occured");
            console.log("error asinging", e);
          });
      })
      .catch((e) => {
        setLoading(false);
        toast.dismiss(loading);
        toast.dismiss();

        if (Array.isArray(e?.response?.data?.detail)) {
          e?.response?.data?.detail?.map((error: any) => {
            toast.error(error.msg);
          });
        } else {
          toast.error(e?.response?.data?.detail);
        }
      });
  };

  if (isLoading) {
    return (
      <div>
        <LoadingIcon />
      </div>
    );
  }

  if (data) {
    // formik
    let initialValues = {
      email: data?.email,
      username: data?.username,
      firstname: data?.first_name,
      lastname: data?.last_name,
      status: data?.user_status,
    };

    return (
      <div className="pb-40 px-5">
        {/* Form */}
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            editUser(values, resetForm);
          }}
          validationSchema={UserSchema}
        >
          {({ errors }) => (
            <Form>
              {/* HEADER */}
              <div className="w-full text-primary-dark  flex justify-between">
                <h3 className="font-semibold text-xl">Edit user account</h3>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-gray-50 border border-gray-200 shadow-sm py-2 flex text-primary-dark text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                  >
                    {loading ? (
                      <>
                        <LoadingIcon />
                        Saving
                      </>
                    ) : (
                      <>
                        {" "}
                        <HiOutlineInboxArrowDown /> Apply Edits
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* profile picture */}
              <div className="relative w-[140px] h-[140px] rounded-full">
                {profileImage ? (
                  <div className="rounded-full overflow-hidden w-[140px] h-[140px]">
                    <Image
                      src={URL.createObjectURL(profileImage)}
                      alt="profile"
                      width={140}
                      height={140}
                      className="rounded-full h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded-full  flex items-center justify-center w-[140px] h-[140px] bg-slate-50">
                    <BigUserIcon />
                  </div>
                )}

                <input
                  type="file"
                  // @ts-ignore
                  ref={inputFileRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    setProfileImage(e.target.files && e.target.files[0]);
                  }}
                />

                <button
                  type="button"
                  onClick={() => {
                    // @ts-ignore
                    inputFileRef?.current?.click();
                  }}
                  className="absolute flex items-center gap-1 border hover:bg-gray-100 border-gray-300 text-sm bg-white rounded-lg px-3 py-1 bottom-4 -right-8"
                >
                  <MdOutlineEdit />
                  Edit
                </button>
              </div>

              {/* FORM */}
              <div className="max-w-2xl rounded-lg py-5 pb-10">
                {/* NAME */}
                <div className="flex gap-10">
                  <div className="input-holder">
                    <label>First name</label>
                    <Field
                      style={getStyles(errors, "firstname")}
                      name="firstname"
                      placeholder="First name"
                    />{" "}
                    <ShowError name="firstname" />
                  </div>

                  <div className="input-holder">
                    <label>Last name</label>
                    <Field
                      style={getStyles(errors, "lastname")}
                      name="lastname"
                      placeholder="Last name"
                    />
                    <ShowError name="lastname" />
                  </div>
                </div>

                {/* Email */}
                <div className="input-holder">
                  <label>Email</label>
                  <Field
                    style={getStyles(errors, "lastname")}
                    name="email"
                    placeholder="Email"
                  />
                  <ShowError name="email" />
                </div>

                {/* Phone */}
                {/* <div className="input-holder">
                <label>Phone number</label>
                <div className="w-[50%]">
                  <PhoneSelector phone={phone} setPhone={setPhone} />
                </div>
              </div>

              <div className="input-holder">
                <label>Roles</label>
                <Dropdown
                  selected={selectedRole}
                  setSelected={setSelectedRole}
                  options={roles}
                />
              </div> */}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default page;
