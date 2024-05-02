"use client";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import * as yup from "yup";

function Page() {
  const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
  };

  const schema = yup.object({
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleSubmit = () => {
    router.push('/client')
  };

  return (
    <div className="flex flex-col justify-center h-screen">
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={schema}>
        {({ errors }) => {
          return (
            <Form>
              <div className=" rounded-lg  shadow-sm h-auto w-96 text-slate-900 bg-white ">
                <h1 className="font-semibold text-lg text-left pt-5 pb-3 px-5">
                  Sign In
                </h1>
                <div className="input-holder px-5">
                  <label htmlFor="email" className="text-xs">Email Address</label>
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
                <div className=" input-holder px-5">
                  <label htmlFor="email">Password</label>
                  <Field
                    style={{
                      ...getStyles(errors, "password"),
                      backgroundColor: "rgba(248, 250, 252, 1)",
                    }}
                    name="password"
                    type="password"
                    placeholder=""
                  />
                  <ShowError name="password" />
                </div>
                <Link href={'/forgot-password'} className=" text-[#16A34A] font-medium text-sm px-5">Forgot Password?</Link>
                <div className="py-3 px-5 mt-2 border-t-2 border-[#F1F5F9] bg-[#F8FAFC] rounded-b-lg">

                <button className=" w-full bg-[#16A34A] text-white rounded-lg py-2 text-sm" type="submit">Sign In</button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
      <p className="mt-5 text-sm text-center w-96">Don't have an account? <Link href={'/client/auth/signup'} className="font-medium text-[#15803D]">Create an account</Link></p>
    </div>
  );
}

export default Page;
