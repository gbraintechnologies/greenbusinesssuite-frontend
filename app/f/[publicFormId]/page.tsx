"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import grid from "@/public/patterns/gridpattern.svg";
import GreenSuiteLogo from "@/public/icons/GreenSuiteLogo";
import Loader from "@/components/BeatLoader/Loader";
import Form from "./components/Form";

function PublicForm(props: any) {
  const params: any = use(props.params);
  const { publicFormId } = params;
  let formID = publicFormId;

  const { data, isLoading } = useQuery({
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
          <GreenSuiteLogo
            variant="dark"
            layout="horizontal"
            width={200}
            height={60}
            className="h-12 w-auto"
            priority
          />
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
