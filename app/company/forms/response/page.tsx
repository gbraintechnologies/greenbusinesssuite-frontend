"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import Nav from "../components/Nav";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

const Page = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const { data: form, isLoading: isFormsLoading } = useQuery({
    queryKey: ["get form by id"],
    queryFn: services.getFormById(Number(id)),
  });

  return (
    <div className="px-5 pb-20">
      <Nav
        headerLeft={
          <div className=" text-[#94A3B8] text-xl">
            Forms /
            <span className="text-black text-xl font-semibold pl-1">
              {form?.name}
            </span>
          </div>
        }
        headerRight={
            <div className="flex items-center gap-3">
                <button className="flex gap-1 shadow-lg bg-white border border-[#E2E8F0] px-4 py-3 items-center">
                    <div>Icon</div>
                    <div>Share</div>
                </button>
                </div>
        }
      />
    </div>
  );
};

export default Page;
