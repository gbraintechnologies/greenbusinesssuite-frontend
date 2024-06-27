"use client";

import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import { Field, Form, Formik, FormikHelpers } from "formik";

//
import React, { ReactNode, useState } from "react";
import * as yup from "yup";

//
import { useRouter, useSearchParams } from "next/navigation";

// components
import toast from "react-hot-toast";
import Dropdown from "@/components/Dropdown/Dropdown";

// services
import services from "@/services";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// icons
import GhanaFlag from "@/public/icons/GhanaFlag";
import NigeriaFlag from "@/public/icons/NigeriaFlag";

// css
import "./index.css";

function Page() {
  const router = useRouter();
  const search = useSearchParams();

  // saerch params

  const redirectTo = search.get("redirect");
  const formId = search.get("f");
  const companyName = search.get("c");

  //
  const [selectedResidence, setSelectedResidence] = useState<{
    label: string | ReactNode;
    value: string;
  }>({
    label: (
      <p className="flex gap-4 items-center">
        <GhanaFlag /> Ghana
      </p>
    ),
    value: "ghana",
  });

  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  };

  const schema = yup.object({
    email: yup.string().email().required("Email is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (
    values: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    },
    { resetForm, setSubmitting }: FormikHelpers<any>
  ) => {
    const userData = {
      email: values.email as string,
      username: ((values.firstName?.toLowerCase() as string) +
        values.lastName?.toLowerCase()) as string,
      password: values.password as string,
      first_name: values.firstName as string,
      last_name: values.lastName as string,
      phone_number: "233",
      mobile_phone_number: "233",
      user_status: "ACTIVE",
    };

    const createUserResponse = await services.userSelfSignUp(userData);
      toast.success("Sign up success");

      // ROLE ID: 7 for client
    // const assignRoleResponse = await services.assignRoleToUser(
    //   createUserResponse.data.id,
    //   7
    // );

    // const notifyUserResponse = await services.notifyUserTempCred(
    //   createUserResponse?.data?.id,
    //   "EMAIL"
    // );

    toast.success(`Temporary password sent to ${userData.email}`);
  };
  return (
    <div className="flex flex-col justify-center h-screen">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ errors, isSubmitting }) => {
          return (
            <Form>
              <div className=" rounded-lg  shadow-sm h-auto w-96 text-slate-900 bg-white ">
                <h1 className="font-semibold text-lg text-left pt-5 pb-3 px-5">
                  Create A Mesh Account
                </h1>
                <div className="input-holder px-5">
                  <label>Country of residence</label>
                  <Dropdown
                    options={[
                      {
                        label: (
                          <p className="flex gap-4 items-center">
                            <GhanaFlag /> Ghana
                          </p>
                        ),
                        value: "ghana",
                      },
                      {
                        label: (
                          <p className="flex gap-4 items-center">
                            <NigeriaFlag /> Nigeria
                          </p>
                        ),
                        value: "nigeria",
                      },
                    ]}
                    selected={selectedResidence}
                    setSelected={setSelectedResidence}
                    bgColor="bg-slate-50"
                  />
                  <ShowError name="industry" />
                </div>
                <div className="input-holder px-5">
                  <label htmlFor="email" className="text-xs">
                    Email Address
                  </label>
                  <Field
                    style={{
                      ...getStyles(errors, "email"),
                      backgroundColor: "rgba(248, 250, 252, 1)",
                    }}
                    name="email"
                    placeholder=""
                  />
                  <ShowError name="email" />
                </div>
                <div className="flex gap-2">
                  <div className="input-holder pl-5">
                    <label htmlFor="firstName" className="text-xs">
                      First name
                    </label>
                    <Field
                      style={{
                        ...getStyles(errors, "firstName"),
                        backgroundColor: "rgba(248, 250, 252, 1)",
                      }}
                      name="firstName"
                      placeholder=""
                    />
                    <ShowError name="firstName" />
                  </div>
                  <div className="input-holder pr-5">
                    <label htmlFor="lastName" className="text-xs">
                      Last name
                    </label>
                    <Field
                      style={{
                        ...getStyles(errors, "lastName"),
                        backgroundColor: "rgba(248, 250, 252, 1)",
                      }}
                      name="lastName"
                      placeholder=""
                    />
                    <ShowError name="lastName" />
                  </div>
                </div>
                <div className=" input-holder px-5 relative">
                  <label htmlFor="password">Password</label>
                  <Field
                    style={{
                      ...getStyles(errors, "password"),
                      backgroundColor: "rgba(248, 250, 252, 1)",
                    }}
                    name="password"
                    type={showPassword ? "text":"password"}
                    placeholder="Enter your password"
                  />
                  <button
                    className="absolute right-10 top-9"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={18} />
                    ) : (
                      <AiOutlineEye size={18} />
                    )}
                  </button>
                  <ShowError name="password" />
                </div>
                <div className="flex gap-2 justify-start px-5">
                  <input
                    type="checkbox"
                    className="form-check-input "
                    name="emailSub"
                  />
                  <label className="text-[#94A3B8] text-xs" htmlFor="emailSub">
                    Get emails from Mesh about product updates, industry news,
                    and events. If you change your mind, you can unsubscribe at
                    any time.
                  </label>
                </div>

                <div className="py-3 px-5 mt-2  rounded-b-lg">
                  <button
                    className=" w-full bg-[#16A34A] text-white rounded-lg py-2 text-sm"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Create an account
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
      <button
        onClick={() => {
          // add search params if redirectTo exists
          if (Boolean(redirectTo)) {
            router.push(
              `/client/auth?redirect=${redirectTo}&f=${formId}&c=${companyName}`
            );
            return;
          }
          router.push("/client/auth");
        }}
        className="mt-5 text-sm text-center w-96"
      >
        Already have an account?{" "}
        <span className="font-medium text-[#15803D]">Sign in</span>
      </button>
    </div>
  );
}

export default Page;
