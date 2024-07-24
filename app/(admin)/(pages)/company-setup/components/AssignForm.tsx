"use client";
import EmptyList from "@/components/Form/EmptyList";
import FormCard from "@/components/Form/FormCard";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import SearchBox from "@/components/SearchBox/SearchBox";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
  companyId: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  queryClient: any;
};

const AssignForm = ({ companyId, setShow, queryClient }: Props) => {
 

  const { data: allForms, isLoading: areFormsLoading } = useQuery({
    queryKey: ["get all forms"],
    queryFn: services.getUnassignedForms(),
  });

  const [selected, setSelected] = React.useState<any>();
  const [isLoading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredForms, setFilteredForms] = React.useState([]);

  React.useEffect(()=> {
    if(searchTerm === "") {
      setFilteredForms(allForms)
    } else {
      setFilteredForms(allForms.filter((form: any) => form.name.toLowerCase()
      .replace(/\s+/g, "")
      .includes(searchTerm.toLowerCase().replace(/\s+/g, ""))))
    }
  }, [allForms, searchTerm])
  const assignFormToCompany = async () => {
    setLoading(true);
    try {
      await services.assignFormToCompany(
        selected,
        companyId
      );
      // invalidate form data
      queryClient.invalidateQueries({
        queryKey: ["get assigned forms for ", Number(companyId)],
      });
      setLoading(false);

      toast.success("Company assigned successfully");
      setShow(false);
    } catch (error) {
      toast.error("An error occurred. Try again later");
      setLoading(false);
      setShow(false);
    }
  };

  if (areFormsLoading) {
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
        {allForms?.length === 0 ? (
          <div className="mb-2">
            <EmptyList text="You do not have any unassigned forms." />
          </div>
        ) : (
          <div>
            <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search by form name"/>
          <div className="grid grid-cols-3 gap-5 h-72 mb-2 overflow-scroll mt-2">
            {allForms &&
              filteredForms?.map((form: any) => {
                return (
                  <div
                    className={
                      selected === form.id
                        ? "rounded-lg border-2 border-green-400 drop-shadow-main h-fit w-auto "
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
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <button
          className="bg-white disabled:bg-gray-400 py-3 flex border border-[rgba(226, 232, 240, 1)] text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
          onClick={() => setShow(false)}
        >
          Discard
        </button>
        <button
          className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
          onClick={assignFormToCompany}
          disabled={isLoading || !selected}
        >
          Assign Form
        </button>
      </div>
    </div>
  );
};

export default AssignForm;
