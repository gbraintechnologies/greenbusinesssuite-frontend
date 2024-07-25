"use state";

import React from "react";

import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import services from "@/services";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import Image from "next/image";
import { toast } from "sonner";

function AssignForm({ setShow, id: formId, companies, queryClient }: any) {
  const [selected, setSelected] = useState<any>();
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const assignFormToCompany = async () => {
    setLoading(true);
    try {
      await services.assignFormToCompany(formId, selected?.id);

      // invalidate form data
      queryClient.invalidateQueries({
        queryKey: ["form", parseInt(formId)],
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

  if (companies) {
    const filteredCompanies =
      query === ""
        ? companies
        : companies?.filter((company: any) =>
            company.company_name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, ""))
          );

    return (
      <div>
        <div className="mb-20 mx-5">
          <p className="font-light mb-5">
            Select a company to assign this form to
          </p>

          <Combobox value={selected} onChange={setSelected}>
            <div className="relative mt-1">
              <div className="relative w-full">
                <p className="mb-2 text-xs">Select an organization</p>
                <Combobox.Input
                  placeholder="Search company name"
                  className="w-full text-gray-800 px-3 py-3 border border-gray-300  rounded-xl"
                  // @ts-ignore
                  displayValue={(person) => person?.company_name}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <Combobox.Options className="absolute mt-1 h-36 overflow-y-scroll w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
                  {filteredCompanies.length === 0 ? (
                    <div className="relative select-none px-4 py-2 text-gray-700">
                      No company found
                    </div>
                  ) : (
                    filteredCompanies.map((company: any) => (
                      <Combobox.Option
                        key={company?.company_name}
                        className={({ active }) =>
                          `relative  select-none cursor-pointer py-2 pl-10 pr-4 ${
                            active
                              ? "bg-gray-200 text-gray-900"
                              : "text-gray-900"
                          }`
                        }
                        value={company}
                      >
                        {({ selected, active }) => (
                          <>
                            <span className="truncate font-normal flex items-center gap-2">
                              <Image
                                src={company?.company_logo}
                                alt="Logo"
                                width={50}
                                height={50}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              {company?.company_name}
                            </span>
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>

        <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
          <button
            onClick={() => setShow(false)}
            className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className="bg-primary-green disabled:bg-gray-600 disabled:cursor-not-allowed disabled:bg-opacity-70 py-3 shadow-md flex text-white text-sm px-6 hover:opacity-95 items-center gap-2 rounded-xl"
            onClick={assignFormToCompany}
          >
            {loading ? "Assigning..." : "Assign form"}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-[20vh] flex items-center justify-center w-full">
        <LoadingIcon />
      </div>
    );
  }
}

export default AssignForm;
