import DatePicker from "@/components/DatePicker/DatePicker";
import EmptyList from "@/components/Form/EmptyList";
import FormCard from "@/components/Form/FormCard";
import Loader from "@/components/Loader/Loader";
import Pagination from "@/components/Pagination/Pagination";
import { CompanyType } from "@/types";
import React from "react";
import { GoPlusCircle } from "react-icons/go";

const AssignedForms = ({
  assignedForms,
  companyData,
  page,
  setPage,
  limit,
  setShowAssignModal,
  selectedTimeline,
  setSelectedTimeline,
  formsLoading,
}: {
  assignedForms: any;
  companyData: CompanyType | null | undefined;
  page: number;
  setPage: any;
  limit: number;
  setShowAssignModal: any;
  selectedTimeline: any;
  setSelectedTimeline: any;
  formsLoading: boolean;
}) => {
  return (
    <div>
      <div className="min-h-[40vh]">
        <div className="mb-3 mt-2 flex flex-col gap-3 sm:mb-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="my-1 w-full text-base font-medium text-[#475569] sm:my-4">
            Assigned Forms
          </div>
          <button
            type="button"
            className="flex w-full max-w-none items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 sm:max-w-64 sm:rounded-lg sm:py-2"
            onClick={() => setShowAssignModal(true)}
          >
            <GoPlusCircle /> Assign New Form
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <DatePicker
            selectedTimeline={selectedTimeline}
            setSelectedTimeline={setSelectedTimeline}
          />
          <Pagination
            limit={limit}
            variant="no-text"
            page={page}
            currentData={assignedForms?.content}
            setPage={setPage}
          />
        </div>

        {formsLoading && <Loader text="Fetching forms" />}

        {assignedForms?.content?.length === 0 && (
          <div className="flex w-full items-center justify-center rounded-xl border border-slate-200 p-8 sm:p-20">
            <EmptyList
              text={
                selectedTimeline?.value == "ALL"
                  ? "No forms assigned to company"
                  : ""
              }
            />
          </div>
        )}

        {assignedForms && assignedForms?.content?.length > 0 && (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {assignedForms.content.map((form: any, index: number) => (
              <FormCard
                key={`${form.id}-${index}`}
                form={form}
                noMetaData={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedForms;
