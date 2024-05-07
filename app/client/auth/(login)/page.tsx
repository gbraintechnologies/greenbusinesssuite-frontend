"use client";

//
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import { Field, Form, Formik } from "formik";

//
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

//
import { login, currentLoggedIn } from "@/services/features/authService";

// icons
import { FiAlertCircle } from "react-icons/fi";

//
import * as yup from "yup";
import useUser from "@/hooks/useUser";
import useAuth from "@/hooks/useAuth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Page() {
  const router = useRouter();

  const { addUserData } = useUser();
  const { addAuthData } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const schema = yup.object({
    // email: yup.string().email().required("Email is required"),
    email: yup.string().required("Email/Username is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const [loginError, setLoginError] = useState<string | null>(null);

  const fetchCurrentUser = async (token: string) => {
    try {
      return await currentLoggedIn(token);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);

    try {
      const token = await login(data.email, data.password);

      if (token?.status === 200) {
        // add auth data
        addAuthData(token?.data);

        const user = await fetchCurrentUser(token.data?.access_token);

        addUserData(user?.data);
        setLoading(false);
        router.back();
      }
    } catch (error) {
      // @ts-ignore
      setLoginError(error?.response?.data?.detail);
      setLoading(false);
    }
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
                  Sign In
                </h1>
                <div className="input-holder px-5">
                  <label htmlFor="email" className="text-xs">
                    Email Address / Username
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
                <div className=" input-holder px-5 relative">
                  <label htmlFor="email">Password</label>
                  <Field
                    style={{
                      ...getStyles(errors, "password"),
                      backgroundColor: "rgba(248, 250, 252, 1)",
                    }}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                  ></Field>
                  <button
                    className="absolute right-10 bottom-4"
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

                  {loginError && (
                    <div className="flex items-center justify-start pt-4 pb-2">
                      <FiAlertCircle fontSize={"small"} color={"red"} />
                      <p className="ml-2 text-sm text-red-600 font-normal">
                        {loginError}
                      </p>
                    </div>
                  )}
                </div>
                <Link
                  href={"/client/auth/forgot-password"}
                  className=" text-[#16A34A] font-medium text-sm px-5"
                >
                  Forgot Password?
                </Link>
                <div className="py-3 px-5 mt-2 border-t-2 border-[#F1F5F9] bg-[#F8FAFC] rounded-b-lg">
                  <button
                    disabled={loading}
                    className=" w-full bg-[#16A34A] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg py-2 text-sm"
                    type="submit"
                  >
                    {loading ? "Please wait.." : "Sign in"}
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
      <button
        onClick={() => {
          router.replace("/client/auth/signup");
        }}
        className="mt-5 text-sm text-center w-96"
      >
        Don't have an account?{" "}
        <p className="font-medium text-[#15803D]">Create an account</p>
      </button>
    </div>
  );
}

export default Page;
