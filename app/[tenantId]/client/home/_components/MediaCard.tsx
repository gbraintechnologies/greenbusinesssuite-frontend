"use client";
import { FormatDateWithSuffix } from "@/utils/FormatDate/FormatDate";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaPlay } from "react-icons/fa6";
import { MdOndemandVideo } from "react-icons/md";
import { SlPicture } from "react-icons/sl";

type MediaCardProps = {
  type: "BLOGS" | "VIDEOS" | "ADS";
  media: any;
};
const MediaCard: React.FC<MediaCardProps> = ({ type, media }) => {
  return (
    <Link
      className="border border-[#F1F5F9] shadow-sm rounded-lg p-3 cursor-pointer"
      href={media?.url}
      target="_blank"
      rel="noreferrer"
    >
      <div>
        {media?.thumbnail ? (
          type == "VIDEOS" ? (
            <label
              className="flex justify-center items-center cursor-pointer rounded-lg w-full h-36 text-center relative"
              style={{
                backgroundImage: `url(${media?.thumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 h-full rounded-lg"></div>
              <div className="flex absolute w-full items-center justify-center">
                <FaPlay color="white" size={30} />
              </div>
            </label>
          ) : (
            <Image
              src={media?.thumbnail}
              width={200}
              height={150}
              alt={media?.altText}
              className="w-full !h-[150px] rounded-md object-cover"
            />
          )
        ) : (
          <div className="border border-[#E2E8F0] bg-[#F8FAFC] w-full flex flex-col items-center justify-center rounded-lg h-36">
            {type == "VIDEOS" ? (
              <MdOndemandVideo color="#E2E8F0" size={50} />
            ) : (
              <SlPicture color="#E2E8F0" size={50} />
            )}
            <p className="text-sm text-[#94A3B8]">{media?.altText}</p>
          </div>
        )}
      </div>
      <h1 className="my-2 text-sm text-[#334155] font-medium">
        {media?.heading}
      </h1>
      {type !== "ADS" && (
        <p className="text-[#94A3B8] font-medium text-xs">
          {FormatDateWithSuffix(media?.updatedOn, "text")}
        </p>
      )}
    </Link>
  );
};

export default MediaCard;
