"use client";

import React, { useEffect, useState } from "react";

//
import { MdOutlineEdit } from "react-icons/md";

//
import services from "@/services";

import Image from "next/image";

// icons
import { HiOutlineInboxArrowDown } from "react-icons/hi2";

// components
import Modal from "@/components/Modal/Modal";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

//
import { useRouter } from "next/navigation";

// toast
import toast from "react-hot-toast";

// formik
import { Formik, Field, Form } from "formik";

import * as Yup from "yup";

import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";

// css
import "./index.css";
import BigUserIcon from "@/public/icons/BigUserIcon";

// hooks
import useFileUpload from "@/hooks/useFileUpload";

//
import { PhoneSelector } from "@/components/PhoneSelector/PhoneSelector";
import Dropdown from "@/components/Dropdown/Dropdown";
import { useQuery } from "@tanstack/react-query";

function NewUser() {
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  // Get ALL MESH BUSINESS SUITE ROLES
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["mesh roles"],
    enabled: false,
    // ID OF MESH APP IS 1 IN DB
    queryFn: services.getMeshBusinessSuiteRoles(1),
  });

  // FETCH ROLES ON MOUNT
  useEffect(() => {
    refetch();
  }, []);

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (data) {
      let temp = [];
      for (let i = 0; i < data.length; i++) {
        temp.push({
          id: data[i].id,
          value: data[i].id,
          label: data[i].role_name,
        });
      }
      // @ts-ignore
      setRoles(temp);
    }
  }, [data, isLoading]);

  const { handleFileUpload, loadingFile } = useFileUpload();

  const createNewUser = async (values: any, resetForm: any) => {
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
      .createUserWithCustomProfiles(data, custom_profiles)
      .then((res: any) => {
        setLoading(false);

        toast.dismiss(loading);

        // ASSIGN ROLE TO CREATED USER
        services
          //@ts-ignore
          .assignRoleToUser(res.data.id, selectedRole?.value)
          .then((res) => {
            toast.success(
              // @ts-ignore
              `Assigned ${selectedRole?.label} role to ${data.first_name}`
            );
          })
          .catch((e: any) => {
            //
            console.log("error asinging", e);
          });

        // NOTIFY USER OF TEMP CREDENTIALS
        services
          .notifyUserTempCred(res?.data?.id, "EMAIL")
          .then((res) => {
            resetForm();
            setProfileImage(null);
            setPhone("");
            setSelectedRole(null);
            toast.success(`Temporary password sent to ${data.email}`);
            toast.success("Created user successfully");
            console.log("notify user", res);
          })
          .catch((e) => {
            console.log("error notifying", e);
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

  const router = useRouter();

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [profileImage, setProfileImage] = useState<File | null>(null);

  // status:  ACTIVE, INACTIVE

  // formik
  let initialValues = {
    email: "",
    firstname: "",
    lastname: "",
  };

  // validation with Yhup
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

  return (
    <div className="pb-40 px-5">
      {/* Form */}
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          createNewUser(values, resetForm);
        }}
        validationSchema={UserSchema}
      >
        {({ errors }) => (
          <Form>
            {/* HEADER */}
            <div className="w-full text-primary-dark  flex justify-between">
              <h3 className="font-semibold text-xl">Create new user account</h3>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
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
                      <HiOutlineInboxArrowDown /> Save
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
                accept=".jpg, .png, .jpeg"
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

                <p className="font-light text-xs text-gray-500">
                  A temporal passsword would be sent to this email address
                </p>
              </div>

              {/* Phone */}
              <div className="input-holder">
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
              </div>
            </div>
          </Form>
        )}
      </Formik>

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

export default NewUser;
