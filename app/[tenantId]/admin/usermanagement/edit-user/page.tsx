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
import { toast } from "sonner";

// hooks
import useFileUpload from "@/hooks/useFileUpload";
import Image from "next/image";

import UserForm from "../components/UserForm";
import Modal from "@/components/Modal/Modal";

import "./index.css";

function page() {
  const search = useSearchParams();
  const router = useRouter();

  const { handleFileUpload, loadingFile } = useFileUpload();

  const [loading, setLoading] = useState(false);

  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [roleId, setRoleId] = useState("");

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

  const [profilePic, setProfilePic] = useState("");

  const [initialValues, setInitialValues] = useState({
    email: "",
    firstname: "",
    lastname: "",
  });

  useEffect(() => {
    setRoleId(data?.profiles?.length > 0 && data?.profiles[0]?.role_id);

    let values = {
      email: data?.email,
      username: data?.username,
      firstname: data?.first_name,
      lastname: data?.last_name,
      status: data?.user_status,
    };

    setInitialValues(values);

    let phone = data?.phone_number;
    phone?.charAt(0) == "0" ? (phone = phone.replace("0", "233")) : phone;
    setPhone(phone);

    setProfilePic(
      data?.custom_profile_values?.find(
        (item: any) => item?.custom_profile_item_id === 1
      )?.value
    ); // For Profile Picture
  }, [data]);

  const inputFileRef = React.useRef();

  const editUser = async (values: any, resetForm: any) => {
    let finalData = {
      email: values.email,
      username: values.firstname.toLowerCase() + values.lastname.toLowerCase(),
      first_name: values.firstname,
      last_name: values.lastname,
      phone_number: phone,
      mobile_phone_number: phone,
      user_status: data?.user_status,
    };

    let loading = toast.loading("Editing user. Please wait...");

    // upload image first, then use image url when creating user
    const profilePicURL =
      profileImage && (await handleFileUpload(profileImage as File));

    const custom_profiles = [
      {
        custom_profile_item_id: 1,
        value: profileImage ? profilePicURL?.file_url : profilePic,
      },
    ];

    setLoading(true);
    services
      .editUserWithCustomProfiles(id, finalData, custom_profiles)
      .then((res: any) => {
        setLoading(false);

        // ASSIGN ROLE TO CREATED USER
        services
          //@ts-ignore
          .assignRoleToUser(res.data.id, selectedRole?.value)
          .then((res) => {
            toast.dismiss(loading);
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
        console.log("error ", e);

        if (Array.isArray(e?.response?.data?.detail)) {
          e?.response?.data?.detail?.map((error: any) => {
            toast.error(error.msg);
          });
        } else {
          toast.error(e?.response?.data?.detail);
        }
      });
  };

  if (isLoading || !data) {
    return (
      <div className="h-[20rem] flex items-center justify-center">
        <div>
          <LoadingIcon />
          <p className="mt-2 text-xs text-gray-500">Fetching user details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-40 px-5">
      {/* Form */}
      <UserForm
        initialValues={initialValues}
        setShowCancelModal={setShowCancelModal}
        submitFn={editUser}
        loading={loading}
        setLoading={setLoading}
        phone={phone}
        setPhone={setPhone}
        roleId={roleId}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        profilePic={profilePic}
        setProfilePic={setProfilePic}
        profilePicPresentOnLoad={true}
      />

      {/* CANCEL MODAL: DISCARD ALL CHANGES */}
      <Modal
        isOpen={showCancelModal}
        setIsOpen={setShowCancelModal}
        title="Are you sure you want to discard all changes?"
      >
        <div>
          <p className="px-5 mt-5 text-[#334155]">
            Discard changes would delete all the changes you have made. <br />{" "}
            Nothing would be saved.
          </p>

          <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
            <button
              onClick={() => setShowCancelModal(false)}
              className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              className="bg-primary-red py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
              onClick={() => {
                router.back();
              }}
            >
              Yes, discard changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default page;
