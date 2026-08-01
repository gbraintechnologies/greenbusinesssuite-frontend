"use client";
import React from "react";
import Link from "@/public/svg/link.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RiApps2Line } from "react-icons/ri";

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
      <RiApps2Line size={28} className="mb-2" style={{ color: fill }} />
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
