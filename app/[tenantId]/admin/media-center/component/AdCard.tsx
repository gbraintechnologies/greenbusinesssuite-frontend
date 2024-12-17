"use client";

import React, { useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteMediaTypeByID, changeStatus } from "@/services/features/mediaService";

interface MediaItem {
  id: number;
  mediaType: string;
  thumbnail: string;
  altText: string;
  heading: string;
  url: string;
  isActive: boolean;
  createdOn: string;
  updatedOn: string;
}

type Props = {
  ad: MediaItem;
  tenantId: string;
  refetchData: () => void;
};

function AdCard({ ad, tenantId, refetchData }: Props) {
  const { id, heading, updatedOn, url, isActive, createdOn, thumbnail } = ad;
  const router = useRouter();
  const [isActivated, setIsActivated] = useState(isActive); // Default the state to the blog's current status

  const toggleActivate = async () => {
    try {
      const newStatus = !isActivated;
      setIsActivated(newStatus);

      await changeStatus(id, newStatus);
      toast.success(`Ad has been ${newStatus ? "activated" : "deactivated"} successfully!`);
      refetchData();
    } catch (error) {
      toast.error("An error occurred while updating the Ad status.");
    }
  };

  const handleDelete = async () => {
    try {
      const loading = toast.loading("Deleting ad...");
      await deleteMediaTypeByID(id);
      toast.success("Ad deleted successfully!");
      toast.dismiss(loading);
      refetchData();
    } catch (error) {
      toast.error("An error occurred while deleting the ad.");
    }
  };

  const options = [
    {
      title: "View Ads",
      func: () => router.push(`/${tenantId}/admin/media-center/view-ad?id=${id}`),
    },
    {
      title: "Edit Ads",
      func: () => router.push(`/${tenantId}/admin/media-center/edit-ad?id=${id}`),
    },
    {
      title: "Go to Link",
      func: () => window.open(url, "_blank"),
    },
    {
      title: isActivated ? "Deactivate" : "Activate", // Show the opposite status in the dropdown
      func: toggleActivate, // Toggle status on click
    },
    {
      title: "Delete",
      func: async () => await handleDelete(),
    },
  ];

  return (
    <div className="w-full rounded-lg shadow-md bg-[#F8FAFC]">
      {/* Thumbnail */}
      <div className="relative w-full h-[10rem] rounded-t-lg overflow-hidden cursor-pointer">
        <img
          src={thumbnail}
          alt={heading}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="p-3">
        {/* Date */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500">{updatedOn}</p>
        </div>

        {/* Title */}
        <p className="text-sm font-bold text-gray-700 mt-2">{heading}</p>

        {/* Activate/Deactivate */}
        <div className="flex items-center justify-start mt-2">
          <p
            className={`px-4 py-2 text-sm font-medium rounded-md ${isActivated ? "text-green-600" : "text-red-600"}`}
          >
            {isActivated ? "Activate" : "Deactivate"} {/* Just display the current status */}
          </p>
        </div>

        {/* Footer: Created Date & Menu */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-600">Created on {createdOn}</p>

          {/* Dropdown Menu */}
          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="text-gray-700 hover:text-gray-900">
                <BsThreeDots className="w-5 h-5" />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 -top-2 w-40 rounded-lg shadow-md bg-white flex flex-col text-left z-50">
                {options.map((option, idx) => (
                  <Menu.Item key={idx}>
                    <div>
                      <button
                        className={`${option.title.toLowerCase() === "delete"
                          ? "text-red-600"
                          : "text-gray-500"
                          } py-3 px-4 font-light hover:bg-gray-50 w-full text-left`}
                        onClick={option.func}
                      >
                        {option.title}
                      </button>
                      {idx % 2 === 0 && (
                        <div className="border-t-[1px] border-gray-200 mx-auto w-[80%] text-center" />
                      )}
                    </div>
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default AdCard;
