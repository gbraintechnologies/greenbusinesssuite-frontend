"use client";

import CompanyLogo from "@/components/ThemeLogo/CompanyLogo";
import MeshSuiteLogo from "@/public/icons/MeshSuiteLogo";

export default function Layout({ children }: { children: React.ReactNode }) {
  const landingInfo = [
    {
      title: "Get started quickly",
      description:
        "Integrate with developer-friendly APIs or choose low-code or pre-built solutions.",
    },
    {
      title: "Support and grow your business",
      description:
        "Integrate with developer-friendly APIs or choose low-code or pre-built solutions.",
    },
    {
      title: "Join a community of businesses",
      description:
        "Integrate with developer-friendly APIs or choose low-code or pre-built solutions.",
    },
  ];
  return (
    <div className="flex h-screen bg-[#F1F5F9]">
      <div className="flex-1  w-full bg-[#F8FAFC] md:flex flex-col items-start justify-center relative hidden">
        <div className="pl-[30%] absolute top-16 left-0">
          {/* <MeshSuiteLogo /> */}
          {/* <CompanyLogo /> */}
        </div>
        {/* <div className="flex flex-col gap-4 pl-[30%] pr-[15%] ">
          {landingInfo.map((info, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="text-[#0F172A] font-bold text-lg">
                {info.title}
              </div>
              <div className="text-[#64748B] font-normal text-sm">
                {info.description}
              </div>
            </div>
          ))}
        </div> */}
        <div className="pl-[30%] pr-[15%] flex items-center justify-center">
          <CompanyLogo />
        </div>
        <div className="absolute bottom-0 left-0  w-full flex justify-center items-center gap-4 pb-4 text-[#64748B] text-xs">
          <p className="font-xs">Powered by &copy;&nbsp;Mesh Business Suite</p>
          {/* <p>&bull;&nbsp;Contact</p>
          <p>&bull;&nbsp;Privacy policy</p>{" "} */}
        </div>
      </div>
      <div className="flex-1 w-full">
        <div className="md:pl-[15%]">{children}</div>
      </div>
    </div>
  );
}
