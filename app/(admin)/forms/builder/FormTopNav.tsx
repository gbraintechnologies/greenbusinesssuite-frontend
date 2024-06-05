import Link from "next/link";
import React from "react";

// hooks
import useAdmin from "@/hooks/useAdmin";

//
import Image from "next/image";
import useForm from "@/hooks/useForm";

// components
import PublishFormButton from "./PublishFormButton";

function FormTopNav() {
  //
  const { admin } = useAdmin();

  const { setView, view, form } = useForm();

  return (
    <nav className="h-[7vh] z-[200] sticky top-0 bg-[#1E293B] w-full flex justify-between items-center px-5">
      <div className="w-10 h-[60%] flex items-center justify-center rounded-lg bg-[#F1F5F9]">
        <Link href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="20"
            viewBox="0 0 19 20"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.37251 5.5447C3.2009 5.44562 3.11315 5.25087 3.11315 5.05271C3.11315 4.29609 3.23104 3.37372 3.88629 2.99541L7.68419 0.80269C8.87499 0.115188 10.3421 0.115188 11.5329 0.802692L15.8482 3.29415C16.2897 3.54904 16.4376 4.10612 16.4376 4.61591C16.4376 4.90049 16.3232 5.18807 16.0768 5.33037L12.0162 7.67472C11.3287 8.07166 10.4592 7.93417 9.6653 7.93417C8.79858 7.93417 7.83832 8.12304 7.08772 7.68968L3.37251 5.5447ZM0.499999 7.17253C0.499999 7.12734 0.54279 7.09488 0.587033 7.10411C0.725965 7.13312 0.869948 7.14837 1.01749 7.14837C1.78553 7.14837 2.62349 7.02733 3.28863 7.41135L7.44969 9.81373C7.52609 9.85784 7.56964 9.94161 7.56964 10.0298C7.56964 11.4786 8.77613 12.8532 8.77613 14.302L8.77613 18.8644C8.77613 19.4681 8.20707 19.9178 7.68419 19.6159L2.42435 16.5792C1.23356 15.8916 0.5 14.6211 0.5 13.2461L0.499999 7.17253ZM11.761 10.0298C11.761 11.5174 10.4813 12.9272 10.4813 14.4148L10.4813 18.8966C10.4813 19.4767 11.0305 19.906 11.5329 19.6159L16.7927 16.5792C17.9835 15.8916 18.7171 14.6211 18.7171 13.2461L18.7171 7.17253C18.7171 7.06792 18.7128 6.96391 18.7045 6.86072C18.6974 6.77386 18.6204 6.71156 18.5332 6.71156C17.8549 6.71156 17.1243 6.64066 16.5368 6.97983L11.9869 9.6067C11.8389 9.69221 11.761 9.85883 11.761 10.0298Z"
              fill="#64748B"
            />
          </svg>
        </Link>
      </div>

      <div className="bg-[#334155]  flex items-center gap-2 rounded-xl my-1 p-1 bg-opacity-50">
        <button
          onClick={() => setView("builder")}
          className={`${
            view === "builder" ? "bg-white font-medium" : "text-[#64748B] "
          } p-1 rounded-lg px-10`}
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

      <div className="flex items-center gap-3">
        <div className="border-r border-[0.8px] h-7 border-[#E2E8F0] border-opacity-20"></div>
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
