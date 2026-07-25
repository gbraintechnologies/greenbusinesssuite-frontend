"use client";
import Modal from "@/components/Modal/Modal";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import UserForm from "../components/UserForm";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import DeleteUser from "@/app/(admin)/(pages)/usermanagement/actions/DeleteUser";

import { IoIosArrowBack } from "react-icons/io";
import { BsTrash } from "react-icons/bs";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const search = useSearchParams();
  const params = useParams();
  const tenantId = params?.tenantId as string | undefined;

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
      <div className="flex h-[20rem] items-center justify-center">
        <div>
          <LoadingIcon />
          <p className="mt-2 text-xs text-gray-500">Fetching user details</p>
        </div>
      </div>
    );
  }

  const displayName =
    `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`.trim() ||
    userData?.email ||
    "this user";

  return (
    <div className="mt-10 px-5 pb-40">
      <div className="my-3 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="flex items-center gap-2 text-sm"
          onClick={() => router.back()}
        >
          <IoIosArrowBack size={12} /> Go Back
        </button>

        {id && (
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            <BsTrash /> Delete User
          </button>
        )}
      </div>

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
          <p className="mt-5 px-5 text-[#334155]">
            Discard changes would delete all the changes you have made. <br />{" "}
            Nothing would be saved.
          </p>

          <div className="mt-5 flex justify-between border-t border-t-gray-200 bg-[#F1F5F9] p-5">
            <button
              type="button"
              onClick={() => setShowCancelModal(false)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-8 py-2 text-sm text-primary-dark shadow-md hover:opacity-95"
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-primary-red px-4 py-3 text-sm text-white shadow-md hover:opacity-95"
              onClick={() => {
                router.back();
              }}
            >
              Yes, discard changes
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
        title={`Delete "${displayName}"?`}
      >
        {id && (
          <DeleteUser
            userId={id}
            userName={displayName}
            setShow={setShowDeleteModal}
            invalidateKeys={[["all users"], ["get user by id ", id]]}
            onDeleted={() =>
              router.push(
                tenantId
                  ? `/${tenantId}/admin/usermanagement`
                  : "/usermanagement"
              )
            }
          />
        )}
      </Modal>
    </div>
  );
};

export default page;
