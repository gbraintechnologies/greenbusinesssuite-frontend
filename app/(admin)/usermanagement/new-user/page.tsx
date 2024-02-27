"use client";

import React, { useState } from "react";

//
import services from "@/services";

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

function NewUser() {
  const [loading, setLoading] = useState(false);

  const createNewUser = (values: any, resetForm: any) => {
    let data = {
      id: Math.floor(Math.random() * 100000000) + 1,
      email: values.email,
      username: values.firstname,
      first_name: values.firstname,
      last_name: values.lastname,
      phone_number: "233555198100",
      mobile_phone_number: "233555198100",
      user_status: "ACTIVE",
    };

    let loading = toast.loading("Creating user...");

    setLoading(true);
    services
      .createUser(data)
      .then((res) => {
        setLoading(false);
        resetForm();
        toast.dismiss(loading);
        toast.success("Created user successfully");
        console.log("create user", res);
      })
      .catch((e) => {
        setLoading(false);
        toast.dismiss(loading);
        e?.response?.data?.detail?.map((error: any) => {
          toast.error(error.msg);
        });
        console.log("error creating user", e?.response?.data?.detail);
      });
  };

  const router = useRouter();

  const [showCancelModal, setShowCancelModal] = useState(false);

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

  return (
    <div>
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
              {/* <div className="input-holder">
                <label>Phone Number</label>
                <PhoneSelector phone={phone} setPhone={setPhone} />
              </div> */}

              {/* <div className="input-holder">
                <label>Roles</label>

                <RoleSelector
                setSelected={setSelectedRole}
                selected={selectedRole}
              />
              </div> */}
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
