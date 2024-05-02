"use client";
import React from "react";
import Link from "@/public/svg/link.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  fill: string;
  appTitle: string;
  appDescription: string;
  slug: string;
};
const AppCard: React.FC<Props> = ({
  fill,
  appTitle,
  appDescription,
  slug
}) => {
  const router = useRouter()
  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-4 flex flex-col w-56">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-2"
      >
        <path
          d="M21.4368 3.90871L18.7701 2.50931C16.4293 1.28089 15.2589 0.666687 13.9998 0.666687C12.7408 0.666687 11.5704 1.28089 9.22956 2.50931L8.8006 2.73442L20.698 9.53292L26.0536 6.85512C25.192 5.87935 23.8018 5.14981 21.4368 3.90871Z"
          fill={fill}
        />
        <path
          d="M26.9977 8.61915L21.6665 11.2847V15.3334C21.6665 15.8856 21.2188 16.3334 20.6665 16.3334C20.1142 16.3334 19.6665 15.8856 19.6665 15.3334V12.2847L14.9998 14.6181V27.2054C15.9571 26.967 17.0462 26.3954 18.7701 25.4907L21.4368 24.0913C24.3057 22.5858 25.7401 21.833 26.5366 20.4804C27.3332 19.1277 27.3332 17.4445 27.3332 14.078V13.922C27.3332 11.3985 27.3332 9.82079 26.9977 8.61915Z"
          fill={fill}
        />
        <path
          d="M12.9998 27.2054V14.6181L1.00202 8.61915C0.666504 9.82079 0.666504 11.3985 0.666504 13.922V14.078C0.666504 17.4445 0.666504 19.1277 1.46303 20.4804C2.25956 21.833 3.694 22.5858 6.56287 24.0913L9.22956 25.4907C10.9535 26.3954 12.0426 26.967 12.9998 27.2054Z"
          fill={fill}
        />
        <path
          d="M1.94609 6.85512L13.9998 12.882L18.548 10.6079L6.69925 3.83715L6.5629 3.90871C4.1979 5.14981 2.80771 5.87935 1.94609 6.85512Z"
          fill={fill}
        />
      </svg>
      <div className="text-slate-900 text-base font-medium">{appTitle}</div>
      <div className="text-[#475569] text-sm">
        {/* Create, tailor and assign forms to companies{" "} */}
        {appDescription}
      </div>
      <div
        className="border mt-2 border-[#E2E8F0] bg-white cursor-pointer gap-2 py-2 px-4 rounded-lg flex justify-center items-center shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)]"
        onClick={() => router.push(`/company/apps/${slug}`)}
      >
        <Image src={Link} alt="Launch" />
        <div>Launch</div>
      </div>
    </div>
  );
};

export default AppCard;
