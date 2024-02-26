'use client'
import { useRouter } from "next/navigation";
import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import PasswordInput from "../components/PasswordInput";
import { FaRegCheckCircle } from "react-icons/fa";
import { changePassword } from "@/services/features/authService";

const schema = yup.object({
  userid: yup
    .string(),
  currentpassword: yup
    .string()
});

function Security() {
  const router = useRouter();
  type typeOfSchema = yup.InferType<typeof schema>;


  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<typeOfSchema>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      userid: "",
      currentpassword: "",
    },
  });



  const onSubmit = async (data: typeOfSchema) => {

  };


  return <div>
    <div>
      <h4 className="font-bold text-lg">Settings and Profile Management</h4>
      <p className="text-sm font-light">From description</p>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ flex: 1 }} className="mt-10">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', width: '600px' }}>
            <div style={{ flex: 1, marginRight: '10px' }}>
              <div className="mt-6 w-[600px]">
                <PasswordInput
                  label="Old password"
                  placeholder="Enter your password"
                  autoComplete="off"
                />
              </div>
              <div className="mt-6 w-[600px]">
                <PasswordInput
                  label="New password"
                  placeholder="Enter your password"
                  autoComplete="off"
                />
              </div>
              <p>Hint text give the user some feedback</p>
              <div className="flex items-center justify-start py-2">
                <FaRegCheckCircle fontSize={'small'} />
                <h1>&nbsp;one lower case character</h1>&nbsp;&nbsp;
                <FaRegCheckCircle fontSize={'small'} />
                <h1>&nbsp;one number</h1>&nbsp;&nbsp;
                <FaRegCheckCircle fontSize={'small'} />
                <h1>&nbsp;one uppercase character</h1>
              </div>
              <div className="flex items-center justify-start py-2">
                <FaRegCheckCircle fontSize={'small'} />
                <h1>&nbsp;8 characters minimum</h1>&nbsp;&nbsp;
                <FaRegCheckCircle fontSize={'small'} />
                <h1>&nbsp;one special character</h1>&nbsp;&nbsp;
              </div>

              <div className="mt-6 w-[600px] mb-7">
                <PasswordInput
                  label="Confirm password"
                  placeholder="Enter your password"
                  autoComplete="off"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="float-right">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            Saves Changes
          </Button>
        </div>
      </div>
    </div>
  </div>

}

export default Security;
