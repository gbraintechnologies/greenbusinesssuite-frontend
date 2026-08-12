"use client";
import MeshSuiteAltLogo from "@/public/icons/MeshSuiteAltLogo";
import PasswordResetSuccess from "@/public/icons/PasswordResetSuccess";
import services from "@/services";
import { getStyles, ShowError } from "@/utils/FormHelpers/FormHelpers";
import { Field, Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import * as yup from "yup";

const page = () => {
  useEffect(() => {}, []);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState<"inProgress" | "complete">("inProgress");

  const searchParams = useSearchParams();

  const router = useRouter();

  const token = searchParams.get("code");

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const schema = yup.object({
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (!token) {
        toast.error("Reset link is invalid or expired.");
        return;
      }

      await services.resetPassword(token, values.password);
      setStatus("complete");
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRoute = () => {
    router.push("/auth");
  };

  return (
    <div className="bg-[#F1F5F9] h-screen flex items-center justify-center">
      <div>
        <div className="px-5 mb-2">
          <MeshSuiteAltLogo />
        </div>
        <div className="w-96 m-auto rounded-md bg-white h-auto shadow-sm">
          {status == "inProgress" && (
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={schema}
            >
              {({ errors }) => {
                return (
                  <Form className="px-5 py-2">
                    <div>
                      <h1 className="font-semibold text-base text-slate-900 text-left pt-4">
                        Create a new password
                      </h1>
                      <p className="text-[#475569] text-sm mb-2">
                        Create a new password for your Mesh account to secure
                        your account.
                      </p>
                      <p></p>

                      <div className="mb-4 input-holder relative">
                        <label className="">New password</label>
                        <Field
                          style={{
                            ...getStyles(errors, "password"),
                            backgroundColor: "rgba(248, 250, 252, 1)",
                          }}
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder=""
                        />
                        <button
                          className="absolute right-5 top-9"
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
                      <div className="input-holder relative">
                        <label className="">Confirm password</label>
                        <Field
                          style={{
                            ...getStyles(errors, "confirmPassword"),
                            backgroundColor: "rgba(248, 250, 252, 1)",
                          }}
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder=""
                        />
                        <button
                          className="absolute right-5 top-9"
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <AiOutlineEyeInvisible size={18} />
                          ) : (
                            <AiOutlineEye size={18} />
                          )}
                        </button>
                        <ShowError name="confirmPassword" />
                      </div>
                      <button
                        className=" w-full mb-2 bg-[#16A34A] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg py-2 text-sm"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Create New Password"}
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          )}
          {status == "complete" && (
            <div>
              <PasswordResetSuccess />
              <div className="px-5 py-2">
                <h1 className="font-semibold text-base text-slate-900 text-left pt-4">
                  Password creation success
                </h1>
                <p className="text-[#475569] text-sm mb-4">
                  Create a new password for your Mesh account to secure your
                  account.
                </p>
                <button
                  className=" w-full mb-2 bg-[#16A34A] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg py-2 text-sm"
                  type="button"
                  onClick={handleLoginRoute}
                >
                  Go to login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
