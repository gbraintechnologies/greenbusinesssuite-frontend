"use client";

import { useQuery } from "@tanstack/react-query";
import "./index.css";
import UpdateInfo from "@/public/svg/updateInfo.svg";
// import Logo from "@/public/svg/companylogo.png";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import services from "@/services";
import { CompanyInfo } from "@/types";

const Page = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");


  console.log("search params ", id);

  const { data: companies, isLoading } = useQuery({
    queryKey: ["all companies"],
    queryFn: services.getAllCompanies(),
  });

  const companyData: CompanyInfo = companies?.find((company: CompanyInfo) => company.id === Number(id));

  console.log('comopany data ', companyData)

  const companyDescription = companyData?.custom_fields?.find((field) => field.custom_profile_item_id == 1)?.value ?? "";

  const companyAdminName = companyData?.custom_fields?.find((field) => field.custom_profile_item_id == 2)?.value ?? "";

  const companyAdminEmail = companyData?.custom_fields?.find((field) => field.custom_profile_item_id == 3)?.value ?? "";
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
    <div className="px-5 pb-10">
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

      {/* COMPANY NAME AND STATUS */}
      <div className="w-full mt-4 px-9 py-4 flex justify-between items-center bg-[#F8FAFC] h-48 rounded-xl">
        <div className="flex gap-5 items-center justify-center">
          <Image
            src={companyData?.company_logo || ""}
            width={144}
            height={144}
            className="rounded-full w-36 h-36 object-cover border border-[rgba(226, 232, 240, 1)]"
            alt="Company Logo"
          />
          <div className="flex flex-col gap-3">
            <div className="label">Company Name</div>
            <div className="header">{companyData?.company_name}</div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="label">Status</div>
          <button className=" border border-[rgba(226, 232, 240, 1)] text-sm bg-white flex items-center h-9 rounded-lg shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] gap-2 px-3">
            {companyData?.status}
            <div className="border-r-[0.3px] border-opacity-50 border-[rgba(226, 232, 240, 1)] h-10"></div>
            <IoIosArrowDown />
          </button>
        </div>
      </div>

      {/* COMPANY BODY */}
      <div className="max-w-2xl py-5 pb-3">
        <div className="group">
          <div className="label">Company description</div>
          <div className="value">{companyDescription}</div>
        </div>
        <div className="group">
          <div className="label">Industry</div>
          <div className="value">{companyData?.industry}</div>
        </div>
        <div className="group">
          <div className="label">Contact person</div>
          <div className="value">{companyData?.primary_contact_name}</div>
        </div>
        <div className="flex justify-between">
          <div className="group">
            <div className="label">Phone Number</div>
            <div className="value">{companyData?.primary_contact_phone_number}</div>
          </div>
          <div className="group">
            <div className="label">Email</div>
            <div className="value">{companyData?.primary_contact_email}</div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="group">
            <div className="label">Admin Name</div>
            <div className="value">{companyAdminName}</div>
          </div>
          <div className="group">
            <div className="label">Email</div>
            <div className="value">{companyAdminEmail}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
