"use client";
import React, { useState } from "react";
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
import { relative } from "path";

const schema = yup.object({
  username: yup
    .string()
    // .email("Please enter a valid email address")
    .required("Email/Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 8 characters")
    .required("Password is required"),
});

function LogIn() {
  const router = useRouter();

  type typeOfSchema = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<typeOfSchema>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: typeOfSchema) => {
    await data;
  };

  return (
    <div>
      <div className="max-h-screen h-screen flex overflow-hidden">
        <div className="loginFrame flex px-4 md:flex flex-[2] items-center justify-center bg-white p-6 rounded-[20px] shadow-2xl py-12">
          <form className="flex flex-col max-w-[414px] w-full gap-y-6 shadow-2xl py-12 bg-white p-6 rounded-[20px] ">
            <h6 className="font-bold text-xl">Sign in</h6>
            <div>
              <TextInput
                label="Email address or phone number"
                type="text"
                placeholder="Enter your work email address"
                autoComplete="off"
              />
            </div>
            <div className="mb-4">
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                autoComplete="off"
              />
              <div className="flex items-center justify-start py-2">
                <FiAlertCircle fontSize={"small"} color={"red"} />
                <p className="ml-2 text-sm text-red-600 font-normal">
                  Incorrect email address and password
                </p>
              </div>
            </div>
            <p className="text-green-500 font-bold text-sm underline">
              <Link href="/forgot-password"> Forgot Password? </Link>
            </p>
            <Button type="submit">Login</Button>
            {/*
           <div className="inline-block"> 
            <p className="font-light text-sm inline-block">Don't have an account &nbsp;</p>
            <Link href={'#'} className="text-inline text-bold text-sm text-green-500"><span className="font-bold">Sign Up?</span></Link>
          </div>
          */}
          </form>
        </div>

        <div className="hidden md:flex flex-[2] relative z-20  pb-6 flex-col justify-between pt-[14px] w-full h-full bgImgCenter circle">
          <div className="">
            <Link href="/">
              <div className={"mt-10 pl-[81px]"}>
                <Logo src={"/svg/login_logo.svg"} width={150} />
              </div>
            </Link>
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
