"use client";
import { useRouter } from "next/navigation";
import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import PasswordInput from "../components/PasswordInput";
import { FaRegCheckCircle } from "react-icons/fa";
import { changePassword } from "@/services/features/authService";
import { toast } from "sonner";
import useAdmin from "@/hooks/useAdmin";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useUser from "@/hooks/useUser";
import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";

const schema = yup.object({
  user_id: yup.number(),
  current_password: yup.string(),
  new_password: yup.string().min(6, "Password must be at least 6 characters"),
  confirm_password: yup
    .string()
    .min(6, "Password must be at least 6 characters"),
});

function Security() {
  const router = useRouter();
  const { user } = useUser();
  type typeOfSchema = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<typeOfSchema>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      user_id: user?.id,
      current_password: "",
      new_password: "",
    },
  });

  const onSubmit = async (data: typeOfSchema) => {
    if (data.new_password !== data.confirm_password) {
      toast.success("Password doesn't match", {
        position: "top-center",
        duration: 3000,
      });

      return;
    }
    const payload = {
      user_id: data.user_id,
      current_password: data.current_password,
      new_password: data.new_password,
    };
    await changePassword(payload);

    toast.success("Password changed Successfully", {
      position: "top-center",
      duration: 3000,
    });
    router.push("/client");
  };

  return (
    <div>
      <div>
        <h4 className="font-bold text-lg">Settings and Profile Management</h4>
        <p className="text-sm font-light">From description</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ flex: 1 }} className="mt-10">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", width: "600px" }}
            >
              <div style={{ flex: 1, marginRight: "10px" }}>
                <div className="mt-6 w-[600px]">
                  <PasswordInput
                    label="Old password"
                    placeholder="Enter your password"
                    autoComplete="off"
                    {...register("current_password")}
                    error={errors.current_password?.message}
                  />
                </div>
                <div className="mt-6 w-[600px]">
                  <PasswordInput
                    label="New password"
                    placeholder="Enter your password"
                    autoComplete="off"
                    {...register("new_password")}
                    error={errors.new_password?.message}
                  />
                </div>

                <div className="mt-3 w-[600px] mb-2">
                  <PasswordInput
                    label="Confirm password"
                    placeholder="Enter your password"
                    autoComplete="off"
                    {...register("confirm_password")}
                    error={errors.confirm_password?.message}
                  />
                </div>
                <div className="text-gray-500 text-sm">
                  <p className="mt-5">Password requirements</p>
                  {/* <div className="flex items-center justify-start py-2">
                  <FaRegCheckCircle fontSize={"small"} />
                  <h1>&nbsp;one lower case character</h1>&nbsp;&nbsp;
                  <FaRegCheckCircle fontSize={"small"} />
                  <h1>&nbsp;one number</h1>&nbsp;&nbsp;
                  <FaRegCheckCircle fontSize={"small"} />
                  <h1>&nbsp;one uppercase character</h1>
                </div> */}
                  <div className="flex items-center justify-start py-2">
                    <FaRegCheckCircle fontSize={"small"} />
                    <h1>&nbsp;6 characters minimum</h1>&nbsp;&nbsp;
                    {/* <FaRegCheckCircle fontSize={"small"} />
                  <h1>&nbsp;one special character</h1>&nbsp;&nbsp; */}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="float-right">
            <CompanyThemedButton
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
                  Saving Changes
                </span>
              ) : (
                "Save Changes"
              )}
            </CompanyThemedButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Security;
