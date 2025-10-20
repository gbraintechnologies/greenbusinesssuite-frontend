import DatePicker from "@/components/DatePicker/DatePicker";
import EmptyList from "@/components/Form/EmptyList";
import FormCard from "@/components/Form/FormCard";
import Loader from "@/components/Loader/Loader";
import NoDataIndicator from "@/components/NoDataIndicator/NoDataIndicator";
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
      {" "}
      {companyData && companyData?.companyAdminId ? (
        <>
          <div className="min-h-[40vh]">
            <div className="flex items-center justify-between mb-2 mt-2">
              <div className=" w-full text-[#475569] font-medium my-4 text-base">
                Assigned Forms
              </div>
              {/* ASSIGN NEW FORM */}
              <button
                className=" bg-white border border-[rgba(226, 232, 240, 1)] flex max-w-64 text-sm px-4 py-2 hover:opacity-95 items-center justify-center gap-2 rounded-lg w-full "
                onClick={() => setShowAssignModal(true)}
              >
                <GoPlusCircle /> Assign New Form
              </button>
            </div>

            {/* PAGINATION AND TIMELINE FILTER*/}
            <div className="flex justify-between mb-3">
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

            {/* LOADING FORMS */}
            {formsLoading && <Loader text="Fetching forms" />}
            {/* NO ASSIGNED FORM */}
            {assignedForms?.content?.length === 0 && (
              <div className="flex items-center justify-center w-full border rounded-xl p-20">
                <EmptyList
                  text={
                    selectedTimeline?.value == "ALL"
                      ? "No forms assigned to company"
                      : ""
                  }
                />
              </div>
            )}

            {/**DISPLAYING ASSIGNED FORMS*/}
            {assignedForms && assignedForms?.content?.length > 0 && (
              <>
                <div className="grid grid-cols-4 gap-10 ">
                  {assignedForms &&
                    assignedForms?.content?.map((form: any) => {
                      return (
                        <FormCard key={form.id} form={form} noMetaData={true} />
                      );
                    })}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div>
          <NoDataIndicator
            title="No Administrator"
            text="Please assign an admin to the company before assigning forms"
          />
        </div>
      )}
    </div>
  );
};

export default AssignedForms;
