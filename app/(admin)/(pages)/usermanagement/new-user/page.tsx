"use client";

import React, { useEffect, useState } from "react";

//
import { MdOutlineEdit } from "react-icons/md";

//
import services from "@/services";

import Image from "next/image";

import { IoIosArrowBack } from "react-icons/io";

// icons
import { HiOutlineInboxArrowDown } from "react-icons/hi2";

// components
import Modal from "@/components/Modal/Modal";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

//
import { useRouter } from "next/navigation";

// toast
import { toast } from "sonner";

// formik
import { Formik, Field, Form } from "formik";

import * as Yup from "yup";

import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";

// css
import "./index.css";

//
import { PhoneSelector } from "@/components/PhoneSelector/PhoneSelector";
import { useQuery } from "@tanstack/react-query";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

function NewUser() {
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  // Get ALL MESH BUSINESS SUITE ROLES
  const { data: roles, isLoading } = useQuery({
    queryKey: ["mesh roles"],
    queryFn: services.getMeshBusinessSuiteRoles(),
  });

  console.log("roles", roles);

  console.log("selected role", selectedRole);

  const createNewUser = async (values: any, resetForm: any) => {
    console.log("selected role", selectedRole);
    let data = {
      email: values.email,
      username: values.email,
      firstName: values.firstname,
      lastName: values.lastname,
      password: "password",
      roleId: 3, // what role is this?
      profile_image: "",
      phone: phone,
      status: "ACTIVE",
    };
    //     {
    //   "username": "string",
    //   "status": "ACTIVE",
    //   "firstName": "string",
    //   "lastName": "string",
    //   "email": "string",
    //   "password": "string",
    //   "phone": "string",
    //   "roleId": 0,
    //   "profile_image": "string"
    // }

    let loading = toast.info("Creating user. Please wait...");

    setLoading(true);
    services
      .createUser(data)
      .then((res: any) => {
        setLoading(false);
        console.log("CREATE USER RES", res);

        toast.dismiss(loading);

        // ASSIGN ROLE TO CREATED USER
        // services
        //   //@ts-ignore
        //   .assignRoleToUser(res.data.id, selectedRole?.value)
        //   .then((res) => {
        //     toast.success(
        //       // @ts-ignore
        //       `Assigned ${selectedRole?.label} role to ${data.first_name}`
        //     );
        //   })
        //   .catch((e: any) => {
        //     //
        //     console.log("error asinging", e);
        //   });

        // NOTIFY USER OF TEMP CREDENTIALS
        // services
        //   .notifyUserTempCred(res?.data?.id, "EMAIL")
        //   .then((res) => {
        //     resetForm();

        //     setPhone("");
        //     setSelectedRole(null);
        //     toast.success(`Temporary password sent to ${data.email}`);
        //     toast.success("Created user successfully");
        //   })
        //   .catch((e) => {
        //     console.log("error notifying", e);
        //   });
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
              <div className="flex items-center gap-2">
                <div
                  className="my-3 cursor-pointer flex text-sm items-center gap-2"
                  onClick={() => router.back()}
                >
                  <IoIosArrowBack size={20} />
                </div>
                <h3 className="font-semibold text-xl">
                  Create new user account
                </h3>
              </div>
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
                <label className="pb-2">Phone number</label>
                <PhoneSelector phone={phone} setPhone={setPhone} />
              </div>

              <div>
                <Autocomplete
                  isLoading={isLoading}
                  className="w-full"
                  variant="bordered"
                  placeholder="Role"
                  labelPlacement="outside"
                  label="Select a Role"
                >
                  {roles?.map((role: string) => (
                    <AutocompleteItem key={role}>{role}</AutocompleteItem>
                  ))}
                </Autocomplete>
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
