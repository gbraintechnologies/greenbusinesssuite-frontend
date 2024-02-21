import React from "react";
import Button from "./components/Button";
import PasswordInput from "./components/PasswordInput";
import { FiAlertCircle } from "react-icons/fi";
import Logo from "../(login)/components/Logo";
import Link from "next/link";

function CreatePassword() {
  return (
    <div>
      <div className="flex px-4 md:flex flex-[2] items-center justify-center py-12 mt-20">
        <div className="mb-10">
          <div className="flex items-left justify-left mb-10">
            <Link href="/">
              <Logo src={"/svg/mesh_logo.svg"} width={100} />
            </Link>
          </div>
          <form className=" loginFrame flex flex-col max-w-[414px] w-full gap-y-6 shadow-2xl py-10 bg-white p-6 rounded-[20px] ">
            <h6 className="font-bold text-xl">Create a new password</h6>
            <p>Create a new password for your account to secure your account</p>
            <div>
              <PasswordInput
                label="New password"
                placeholder="Enter your password"
                autoComplete="off"
              />
              <p>Password should at least 8 characters long</p>
            </div>
            <div className="mb-2">
              <PasswordInput
                label="Confirm Password"
                placeholder="Enter your password"
                autoComplete="off"
              />
              <div className="flex items-center justify-start py-2">
                <FiAlertCircle fontSize={"small"} color={"red"} />
                <p className="ml-2 text-sm text-red-600 font-normal">
                  This should be the same as the password inputed above
                </p>
              </div>
            </div>
            <Button type="submit">Create New Password</Button>
          </form>
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
