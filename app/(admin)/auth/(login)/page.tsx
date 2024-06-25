"use client";
import React, { useEffect, useState } from "react";
import TextInput from "./components/TextInput";
import PasswordInput from "./components/PasswordInput";
import Button from "./components/Button";
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
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

const schema = yup.object({
  username: yup.string().required("Email/Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 8 characters")
    .required("Password is required"),
});

function LogIn() {
  const router = useRouter();

  const { admin, addAdminData } = useAdmin();
  const { auth, addAuthData } = useAuth();

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
        addAdminData(user?.data);
        if (
          user?.data?.user_status === "NEWLY_CREATED" ||
          user?.data?.user_status === "TEMP_CREDENTIALS"
        ) {
          toast("Create your password");
          router.push(`/create-password?temp=${data.password}`);

          // route to admin / company dashboard
        } else if (user?.data?.profiles[0]?.role_id === 1) {
          toast.success("Logged in");
          router.push("/");
        } else {
          toast.success("Logged in");
          router.push("/company");
        }
      }
    } catch (error) {
      setLoginError("Incorrect email address and password");
    }
  };

  // if admin is already authenticated, re route
  useEffect(() => {
    if (Boolean(admin) && Boolean(auth)) {
      if (admin?.profiles[0].role_id === 1) {
        // main admin
        toast.success("Logged in");
        router.push("/");
        return;
      }
      // company admin
      if (admin?.profiles[0].role_id === 6) {
        toast.success("Logged in");
        router.push("/company");
        return;
      }
    }
  }, [admin, auth]);

  return (
    <div>
      <div className="max-h-screen h-screen flex overflow-hidden">
        <div className="loginFrame flex px-4 md:flex flex-[2] items-center justify-center bg-white p-6 rounded-[20px] shadow-2xl py-12">
          <form
            className="flex flex-col max-w-[414px] w-full gap-y-6 shadow-2xl py-12 bg-white p-6 rounded-[20px]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h6 className="font-bold text-xl">Sign in</h6>
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
            <p className="text-green-500 font-bold text-sm underline">
              <Link href="/auth/forgot-password"> Forgot Password? </Link>
            </p>
            <Button type="submit" isValid={isValid} disabled={isSubmitting}>
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
