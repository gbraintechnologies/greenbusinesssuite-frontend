import Link from "next/link";
import React, { useState } from "react";

// icons
import { HiOutlineUser } from "react-icons/hi2";
import { GoShieldLock } from "react-icons/go";
import { AiOutlineLogout } from "react-icons/ai";

import { usePathname, useRouter } from "next/navigation";

import toast from "react-hot-toast";
import Modal from "@/components/Modal/Modal";
import Image from "next/image";

// hooks
import useAuth from "@/hooks/useAuth";
import useCompany from "@/hooks/useCompany";

function SettingsSideNav() {
  const { companyAdmin, removeCompanyAdmin } = useCompany();
  const { removeAuth } = useAuth();

  const router = useRouter();

  const navigation = [
    {
      name: "Account",
      icon: <HiOutlineUser size={20} />,
      link: "/company/settings",
    },
    {
      name: "Security",
      icon: <GoShieldLock size={20} />,
      link: "/company/settings/security",
    },
  ];
  const pathname = usePathname();

  const [showLogOutModal, setShowLogOutModal] = useState(false);

  return (
    <aside className="w-[20rem] sticky   px-5 p-2">
      {/* USER INFORMATION & PICTURE */}
      <div className="flex gap-3 items-center mb-5">
        <div className="flex items-center">
          {companyAdmin?.custom_profile_values &&
          companyAdmin?.custom_profile_values.find(
            (item: any) => item.custom_profile_item_id === 1
          )?.value?.length > 1 ? (
            <Image
              alt="profile"
              src={
                companyAdmin?.custom_profile_values.find(
                  (item: any) => item.custom_profile_item_id === 1
                ).value
              }
              width={80}
              height={80}
              className="rounded-full w-16 h-16 object-cover"
            />
          ) : (
            <button className="w-10 h-10 text-sm rounded-full flex items-center justify-center bg-[#F1F5F9]">
              {companyAdmin?.first_name &&
                companyAdmin?.first_name[0]?.toUpperCase()}
              {companyAdmin?.last_name &&
                companyAdmin?.last_name[0]?.toUpperCase()}
            </button>
          )}
        </div>
        <div>
          <h4 className="font-bold text-lg">
            {companyAdmin?.first_name} {companyAdmin?.last_name}
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
                router.push("/company/auth");
                removeCompanyAdmin();
                removeAuth();
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
