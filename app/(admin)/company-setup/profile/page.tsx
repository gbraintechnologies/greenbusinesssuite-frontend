"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import "./index.css";
import UpdateInfo from "@/public/svg/updateInfo.svg";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import services from "@/services";
import { CompanyInfo, CustomField } from "@/types";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserIcon from "@/public/icons/UserIcon";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { LuPlusCircle } from "react-icons/lu";
import { lowerCaseNoSpace } from "@/utils/LowerCaseNoSpace/LowerCaseNoSpace";
import FormCard from "@/components/Form/FormCard";
import AssignForm from "../components/AssignForm";
import Modal from "@/components/Modal/Modal";

const Page = () => {
  const [statuses, setStatuses] = useState([
    { id: 2, name: "Active", value: "ACTIVE" },
    { id: 3, name: "Inactive", value: "INACTIVE" },
  ]);

  const [activeStatus, setActiveStatus] = useState({} as any);

  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);

  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const { data: companyData, isLoading } = useQuery({
    queryKey: ["get company"],
    queryFn: services.getCompanyById(Number(id)),
  });

  const { data: assignedForms, isLoading: areFormsLoading } = useQuery({
    queryKey: ["get assigned forms"],
    queryFn: services.getFormsByCompanyName(
      lowerCaseNoSpace(companyData?.company_name)
    ),
    enabled: !!companyData?.company_name,
  });

  // const companyData: CompanyInfo = companies?.find(
  //   (company: CompanyInfo) => company.id === Number(id)
  // );

  const companyDescription =
    companyData?.company_custom_values?.find(
      (field: any) => field.custom_profile_item_id == 1
    )?.value ?? "";

  const companyAdminName =
    companyData?.company_custom_values?.find(
      (field: any) => field.custom_profile_item_id == 2
    )?.value ?? "";

  const companyAdminEmail =
    companyData?.company_custom_values?.find(
      (field: any) => field.custom_profile_item_id == 3
    )?.value ?? "";

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!companyData) return;
    const status = statuses.find(
      (status) =>
        status.value.toLowerCase() === companyData?.status?.toLowerCase()
    );
    setActiveStatus(status);
  }, [companyData]);

  const editCompanyStatus = async (status: any) => {
    let companyDataInfo = { ...companyData, status: status.value };

    const keyToDelete = "company_custom_values";

    let customFields = companyDataInfo[keyToDelete];

    delete companyDataInfo[keyToDelete];

    try {
      const response = services.editCompanyWithCustomFields(
        companyData.id,
        companyDataInfo,
        customFields
      );
      setActiveStatus(status);
      toast.success("Company status updated successfully");
    } catch (error) {
      toast.error("Failed to update company status");
    }
  };
  if (isLoading || areFormsLoading) {
    return (
      <div className="h-[20rem] flex items-center justify-center">
        <div>
          <LoadingIcon />
          <p className="mt-2 text-xs text-gray-500">Fetching company details</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="px-5 pb-10">
        {/* HEADER */}
        <div className="w-full text-primary-dark  flex justify-between items-center">
          <h3 className="font-semibold text-xl">Company Profile</h3>

          <div className="flex gap-3">
            <Link
              href={`/company-setup/profile/edit?id=${id}`}
              className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
            >
              <Image src={UpdateInfo} alt="Update Info" />
              Update Information
            </Link>
          </div>
        </div>

        {/* COMPANY NAME AND STATUS */}
        <div className="w-full mt-4 px-9 py-4 flex justify-between items-center bg-[#F8FAFC] h-48 rounded-xl">
          <div className="flex gap-5 items-center justify-center">
            {companyData?.company_logo ? (
              <Image
                src={companyData?.company_logo}
                width={144}
                height={144}
                className="rounded-full w-36 h-36 object-cover border border-[rgba(226, 232, 240, 1)]"
                alt="Company Logo"
              />
            ) : (
              <div className="rounded-full w-36 h-36 border bg-[rgba(226, 232, 240, 1)] flex items-center justify-center ">
                <UserIcon width="50" height="50" />
              </div>
            )}
            {companyData?.company_name && (
              <div className="flex flex-col gap-3">
                <div className="label">Company Name</div>
                <div className="header">{companyData?.company_name}</div>
              </div>
            )}
          </div>
          {companyData?.status && (
            <div className="flex flex-col gap-3">
              <div className="label">Status</div>
              <Menu as={"div"} className={"z-20 relative inline-block"}>
                <Menu.Button className=" border border-[rgba(226, 232, 240, 1)] text-sm bg-white flex items-center h-9 rounded-lg shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] gap-2 px-3">
                  {activeStatus?.name}
                  <div className="border-r-[0.3px] border-opacity-50 border-[rgba(226, 232, 240, 1)] h-10"></div>
                  <IoIosArrowDown />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="z-50 absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] ring-1 ring-black/5 focus:outline-none">
                    {statuses
                      .filter((status) => status.id !== activeStatus?.id)
                      .map((status) => (
                        <Menu.Item key={status.id}>
                          <button
                            className="flex hover:text-primary-dark w-24 hover:bg-gray-50 border border-[rgba(226, 232, 240, 1)] text-sm bg-white flex items-center h-9 rounded-lg px-3 py-2"
                            onClick={() => editCompanyStatus(status)}
                          >
                            {status.name}
                          </button>
                        </Menu.Item>
                      ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          )}
        </div>

        <div className="flex ">
          {/* COMPANY BODY */}
          <div className="flex-1 max-w-2xl py-5 pb-3">
            {companyDescription && (
              <div className="group">
                <div className="label">Company description</div>
                <div className="value">{companyDescription}</div>
              </div>
            )}
            {companyData?.industry && (
              <div className="group">
                <div className="label">Industry</div>
                <div className="value">{companyData?.industry}</div>
              </div>
            )}
            {companyData?.primary_contact_name && (
              <div className="group">
                <div className="label">Contact person</div>
                <div className="value">{companyData?.primary_contact_name}</div>
              </div>
            )}

            <div className="flex justify-between">
              {companyData?.primary_contact_phone_number && (
                <div className="group">
                  <div className="label">Phone Number</div>
                  <div className="value">
                    {companyData?.primary_contact_phone_number}
                  </div>
                </div>
              )}
              {companyData?.primary_contact_email && (
                <div className="group">
                  <div className="label">Email</div>
                  <div className="value">
                    {companyData?.primary_contact_email}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              {companyAdminName && (
                <div className="group">
                  <div className="label">Admin Name</div>
                  <div className="value">{companyAdminName}</div>
                </div>
              )}
              {companyAdminEmail && (
                <div className="group">
                  <div className="label">Email</div>
                  <div className="value">{companyAdminEmail}</div>
                </div>
              )}
            </div>
          </div>
          {/* ASSIGNED FORMS */}
          <div className="flex-1 py-5 pb-3 flex flex-col input-holder max-w-56">
            <div className="label">Assigned Forms ({assignedForms?.length})</div>
            {/**DISPLAYING ASSIGNED FORMS*/}
            <div className="flex flex-col gap-4 mt-2 h-96 overflow-y-scroll">
              {assignedForms &&
                assignedForms?.map((form: any) => {
                  return <FormCard key={form.id} form={form} />;
                })}
            </div>
            <button
              className="mt-4 bg-white border border-[rgba(226, 232, 240, 1)] flex text-sm px-4 py-2 hover:opacity-95 items-center justify-center gap-2 rounded-lg"
              onClick={() => setShowAssignModal(true)}
            >
              <LuPlusCircle /> Assign New Form
            </button>
          </div>
        </div>

        {/**ASSIGN FORM MODAL */}
      </div>
      <Modal
        isOpen={showAssignModal}
        setIsOpen={setShowAssignModal}
        size="big"
        title="Selected form to assign to organisation"
      >
        <AssignForm
          companyName={companyData?.company_name}
          setShow={setShowAssignModal}
          queryClient={queryClient}
        />
      </Modal>
    </>
  );
};

export default Page;
