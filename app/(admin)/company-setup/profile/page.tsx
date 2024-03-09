"use client";

import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import UpdateInfo from "@/public/svg/updateInfo.svg";
import Image from "next/image";

const Page = () => {
  const companyInfo = {
    name: "Onica Rackspace Technology Company",
    status: "Active",
    companyDescription:
      "Discover the latest advancements in 5G technology and how it's set to transform telecommunications a",
    industry: "Technology",
    contactFirstName: "David",
    contactLastName: "Bannerman",
    phone: "+233 23 123 4567",
    contactEmail: "Johnydee@acme.com",
    adminFirstName: "Adwoa",
    adminLastName: "Yankee",
    adminEmail: "Ayankee@acme.com",
  };

  return (
    <div className="px-5 pb-20">
      {/* HEADER */}
      <div className="w-full text-primary-dark  flex justify-between items-center">
        <h3 className="font-semibold text-xl">Company Profile</h3>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
          >
            <Image src={UpdateInfo} alt="Update Info" />
            Update Information
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
