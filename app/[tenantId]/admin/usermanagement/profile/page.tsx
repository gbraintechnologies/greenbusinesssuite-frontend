"use client";
import Modal from "@/components/Modal/Modal";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import UserForm from "../components/UserForm";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

import { IoIosArrowBack } from "react-icons/io";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const search = useSearchParams();

  const id = search.get("id");

  const { data: userData, isLoading } = useQuery({
    queryKey: ["get user by id ", id],
    queryFn: services.userByID(id),
  });

  const initialValues = {
    firstname: userData?.first_name,
    lastname: userData?.last_name,
    email: userData?.email,
  };

  const [phone, setPhone] = useState("");

  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [profilePic, setProfilePic] = useState(""); // For Profile Picture

  const router = useRouter();

  useEffect(() => {
    let phone = userData?.mobile_phone_number;
    phone?.charAt(0) == "0" ? (phone = phone.replace("0", "233")) : phone;
    setPhone(phone);

    setProfilePic(
      userData?.custom_profile_values?.find(
        (item: any) => item?.custom_profile_item_id === 1
      )?.value
    );
  }, [userData]);

  if (isLoading) {
    return (
      <div className="h-[20rem] flex items-center justify-center">
        <div>
          <LoadingIcon />
          <p className="mt-2 text-xs text-gray-500">Fetching user details</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="pb-40 mt-10 px-5">
        <button
          className="my-3 flex text-sm items-center gap-2"
          onClick={() => router.back()}
        >
          <IoIosArrowBack size={12} /> Go Back
        </button>
        <UserForm
          initialValues={initialValues}
          submitFn={() => {}}
          loading={loading}
          setLoading={setLoading}
          phone={phone}
          setPhone={setPhone}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          readonly={true}
          roleId={userData?.profiles[0]?.role_id}
          profilePic={profilePic}
          setProfilePic={setProfilePic}
          profilePicPresentOnLoad={true}
        />
        <Modal
          isOpen={showCancelModal}
          setIsOpen={setShowCancelModal}
          title="Are you sure you want to discard all changes?"
        >
          <div>
            <p className="px-5 mt-5 text-[#334155]">
              Discard changes would delete all the changes you have made. <br />{" "}
              Nothing would be saved.
            </p>

            <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
              <button
                onClick={() => setShowCancelModal(false)}
                className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                className="bg-primary-red py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                onClick={() => {
                  router.back();
                }}
              >
                Yes, discard changes
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
};

export default page;
