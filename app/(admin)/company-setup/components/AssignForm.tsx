"use client";
import EmptyList from "@/components/Form/EmptyList";
import FormCard from "@/components/Form/FormCard";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import services from "@/services";
import { lowerCaseNoSpace } from "@/utils/LowerCaseNoSpace/LowerCaseNoSpace";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
  companyName: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const AssignForm = ({ companyName, setShow }: Props) => {
  const { data: allForms, isLoading } = useQuery({
    queryKey: ["get all forms"],
    queryFn: services.allForms(),
  });

  const [selected, setSelected] = React.useState<any>();
  const [isLpading, setLoading] = React.useState(false);

  const assignFormToCompany = async () => {
    setLoading(true);
    try {
      await services.assignFormToCompany(
        selected,
        lowerCaseNoSpace(companyName)
      );

      setLoading(false);
      toast.success("Company assigned successfully");
      setShow(false);
    } catch (error) {
      toast.error("An error occurred. Try again later");
      setLoading(false);
      setShow(false);
    }
  };

  if (isLoading) {
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
          <div className="grid grid-cols-3 gap-5 h-96 overflow-scroll">
            {allForms &&
              allForms.content?.map((form: any) => {
                return (
                  <div
                    className={
                      selected === form.id
                        ? "rounded-lg border-2 border-green-400 drop-shadow-main"
                        : " "
                    }
                  >
                    <FormCard
                      key={form.id}
                      form={form}
                      noMetaData={true}
                      onClick={() => setSelected(form.id)}
                    />
                  </div>
                );
              })}
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <button className="bg-white disabled:bg-gray-400 py-3 flex border border-[rgba(226, 232, 240, 1)] text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl">
          Discard
        </button>
        <button className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl" onClick={assignFormToCompany}>
          Assign Forms
        </button>
      </div>
    </div>
  );
};

export default AssignForm;
