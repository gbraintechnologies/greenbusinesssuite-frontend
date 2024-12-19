"use client";

import React, { useEffect } from "react";

import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import services from "@/services";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import Image from "next/image";
import { toast } from "sonner";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { RiImageCircleLine } from "react-icons/ri";

function AssignForm({ setShow, id: formId, queryClient }: any) {
  const [selected, setSelected] = useState<any>();
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const [filteredCompanies, setFilteredCompanies] = useState<any>([]);


  const { data: companies } = useQuery({
    queryKey: ["all companies"],
    queryFn: services.getAllCompanies(0, 500),
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["all users", query],
    queryFn: services.searchCompany(query),
    enabled: Boolean(query),
  });


  const assignFormToCompany = async () => {
    setLoading(true);
    try {
      await services.assignFormToCompany(formId, selected?.value?.id);

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

  useEffect(() => {
    if (query.length > 0 && searchData) {
      setFilteredCompanies(
        searchData
          ?.filter((company: any) => company?.id !== selected?.value?.id)
          .sort((a: any, b: any) =>
            a.company_name.localeCompare(b.company_name)
          )
      );
    } else if (companies && query.length < 1) {
      setFilteredCompanies(
        companies
          .filter((company: any) => company?.id !== selected?.value?.id)
          .sort((a: any, b: any) =>
            a.company_name.localeCompare(b.company_name)
          )
      );
    }
  }, [query, companies, searchData, selected]);

  useEffect(() => {
    console.log("filtered companies changed to ", filteredCompanies);
    console.log('selected', selected)
  }, [filteredCompanies, selected]);

  return (
    <div>
      <div className="mb-20 mx-5 hide-input-borders">
        <p className="text-[#334155] mb-5">
          Select a company to assign this form to
        </p>

        <Select
          options={filteredCompanies.map((company: any) => ({
            value: company, 
            label: company?.company_name,
          }))}
          components={{ Option: CustomOption }}
          onInputChange={(inputValue: string) => setQuery(inputValue)}
          onChange={(selectedOption: any) => setSelected(selectedOption)}
          value={selected}
          placeholder="Select company"
          isLoading={loading || searchLoading}
          isClearable={false}
          isOptionSelected={(option) => option.value === selected}
          styles={{
            control: (styles: any) => ({
              ...styles,
              backgroundColor: "#f8fafc",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              paddingVertical: "8px",
              paddingHorizontal: "20px",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              boxShadow: "none",
              ":hover": {
                borderColor: "#E2E8F0",
              },
            }),
            menu: (styles: any) => ({
              ...styles,
              backgroundColor: "#fff",
              borderRadius: "8px",
              marginTop: "4px",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              zIndex: 9999,
            }),
            menuList: (styles: any) => ({
              ...styles,
              padding: "0px 4px",
              maxHeight: "150px",
              overflowY: "auto",
            }),
            option: (styles: any) => ({
              ...styles,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#334155",
              cursor: "pointer",
              padding: "10px 15px",
              margin: "4px 0",
              borderRadius: "8px",
              ":hover": {
                backgroundColor: "#F1F5F9",
              },
            }),
            input: (styles: any) => ({
              ...styles,
              border: "none !important",
              borderWidth: "0px !important",
            }),
            singleValue: (styles: any) => ({
              ...styles,
              display: "flex",
              alignItems: "center",
              gap: "8px", 
            }),
          }}
        />

        {/* <Combobox value={selected} onChange={setSelected}>
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
          </Combobox> */}
      </div>

      <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
        <button
          onClick={() => setShow(false)}
          className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
        >
          Cancel
        </button>
        <button
          disabled={loading || !selected}
          className="bg-primary-green disabled:bg-gray-600 disabled:cursor-not-allowed disabled:bg-opacity-70 py-3 shadow-md flex text-white text-sm px-6 hover:opacity-95 items-center gap-2 rounded-xl"
          onClick={assignFormToCompany}
        >
          {loading ? "Assigning..." : "Assign form"}
        </button>
      </div>
    </div>
  );
}

export default AssignForm;

// custom react select option component
const CustomOption = (props: any) => {
  const { data, innerRef, innerProps } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#F1F5F9] rounded-md"
    >
      {data.value?.company_logo ? (
        <Image
          src={data.value.company_logo}
          alt={`${data.value.company_name} logo`}
          width={24}
          height={24}
          className="rounded-full object-cover w-6 h-6"
        />
      ) : (
        <div className="bg-gray-100 w-6 h-6 flex items-center justify-center font-light text-sm rounded-full">
          <RiImageCircleLine size={20} />
        </div>
      )}
      <span>{data.label}</span>
    </div>
  );
};
