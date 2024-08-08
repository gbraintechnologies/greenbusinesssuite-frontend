"use client";

import useAuth from "@/hooks/useAuth";
import useCompany from "@/hooks/useCompany";
import React, { useEffect, useState } from "react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

//
import Link from "next/link";

import { login, currentLoggedIn } from "@/services/features/authService";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import TextInput from "@/app/(admin)/auth/(login)/components/TextInput";
import PasswordInput from "@/app/(admin)/auth/(login)/components/PasswordInput";

// icons
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiAlertCircle } from "react-icons/fi";

// logos
import MeshSuiteLogo from "@/public/icons/MeshSuitLogoGray";

// hooks
import useAdmin from "@/hooks/useAdmin";
import useUser from "@/hooks/useUser";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import CompanyLogo from "@/components/ThemeLogo/CompanyLogo";

//

function CompanyAdminAuth({ params }: any) {
  const {
    addCompanyAdminData,
    companyAdmin,
    companyBranding,
    removeCompanyAdmin,
  } = useCompany();

  const search = useSearchParams();

  // Information for user sign up redirects
  const redirectTo = search.get("redirect");
  const formId = search.get("f");
  const companyName = search.get("c");

  //
  const { addUserData, removeUser } = useUser();
  const { auth, addAuthData, removeAuth } = useAuth();
  const { removeAdmin } = useAdmin();

  const router = useRouter();

  const [loginError, setLoginError] = useState<string | null>(null);

  const tenantId = params?.tenantId;

  const schema = yup.object({
    username: yup.string().required("Email/Username is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  type typeOfSchema = yup.InferType<typeof schema>;

  // clear all other users if necessary
  useEffect(() => {
    if (companyAdmin !== null && Boolean(auth?.access_token)) {
      // go to dashboard without logging if data & auth is present
      // go to dashboard without logging if data & auth is present
      // take care of edge case of new user
      if (
        companyAdmin?.user_status !== "NEWLY_CREATED" ||
        companyAdmin?.user_status !== "TEMP_CREDENTIALS"
      ) {
        toast.success("Logged in");
        router.push(`/${tenantId}/admin`);
      }
    } else {
      removeAdmin();
      removeAuth();
      removeCompanyAdmin();
      removeUser();
      addAuthData({ tenantId: tenantId });
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm<typeOfSchema>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const fetchCurrentUser = async (token: string) => {
    try {
      return await currentLoggedIn(token);
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (data: typeOfSchema) => {
    try {
      const token: any = await login(data.username, data.password);
      if (token?.status === 200) {
        addAuthData(token?.data);
        const user = await fetchCurrentUser(token.data?.access_token);
        if (
          user?.data?.user_status === "NEWLY_CREATED" ||
          user?.data?.user_status === "TEMP_CREDENTIALS"
        ) {
          toast("Create your password");
          router.push(
            `/${tenantId}/auth/create-password?temp=${data.password}`
          );
          return;
        }
        // ROLE 6 - CLIENT ONLY
        // change to !== 6
        else if (user?.data?.profiles[0]?.role_id !== 6) {
          addCompanyAdminData(user?.data);
          toast.success("Logged in");
          router.push(`/${tenantId}/admin`);
        } else {
          addUserData(user?.data);
          toast.success("Logged in");
          // Generally route to client dashboard
          // if redirectTo is available, route to invitation
          if (Boolean(redirectTo)) {
            router.push(
              `/${tenantId}/invite-form?f=${formId}&c=${companyName}`
            );
            return;
          }

          // normal authentication
          router.push(`/${tenantId}/client`);
        }
      }
    } catch (error) {
      console.log("error logging in", error);
      // toast.error("Error logging in.", {
      //   description: "Contact your administrator",
      // });
      setLoginError("Incorrect username and password");
    }
  };

  // console.log("branding info", companyBranding);

  return (
    <div className="bg-[#F5F7FA] w-full flex items-center justify-center h-screen">
      <div className="bg-[#f2f4f6] rounded-xl shadow-md">
        {" "}
        <form
          className="flex flex-col w-[90%] md:max-w-[25rem] md:w-[30vw] min-w-[25rem] gap-5 shadow-md bg-white p-6 rounded-xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mx-auto flex items-center justify-center w-full">
            <CompanyLogo />
          </div>
          <h2 className="font-bold text-center text-xl">
            Sign in to {companyBranding?.name}
          </h2>
          <p className="mb-2 text-center text-sm text-gray-500 -mt-3">
            Welcome back! Please sign in to continue
          </p>
          <div>
            <TextInput
              label="Username"
              type="text"
              placeholder="Enter your username"
              autoComplete="off"
              {...register("username")}
              error={errors.username?.message}
              extraClasses={errors.username ? "border-red-500" : ""}
            />
          </div>
          <div className="mb-4">
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              autoComplete="off"
              {...register("password")}
              error={errors.password?.message}
              extraClasses={errors.password ? "border-red-500" : ""}
            />
            {loginError && (
              <div className="flex items-center justify-start py-2">
                <FiAlertCircle fontSize={"small"} color={"red"} />
                <p className="ml-2 text-sm text-red-600 font-normal">
                  {loginError}
                </p>
              </div>
            )}
          </div>
          <p className="text-gray-700 font-bold text-sm underline">
            <Link href="/company/auth/forgot-password"> Forgot Password? </Link>
          </p>
          <Button
            style={{
              backgroundColor: companyBranding.color,
            }}
            className="text-white rounded-lg"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                {" "}
                <AiOutlineLoading3Quarters
                  size={16}
                  className="animate-spin"
                />{" "}
                Signing in
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
        <div className="text-center  text-gray-400 text-sm py-4">
          <p className="mb-3">
            Don't have an account{" "}
            <Link href="auth/sign-up">
              {" "}
              <span className="font-semibold text-black">Sign Up</span>
            </Link>
          </p>
          <hr />
          <div className="mt-2 flex justify-center gap-2 items-center text-xs">
            Powered by <MeshSuiteLogo />{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyAdminAuth;
