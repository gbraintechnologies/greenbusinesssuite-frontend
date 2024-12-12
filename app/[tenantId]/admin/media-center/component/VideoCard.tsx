"use client";

import React, { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BsThreeDots } from "react-icons/bs";
import { FaPlay } from "react-icons/fa"; // Import the play icon
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import { toast } from "sonner";

type Video = {
    id: number;
    title: string;
    updatedOn: string;
    url: string;
    description: string;
    createdCount: number;
    thumbnailUrl: string; // Add video thumbnail URL
};

type Props = {
    video: Video;
};

function VideoCard({ video }: Props) {
    const { id, title, updatedOn, url, description, createdCount, thumbnailUrl } = video;
    const router = useRouter();

    // Local state for show/hide
    const [isHidden, setIsHidden] = useState(false);

    // Modal control for delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Toggle Show/Hide logic
    const toggleHide = () => {
        setIsHidden((prev) => !prev);
        toast.success(
            `${isHidden ? "Video is now visible!" : "Video is hidden!"}`
        );
    };

    // Dropdown Options
    const options = [
        {
            title: "View Video",
            func: () => router.push(`/videos/${id}`),
        },
        {
            title: "Edit Video",
            func: () => router.push(`/videos/edit/${id}`),
        },
        {
            title: "Go to Link",
            func: () => window.open(url, "_blank"),
        },
        {
            title: isHidden ? "Show" : "Hide", // Dynamic title
            func: toggleHide,
        },
        {
            title: "Delete",
            func: () => setShowDeleteModal(true),
        },
    ];

    return (
        <>
            <div className="w-full rounded-lg shadow-md bg-[#F8FAFC]">
                {/* Thumbnail Image with Play Button Overlay */}
                <div
                    onClick={() => router.push(`/videos/${id}`)}
                    className="relative w-full h-[10rem] rounded-tl-lg rounded-tr-lg cursor-pointer overflow-hidden"
                >
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <FaPlay className="w-12 h-12 text-white" />
                    </div>
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

                    {/* Show/Hide Button */}
                    <div className="flex items-center justify-start mt-2">
                        <p
                            className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer ${isHidden
                                ? "text-green-600"
                                : "text-red-600"
                                }`}
                            onClick={toggleHide}
                        >
                            {isHidden ? "Show" : "Hide"}
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

            {/* DELETE VIDEO MODAL */}
            <Modal
                isOpen={showDeleteModal}
                setIsOpen={setShowDeleteModal}
                title={`Are you sure you want to delete "${title}"?`}
            >
                <p>This action cannot be undone.</p>
            </Modal>
        </>
    );
}

export default VideoCard;
