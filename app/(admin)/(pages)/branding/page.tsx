"use client";

import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import services from "@/services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

function page() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["branding"],
    queryFn: services.getAllBranding(),
  });

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const deleteBranding = (id: any) => {
    toast.loading("Deleting...");
    setLoading(true);
    services
      .deleteBranding(id)
      .then((res) => {
        toast.dismiss();
        setLoading(false);
        queryClient.invalidateQueries({
          queryKey: ["branding"],
        });
        toast.success("Branding deleted");
        console.log("delete res", res);
      })
      .catch((e) => {
        setLoading(false);
        toast.dismiss();
        toast.error("Error deleting branding");
        console.log("error", e);
      });
  };

  if (data) {
    return (
      <div className="p-10">
        <h4 className="text-2xl font-bold mb-3">Branding Information</h4>
        <div className="bg-gray-100 p-4 rounded-xl">
          <div>
            <p>Total number</p>
            <p className="text-2xl font-semibold mt-3">{data?.totalElements}</p>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-4 gap-5">
          {data?.content?.map(
            (item: {
              id: number;
              tenancyId: string;
              companyId: number;
              companyName: string;
              logo: string;
              color: string;
              moduleIds: any;
              categorySpecificModuleIds: any;
            }) => {
              return (
                <div
                  key={item.id}
                  className="border flex flex-col justify-between text-left border-gray-300 p-4 rounded-xl"
                >
                  {item?.logo && item?.logo?.startsWith("https") && (
                    <Image
                      src={item.logo}
                      width={100}
                      height={100}
                      className="w-10 rounded-xl mb-2"
                      alt={item.companyName}
                    />
                  )}
                  <p>#{item.id}</p>
                  <p className="text-xl font-bold mb-4">{item.companyName}</p>
                  <p className="text-sm">
                    Tenant ID{" "}
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-xl font-medium">
                      {item.tenancyId}
                    </span>
                  </p>

                  <button
                    disabled={loading}
                    onClick={() => deleteBranding(item.id)}
                    className="text-white bg-red-800 rounded-xl text-sm px-4 w-fit mt-5 py-2"
                  >
                    Delete
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <LoadingIcon />
    </div>
  );
}

export default page;
