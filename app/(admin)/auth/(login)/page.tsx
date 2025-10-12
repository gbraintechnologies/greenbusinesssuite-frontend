"use client";
import React, { useEffect, useState } from "react";
import TextInput from "./components/TextInput";
import PasswordInput from "./components/PasswordInput";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";
import Logo from "./components/Logo";
import { login, currentLoggedIn } from "@/services/features/authService";

// icons
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// hooks
import useAdmin from "@/hooks/useAdmin";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import useCompany from "@/hooks/useCompany";
import { Button } from "@heroui/react";

const schema = yup.object({
  username: yup.string().required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function LogIn() {
  const router = useRouter();

  const { admin, removeAdmin, addAdminData } = useAdmin();
  const { auth, removeAuth, addAuthData } = useAuth();
  const { removeUser } = useUser();
  const { removeCompanyAdmin } = useCompany();

  // clear all other users if necessary
  useEffect(() => {
    if (admin !== null && Boolean(auth?.access_token)) {
      // go to dashboard without logging if data & auth is present
      // take care of edge case of new user
      if (
        admin?.user_status !== "NEWLY_CREATED" ||
        admin?.user_status !== "TEMP_CREDENTIALS"
      ) {
        toast.success("Logged in");
        router.push("/");
      }
    } else {
      removeAdmin();
      removeAuth();
      removeCompanyAdmin();
      removeUser();
    }
  }, []);

  const [loginError, setLoginError] = useState<string | null>(null);

  type typeOfSchema = yup.InferType<typeof schema>;

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

  // const fetchCurrentUser = async (token: string) => {
  //   try {
  //     return await currentLoggedIn(token);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const onSubmit = async (data: typeOfSchema) => {
    try {
      const token: any = await login(data.username, data.password);

      console.log("token", token);
      if (token?.status === 200) {
        addAuthData(token?.data);
        addAdminData(token?.data);

        toast.success("Logged in");
        router.push("/");

        // TODO: Refactoring
        // const user = await fetchCurrentUser(token.data?.access_token);

        // if (
        //   user?.data?.user_status === "NEWLY_CREATED" ||
        //   user?.data?.user_status === "TEMP_CREDENTIALS"
        // ) {
        //   addAdminData(user?.data);
        //   toast("Create your password");
        //   router.push(`/auth/create-password?temp=${data.password}`);
        //   return;
        //   // route to admin / company dashboard
        // } else if (user?.data?.profiles[0]?.role_id === 1) {
        //   addAdminData(user?.data);
        //   toast.success("Logged in");
        //   router.push("/");
        //   return;
        // } else {
        //   removeAuth();
        //   toast.error("Access denied. Contact your administrator");
        // }
      }
    } catch (error) {
      setLoginError("Incorrect email address or password");
    }
  };

  // if admin is already authenticated, re route
  // useEffect(() => {
  //   if (Boolean(admin) && Boolean(auth)) {
  //     if (admin?.profiles[0].role_id === 1) {
  //       // main admin
  //       toast.success("Logged in");
  //       router.push("/");
  //       return;
  //     }
  //     // company admin
  //     if (admin?.profiles[0].role_id === 6) {
  //       toast.success("Logged in");
  //       router.push("/company");
  //       return;
  //     }
  //   }
  // }, [admin, auth]);

  return (
    <div>
      <div className="max-h-screen h-screen flex overflow-hidden">
        <div className=" flex px-4 md:flex flex-[2] items-center justify-center bg-white p-6 rounded-[20px] shadow-2xl py-20">
          <form
            className="flex flex-col  w-full md:max-w-lg gap-y-6 shadow-md border bg-white py-20 p-6 rounded-[20px]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h6 className="font-bold text-3xl">Welcome Back! Sign in</h6>
            <p className="text-gray-500 text-sm -mt-4">
              Enter your credentials to log into your account
            </p>
            <div>
              <TextInput
                label="Email address"
                type="text"
                placeholder="Enter your email address"
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
            <p className="text-green-500 font-bold text-sm underline">
              <Link href="/auth/forgot-password"> Forgot Password? </Link>
            </p>
            <Button
              className="bg-primary-green text-white rounded-lg"
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Sign In
            </Button>
          </form>
        </div>
        <div className="hidden md:flex flex-[2] relative z-20  pb-6 flex-col justify-between pt-[14px] w-full h-full bgImgCenter circle">
          <div className="">
            <div className={"mt-10 pl-[81px]"}>
              <Logo src={"/svg/login_logo.svg"} width={150} />
            </div>
            <div className={"mt-10 pl-[81px]"}>
              <p className="text-white mb-10">Mesh Business Suite</p>
              <p className="text-white font-medium text-2xl">
                Build Collabrative forms quickly and easily
              </p>
            </div>
            <div className="mt-10">
              <img src={"/svg/login_icon.svg"} className="login_icon" />
            </div>
          </div>
          <div className="flex flex-col  pl-[81px]">
            <div className="flex items-center gap-x-4 text-xs text-opacity-30 text-white font-medium">
              <p className="font-xs">&copy;&nbsp;Mesh Agent</p>
              <p>&bull;&nbsp;Contact</p>
              <p>&bull;&nbsp;Privacy policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
