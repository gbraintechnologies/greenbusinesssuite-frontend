"use client";
import React, { useEffect, useState } from "react";
import Button from "./components/Button";
import PasswordInput from "./components/PasswordInput";
import { FiAlertCircle } from "react-icons/fi";
import Logo from "@/app/(admin)/auth/(login)/components/Logo";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { changePassword, updateUser } from "@/services/features/authService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import SuccessIcon from "@/public/icons/SuccessIcon";
import { useSearchParams } from "next/navigation";
import useCompany from "@/hooks/useCompany";
import useAuth from "@/hooks/useAuth";

const schema = yup.object({
  user_id: yup.number(),
  new_password: yup.string().min(6, "Password must be at least 6 characters"),
  current_password: yup.string(),
  confirm_password: yup
    .string()
    .min(6, "Password must be at least 6 characters"),
});

function CreatePassword() {
  const { companyAdmin, removeCompanyAdmin } = useCompany();
  const { setAuth } = useAuth();
  const router = useRouter();

  //
  type typeOfSchema = yup.InferType<typeof schema>;
  const [loginError, setLoginError] = useState<string | null>(null);
  const [status, setStatus] = useState("main");
  const searchParams = useSearchParams();
  const password = searchParams.get("temp");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<typeOfSchema>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      user_id: companyAdmin?.id,
      current_password: password!,
      new_password: "",
    },
  });

  const onSubmit = async (data: typeOfSchema) => {
    try {
      const passwordPayload = {
        user_id: data.user_id,
        current_password: data.current_password,
        new_password: data.new_password,
      };
      await changePassword(passwordPayload);

      const userStatusPayload = {
        id: companyAdmin.id,
        email: companyAdmin.email,
        username: companyAdmin.username,
        first_name: companyAdmin.first_name,
        last_name: companyAdmin.last_name,
        phone_number: companyAdmin.phone_number,
        mobile_phone_number: companyAdmin.mobile_phone_number,
        user_status: "ACTIVE",
      };

      updateUser(userStatusPayload.id, userStatusPayload).catch((error) =>
        alert(error.message)
      );

      toast.success("Password changed Successfully", {
        position: "top-center",
        duration: 3000,
      });

      setStatus("success");
    } catch (error) {
      setLoginError("Error setting password. Please try again");
    }
  };

  return (
    <div>
      <div className="flex px-4 md:flex flex-[2] items-center justify-center py-12 mt-20">
        <div className="mb-10">
          <div className="flex items-left justify-left mb-10">
            <Link href="/">
              <Logo src={"/svg/mesh_logo.svg"} width={100} />
            </Link>
          </div>
          {status === "main" && (
            <div>
              <form
                className=" loginFrame flex flex-col max-w-[414px] w-full gap-y-6 shadow-2xl py-10 bg-white p-6 rounded-[20px]"
                onSubmit={handleSubmit(onSubmit)}
              >
                <h6 className="font-bold text-xl">Create a new password</h6>
                <p>
                  Create a new password for your account to secure your account
                </p>
                <div>
                  <PasswordInput
                    label="New password"
                    placeholder="Enter your password"
                    autoComplete="off"
                    {...register("new_password")}
                    error={errors.new_password?.message}
                  />
                </div>
                <div className="mb-2">
                  <PasswordInput
                    label="Confirm Password"
                    placeholder="Enter your password"
                    autoComplete="off"
                    {...register("confirm_password")}
                    error={errors.confirm_password?.message}
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
                <Button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      {" "}
                      <AiOutlineLoading3Quarters
                        size={16}
                        className="animate-spin"
                      />{" "}
                      Creating Password
                    </span>
                  ) : (
                    "Create Password"
                  )}
                </Button>
              </form>
            </div>
          )}
          {status === "success" && (
            <div className="loginFrame flex flex-col max-w-[414px] w-full gap-y-6 shadow-2xl py-10 bg-white p-6 rounded-[20px]">
              <SuccessIcon />
              <h1 className="font-semibold text-2xl">
                Password creation Successful
              </h1>
              <p className="opacity-50 font-light text-sm mt-2 mb-5">
                Create new password for your Mesh account to secure your account
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  className=""
                  type="submit"
                  onClick={() => {
                    setAuth(null);
                    removeCompanyAdmin();
                    router.push("/company/auth");
                  }}
                >
                  Go to Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col mt-20 items-center ">
        <div className="flex items-center gap-x-4 text-xs text-opacity-30 text-black font-medium">
          <p className="font-xs">&copy;&nbsp;Mesh Agent</p>
          <p>&bull;&nbsp;Contact</p>
          <p>&bull;&nbsp;Privacy policy</p>
        </div>
      </div>
    </div>
  );
}

export default CreatePassword;
