"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// icons
import { HiOutlineUser } from "react-icons/hi2";
import { GoShieldLock } from "react-icons/go";
import { AiOutlineLogout } from "react-icons/ai";

import { usePathname, useRouter } from "next/navigation";

import toast from "react-hot-toast";
import Modal from "@/components/Modal/Modal";
import Image from "next/image";

// hooks
import useUser from "@/hooks/useUser";
import useAdmin from "@/hooks/useAdmin";
import useAuth from "@/hooks/useAuth";

function SettingsSideNav() {
  const { user, setUser, removeUser } = useUser();
  const { removeAuth } = useAuth();

  const router = useRouter();

  const navigation = [
    {
      name: "Account",
      icon: <HiOutlineUser size={20} />,
      link: "/client/settings",
    },
    {
      name: "Security",
      icon: <GoShieldLock size={20} />,
      link: "/client/settings/security",
    },
  ];
  const pathname = usePathname();

  const [showLogOutModal, setShowLogOutModal] = useState(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <aside className="w-[20rem] sticky mt-4   px-5 p-2">
      {/* USER INFORMATION & PICTURE */}
      <div className="flex gap-3 items-center mb-5">
        <div className="flex items-center">
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
              width={80}
              height={80}
              className="rounded-full w-16 h-16 object-cover"
            />
          ) : (
            <button className="w-10 h-10 text-sm rounded-full flex items-center justify-center bg-[#F1F5F9]">
              {user?.first_name && user?.first_name[0]?.toUpperCase()}
              {user?.last_name && user?.last_name[0]?.toUpperCase()}
            </button>
          )}
        </div>
        <div>
          <h4 className="font-bold text-lg">
            {user?.first_name} {user?.last_name}
          </h4>
          <p className="text-sm font-light">Your personal account</p>
        </div>
      </div>

      {/* SIDE NAVIGATION: SETTINGS */}
      <ul>
        {navigation.map((item) => {
          return (
            <Link key={item.name} href={item.link}>
              <li
                className={`${
                  pathname === item.link
                    ? "bg-[#E2E8F0] text-[#1E293B] font-semibold"
                    : "text-gray-600 "
                } flex items-center gap-3 w-full mb-1 py-2 px-3 rounded-xl font-medium `}
              >
                {item.icon} <p>{item.name}</p>
              </li>
            </Link>
          );
        })}
      </ul>

      <button
        onClick={() => {
          setShowLogOutModal(true);
        }}
        className="text-[#EF4444] flex items-center gap-3 w-full mb-1 py-2 px-3 rounded-xl font-medium "
      >
        <AiOutlineLogout size={20} /> Log out
      </button>

      <Modal
        isOpen={showLogOutModal}
        setIsOpen={setShowLogOutModal}
        title="Log out of your account"
      >
        <div>
          <p className="px-5 mt-5 text-[#334155]">
            This action would log you out of this account and require you to log
            in again to gain access to your account
          </p>

          <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
            <button
              onClick={() => setShowLogOutModal(false)}
              className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              className="bg-primary-red py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
              onClick={() => {
                setShowLogOutModal(false);
                router.push("/client/auth");
                removeUser();
                removeAuth();
                setUser(null);
                toast.success("Logged out");
              }}
            >
              Yes, log out
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
}

export default SettingsSideNav;
