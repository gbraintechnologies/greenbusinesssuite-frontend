import Link from "next/link";
import React from "react";
import { FiHome } from "react-icons/fi";

// hooks
import useAdmin from "@/hooks/useAdmin";

//
import Image from "next/image";
import useForm from "@/hooks/useForm";

function FormTopNav() {
  //
  const { admin } = useAdmin();

  const { setView, view, form } = useForm();

  return (
    <nav className="sticky top-0 z-[200] flex h-[3.5rem] w-full items-center justify-between gap-2 bg-[#1E293B] px-2 sm:px-5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F9] sm:h-[60%] sm:w-10">
        <Link href="/" aria-label="Go home">
          <FiHome className="h-4 w-4 text-slate-500 sm:h-[18px] sm:w-[18px]" />
        </Link>
      </div>

      <div className="my-1 flex min-w-0 items-center gap-2 rounded-xl bg-[#334155] bg-opacity-50 p-1">
        <button
          onClick={() => setView("builder")}
          className={`${
            view === "builder" ? "bg-white font-medium" : "text-[#64748B] "
          } truncate rounded-lg p-1 px-3 text-xs sm:px-10 sm:text-sm`}
        >
          Form builder
        </button>
        {/* <button
          disabled
          onClick={() => setView("connect")}
          className={`${
            view === "connect" ? "bg-white font-medium" : " text-[#64748B]"
          } p-1 rounded-lg disabled:cursor-not-allowed px-10`}
        >
          Connect
        </button> */}
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden h-7 border-r border-[0.8px] border-[#E2E8F0] border-opacity-20 sm:block"></div>
        <Link href="/settings">
          {admin?.custom_profile_values &&
          admin?.custom_profile_values.find(
            (item: any) => item.custom_profile_item_id === 1
          )?.value?.length > 1 ? (
            <Image
              alt="profile"
              src={
                admin?.custom_profile_values.find(
                  (item: any) => item?.custom_profile_item_id === 1
                ).value
              }
              width={32}
              height={32}
              className="rounded-full w-8 h-8 object-cover"
            />
          ) : (
            <button className="w-8 h-8 text-sm rounded-full flex items-center justify-center bg-[#F1F5F9]">
              {admin?.first_name && admin?.first_name[0]?.toUpperCase()}
              {admin?.last_name && admin?.last_name[0]?.toUpperCase()}
            </button>
          )}
        </Link>

        {/* TODO: NO NOTION OF WHICH COMPANY TO SHARE OR PUBLISH */}
        {/* <button className="bg-white py-2 text-sm px-3 rounded-lg">Share</button> */}
        {/* <PublishFormButton form={form} /> */}
      </div>
    </nav>
  );
}

export default FormTopNav;
