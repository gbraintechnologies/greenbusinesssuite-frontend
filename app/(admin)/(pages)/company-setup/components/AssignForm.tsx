"use client";
import DatePicker from "@/components/DatePicker/DatePicker";
import EmptyList from "@/components/Form/EmptyList";
import FormCard from "@/components/Form/FormCard";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import services from "@/services";
import { TimelineType, TimelineValues } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  companyId: string | number | null;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  queryClient: any;
};

const AssignForm = ({ companyId, setShow, queryClient }: Props) => {
  const [selected, setSelected] = React.useState<any>();
  const [isLoading, setLoading] = React.useState(false);

  //pagination
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(12);

  //timeline
  const [selectedTimeline, setSelectedTimeline] = React.useState<
    { label: TimelineValues; value: TimelineType } | undefined
  >();

  const { data: allForms, isLoading: areFormsLoading } = useQuery({
    queryKey: ["unassigned forms", page, limit, selectedTimeline?.value],
    queryFn: services.getUnassignedForms(page, limit, selectedTimeline?.value),
  });

  // React.useEffect(() => {
  //   if (searchTerm === "") {
  //     setFilteredForms(allForms);
  //   } else {
  //     setFilteredForms(
  //       allForms.filter((form: any) =>
  //         form.name
  //           .toLowerCase()
  //           .replace(/\s+/g, "")
  //           .includes(searchTerm.toLowerCase().replace(/\s+/g, ""))
  //       )
  //     );
  //   }
  // }, [allForms, searchTerm]);

  React.useEffect(() => {
    setSelected(null);
  }, [page, selectedTimeline]);

  const assignFormToCompany = async () => {
    setLoading(true);
    try {
      await services.assignFormToCompany(selected, companyId!);
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
          <p className="mt-2 text-xs text-gray-500">
            Fetching unassigned forms
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className=" h-full px-5 py-2">
      <div className="px-2">
        <div className="flex justify-between items-center">
          <DatePicker
            selectedTimeline={selectedTimeline}
            setSelectedTimeline={setSelectedTimeline}
          />
          <Pagination
            limit={limit}
            variant="no-text"
            page={page}
            currentData={allForms?.content}
            setPage={setPage}
          />
        </div>
        {allForms?.content?.length === 0 ? (
          <div className="mb-2">
            <EmptyList text="You do not have any unassigned forms." />
          </div>
        ) : (
          <>
            <div className="my-4 grid h-full grid-cols-2 gap-2.5 overflow-y-auto sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
              {allForms?.content &&
                allForms.content
                  .filter((item: any) => !item?.isTemplate)
                  .map((form: any, index: number) => (
                    <div
                      key={`assign-form-${form?.id ?? "row"}-${index}`}
                      className={
                        selected === form.id
                          ? "h-fit w-auto rounded-lg border-2 border-green-400 drop-shadow-main"
                          : ""
                      }
                    >
                      <FormCard
                        form={form}
                        noMetaData={true}
                        onClick={() => setSelected(form.id)}
                      />
                    </div>
                  ))}
            </div>
          </>
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
