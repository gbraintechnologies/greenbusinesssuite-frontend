"use client";
import EmptyList from "@/components/Form/EmptyList";
import FormCard from "@/components/Form/FormCard";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import Forms from "../../forms/page";

type Props = {
  companyName: string;
};

const AssignForm = ({ companyName }: Props) => {
  const { data: allForms, isLoading } = useQuery({
    queryKey: ["get assigned forms"],
    queryFn: services.allForms(),
  });

  useEffect(() => {
    console.log('forms changed to ', allForms)
  }, [allForms]);
  if (isLoading ) {
    return (
      <div className="h-[20rem] flex items-center justify-center">
        <div>
          <LoadingIcon />
          <p className="mt-2 text-xs text-gray-500">Fetching forms</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white px-5 py-2">
      <div className="px-2">
        {allForms?.totalElements === 0 ? (
          <div className="">
            <EmptyList />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-5">
            {allForms &&
              allForms?.map((form: any) => {
                  return <FormCard key={form.id} form={form} />;
                })}
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <button>Discard</button>
        <button>Assign Forms</button>
      </div>
    </div>
  );
};

export default AssignForm;
