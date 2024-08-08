"use client";

import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import { Field, Form, Formik, FormikHelpers } from "formik";

//
import React, { ReactNode, useState } from "react";
import * as yup from "yup";

//
import { useRouter, useSearchParams } from "next/navigation";

// components
import { toast } from "sonner";
import Dropdown from "@/components/Dropdown/Dropdown";

// services
import services from "@/services";

// icons
import GhanaFlag from "@/public/icons/GhanaFlag";
import NigeriaFlag from "@/public/icons/NigeriaFlag";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";

// css
import "./index.css";
import { PhoneSelector } from "@/components/PhoneSelector/PhoneSelector";

import Image from "next/image";
import useCompany from "@/hooks/useCompany";

function Page({ params }: any) {
  const tenantId = params.tenantId;

  const { companyBranding } = useCompany();

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

  const [phone, setPhone] = useState("");

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
      .min(6, "Password must be at least 6 characters")
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
      phone_number: phone,
      mobile_phone_number: phone,

      user_status: "ACTIVE",
    };

    const createUserResponse = await services.userSelfSignUp(userData);

    // console.log("create user response", createUserResponse);
    toast.success("Account created successfully", {
      description: "Confirm your email using the link sent to your email",
    });
    resetForm();
    setPhone("");
  };
  return (
    <div className="bg-white flex w-screen h-screen">
      <div className="bg-[#F1F5F9] hidden md:flex items-center justify-center md:flex-1">
        <div>
          {companyBranding?.logo && (
            <Image
              priority
              src={companyBranding?.logo}
              width={200}
              height={200}
              className="rounded-xl w-full h-full"
              alt="company"
            />
          )}
        </div>
      </div>
      <div className="md:flex-1 flex w-full flex-col items-center justify-center h-screen">
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={schema}
        >
          {({ errors, isSubmitting }) => {
            return (
              <Form>
                <div className=" rounded-lg py-6  shadow-sm h-auto w-96 text-slate-900 bg-white ">
                  <h1 className="font-semibold text-lg text-left pt-5 pb-3 px-5">
                    Create Your Account
                  </h1>
                  {/* <div className="input-holder px-5">
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
                </div> */}
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
                  <div className="px-5 mb-3">
                    <label htmlFor="number" className="input-holder-label mb-2">
                      Phone Number
                    </label>
                    <PhoneSelector phone={phone} setPhone={setPhone} />
                  </div>
                  <div className=" input-holder px-5 relative">
                    <label htmlFor="password">Password</label>
                    <Field
                      style={{
                        ...getStyles(errors, "password"),
                        backgroundColor: "rgba(248, 250, 252, 1)",
                      }}
                      name="password"
                      type={showPassword ? "text" : "password"}
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
                  {/* <div className="flex gap-2 justify-start px-5">
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
                </div> */}

                  <div className="py-3 px-5 mt-2  rounded-b-lg">
                    <CompanyThemedButton
                      className=" w-full bg-black text-white disabled:bg-gray-600 rounded-lg py-2 text-sm"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Creating account..."
                        : "Create an account"}
                    </CompanyThemedButton>
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
            router.push(`/${tenantId}/auth`);
          }}
          className="mt-5 text-sm text-center w-96"
        >
          Already have an account?{" "}
          <span className="font-medium text-black">Sign in</span>
        </button>
      </div>
    </div>
  );
}

export default Page;
