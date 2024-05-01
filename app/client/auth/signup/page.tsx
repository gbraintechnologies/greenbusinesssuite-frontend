"use client";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import React from "react";
import * as yup from "yup";
import "./index.css";

function Page() {
  const initialValues = {
    email: "",
    password: "",
  };

  const schema = yup.object({
    email: yup.string().required("Email is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleSubmit = () => {
    console.log("submit");
  };
  return (
    <div className="flex flex-col justify-center h-screen">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ errors }) => {
          return (
            <Form>
              <div className=" rounded-lg  shadow-sm h-auto w-96 text-slate-900 bg-white ">
                <h1 className="font-semibold text-lg text-left pt-5 pb-3 px-5">
                  Create A Mesh Account
                </h1>
                <div className="input-holder px-5">
                  <label>Country of residence</label>
                  <select>
                    <option>
                      <div className="flex gap-3">
                        <p>Flag</p>
                        <p>Ghana</p>
                      </div>
                    </option>
                  </select>
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
                <div className=" input-holder px-5">
                  <label htmlFor="password">Password</label>
                  <Field
                    style={{
                      ...getStyles(errors, "password"),
                      backgroundColor: "rgba(248, 250, 252, 1)",
                    }}
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                  />
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
                  <button className=" w-full bg-[#16A34A] text-white rounded-lg py-2 text-sm">
                    Create an account
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
      <p className="mt-5 text-sm text-center w-96">
        Already have an account?{" "}
        <Link
          href={"/client/auth/login"}
          className="font-medium text-[#15803D]"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default Page;
