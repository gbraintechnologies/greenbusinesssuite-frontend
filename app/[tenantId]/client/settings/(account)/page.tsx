"use client";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import TextInput from "../components/TextInput";

import { updateUser } from "@/services/features/authService";
import { toast } from "sonner";

import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useUser from "@/hooks/useUser";

//

const schema = yup.object({
  id: yup.number(),
  firstName: yup.string(),
  phone: yup.string(),
  status: yup.string(),
  lastName: yup.string(),
  email: yup.string(),
  mobile_phone: yup.string(),
  username: yup.string(),
});

function Account() {
  const { user, removeUser } = useUser();

  type typeOfSchema = yup.InferType<typeof schema>;
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeOfSchema>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: user?.id,
      firstName: user?.first_name,
      lastName: user?.last_name,
      phone: user?.phone_number,
      status: user?.user_status,
      email: user?.email,
      username: user?.username,
      mobile_phone: user?.mobile_phone_number,
    },
  });

  const onSubmit = async (data: typeOfSchema) => {
    const payload = {
      id: data.id,
      email: data.email,
      username: data.username,
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phone,
      mobile_phone_number: data.mobile_phone,
      user_status: data.status,
    };

    await updateUser(payload.id, payload);
    toast.success("Changes saved Successfully", {
      position: "top-center",
      duration: 3000,
    });
    removeUser();
    toast.success("Logged out");
    router.push("/client");
  };

  return (
    <>
      <div className="">
        <div>
          <h4 className="font-bold text-lg">Settings and Profile Management</h4>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ flex: 1 }} className="mt-10">
            {/* <div style={{ textAlign: "center" }} className="mb-7">
              {user?.custom_profile_values &&
              user?.custom_profile_values.find(
                (item: any) => item.custom_profile_item_id === 1
              )?.value?.length > 1 ? (
                <Image
                  alt="profile"
                  src={
                    user?.custom_profile_values.find(
                      (item: any) => item.custom_profile_item_id === 1
                    ).value
                  }
                  width={150}
                  height={150}
                  className="rounded-full w-32 h-32 object-cover"
                />
              ) : (
                <button className="w-20 h-20 text-sm rounded-full flex items-center justify-center bg-[#F1F5F9]">
                  {user?.first_name && user?.first_name[0]?.toUpperCase()}
                  {user?.last_name && user?.last_name[0]?.toUpperCase()}
                </button>
              )}
            </div> */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ display: "flex", width: "600px" }}
              >
                <div style={{ flex: 1, marginRight: "10px" }}>
                  <div className="mb-5">
                    <TextInput
                      label="First name"
                      type="text"
                      placeholder=""
                      autoComplete="off"
                      {...register("firstName")}
                      error={errors.firstName?.message}
                    />
                  </div>
                  <div className="mb-5 relative">
                    <TextInput
                      label="Phone number"
                      type="tel"
                      disabled
                      placeholder="phone number"
                      autoComplete="off"
                      {...register("phone")}
                      error={errors.phone?.message}
                    />
                  </div>
                  <div className="mb-5">
                    <TextInput
                      label="Status"
                      type="text"
                      placeholder=""
                      readOnly
                      disabled
                      autoComplete="off"
                      {...register("status")}
                      error={errors.status?.message}
                      // PostpendIcon={<RiArrowDropDownLine size={30} />}
                    />
                  </div>
                </div>
                <div style={{ flex: 1, marginLeft: "20px" }}>
                  <div className="mb-5">
                    <TextInput
                      label="Last name"
                      type="text"
                      placeholder=""
                      autoComplete="off"
                      {...register("lastName")}
                      error={errors.lastName?.message}
                    />
                  </div>
                  <div>
                    <TextInput
                      label="Email address"
                      type="email"
                      placeholder=""
                      disabled
                      autoComplete="off"
                      {...register("email")}
                      error={errors.email?.message}
                    />
                  </div>
                </div>
              </form>
            </div>
            {/* <div className="float-right">
              <Button type="button" onClick={() => setShowCancelModal(true)}>
                Save Changes
              </Button>
            </div> */}
          </div>
        </div>

        {/*  */}
        <Modal
          isOpen={showCancelModal}
          setIsOpen={setShowCancelModal}
          title="Log Out of your account"
        >
          <div>
            <p className="px-5 mt-5 text-[#334155]">
              This action will log out of this account and require you to log in
              again to gain access to your account
            </p>

            <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
              <button
                onClick={() => setShowCancelModal(false)}
                className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-2xl"
              >
                Cancel
              </button>
              <button
                className="bg-primary-red py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-2xl"
                onClick={handleSubmit(onSubmit)}
              >
                Yes, Log out
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Account;
