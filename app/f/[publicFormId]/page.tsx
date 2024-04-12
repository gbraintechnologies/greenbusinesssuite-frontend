"use client";

import React from "react";

//
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

//
import logo from "@/public/svg/mesh_logo.svg";
import grid from "@/public/patterns/gridpattern.svg";

//
import Loader from "@/components/BeatLoader/Loader";
import Form from "./components/Form";
import Image from "next/image";

function PublicForm({ params }: any) {
  const { publicFormId } = params;
  let formID = publicFormId;
  // Get form Details

  const { data, isLoading, fetchStatus, refetch } = useQuery({
    queryKey: ["public form", formID],
    queryFn: services.accessPublicPublishedForm(formID),
    enabled: Boolean(formID),
  });

  return (
    <div
      style={{
        backgroundImage: `url(${grid.src})`,
        backgroundRepeat: "none",
        backgroundSize: "cover",
      }}
      className="min-h-[100vh] p-20"
    >
      <div className="w-[50%]  mt-20 mx-auto min-h-[40rem]">
        <div className="flex items-center justify-center">
          <Image src={logo} alt="logo" width={150} height={200} />
        </div>

        {isLoading && (
          <div className="flex h-[20rem] items-center justify-center">
            <Loader />
          </div>
        )}

        {data && <Form form={data} />}
      </div>
    </div>
  );
}

export default PublicForm;
