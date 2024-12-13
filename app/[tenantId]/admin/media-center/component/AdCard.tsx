"use client";

import React, { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import { toast } from "sonner";

type Ad = {
    id: number;
    title: string;
    updatedOn: string;
    url: string;
    description: string;
    createdCount: number;
    thumbnailUrl: string;
};

type Props = {
    ad: Ad;
    tenantId: string;
};

function AdCard({ ad, tenantId }: Props) {
    const { id, title, updatedOn, url, description, createdCount, thumbnailUrl } = ad;
    const router = useRouter();

    // Local state for activate/deactivate
    const [isActivated, setIsActivated] = useState(true);

    // Modal control for delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Toggle Activate/Deactivate logic
    const toggleActivate = () => {
        setIsActivated((prev) => !prev);
        toast.success(
            `${isActivated ? "Ad is now deactivated!" : "Ad is activated!"}`
        );
    };

    // Dropdown Options with conditional "Activate" or "Deactivate"
    const options = [
        {
            title: "View Ads",
            func: () => router.push(`/${tenantId}/admin/media-center/view-ad`),
        },
        {
            title: "Edit Ads",
            func: () => router.push(`/${tenantId}/admin/media-center/edit-ad`),
        },
        {
            title: "Go to Link",
            func: () => window.open(url, "_blank"),
        },
        {
            title: isActivated ? "Activate" : "Deactivate", // Dynamic title for dropdown
            func: toggleActivate,
        },
        {
            title: "Delete",
          //  func: () => (),
        },
    ];

    return (
        <>
            <div className="w-full rounded-lg shadow-md bg-[#F8FAFC]">
                {/* Thumbnail Image without Play Button Overlay */}
                <div
                    onClick={() => router.push(`/ads/${id}`)}
                    className="relative w-full h-[10rem] rounded-tl-lg rounded-tr-lg cursor-pointer overflow-hidden"
                >
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Card Content */}
                <div className="p-3">
                    {/* Date on the left */}
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500">{updatedOn}</p>
                    </div>

                    {/* Bold Description */}
                    <p className="text-sm font-bold text-gray-700 mt-2">
                        {description}
                    </p>

                    {/* Activate/Deactivate Button */}
                    <div className="flex items-center justify-start mt-2">
                        <p
                            className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer ${isActivated
                                ? "text-red-600"
                                : "text-green-600"
                                }`}
                            onClick={toggleActivate}
                        >
                            {isActivated ? "Deactivate" : "Activate"} {/* Dynamic text for the card */}
                        </p>
                    </div>

                    {/* View Count & Three Dots Inline */}
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-xs text-gray-600">
                            Created {createdCount}{" "}
                            {createdCount === 1 ? "time" : "times"}
                        </p>
                        {/* Three Dots Dropdown */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="text-gray-700 hover:text-gray-900">
                                <BsThreeDots className="w-5 h-5" />
                            </Menu.Button>
                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 w-40 rounded-lg shadow-lg bg-white">
                                    {options.map((option, idx) => (
                                        <Menu.Item key={idx}>
                                            <button
                                                className={`${option.title === "Delete"
                                                    } py-2 px-4 font-light hover:bg-gray-50 w-full text-left`}
                                                onClick={option.func}
                                            >
                                                {option.title}
                                            </button>
                                        </Menu.Item>
                                    ))}
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>

            {/* DELETE AD MODAL */}
          
        </>
    );
}

export default AdCard;
