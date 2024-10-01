"use client";
import { IFilter } from "@/types";
import React, { Fragment, useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Tabs from "../Tabs/Tabs";
import Image from "next/image";
import { Combobox, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { DatePicker } from "@nextui-org/date-picker";
import { BiChevronDown } from "react-icons/bi";
import { MdAttachFile } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { useOverlayTriggerState } from "@react-stately/overlays";

type Props = {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const Notifications: React.FC<Props> = ({ setShow }) => {
  // page and limit states for pagination
  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(4);

  //state to handle search value
  const [searchTerm, setSearchTerm] = useState("");

  //state to handle filtered companies
  const [filteredCompanies, setFilteredCompanies] = useState<any>([]);

  // get companies
  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies", page, limit],
    queryFn: services.getAllCompanies(page * limit, limit),
  });

  //fetching companies by search
  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["all users", searchTerm],
    queryFn: services.searchCompany(searchTerm),
    enabled: Boolean(searchTerm),
  });

  const filters: IFilter[] = [
    {
      id: 0,
      name: "SMS",
      value: "sms",
    },
    {
      id: 1,
      name: "Email",
      value: "email",
    }
  ];

  const [activeFilter, setActiveFilter] = useState<IFilter>({
    id: 0,
    name: "SMS",
    value: "sms",
  });

  // state to handle subject and message states
  const [inputData, setInputData] = useState<{
    subject: string;
    message: string;
  }>({
    subject: "",
    message: "",
  });

  //states to handle all companies selection
  const [selectAllCompanies, setSelectAllCompanies] = useState<any>();

  // state to handle selected Recipient
  const [selectedRecipient, setSelectedRecipient] = useState<any>({
    label: "All",
    value: "all",
  });

  // state to handle selected Company
  const [selectedCompany, setSelectedCompany] = useState<any>("");

  // state to store all selected companies
  const [selectedCompanies, setSelectedCompanies] = useState<any>([]);

  //state to handle files
  const [files, setFiles] = useState<any>([]);

  // state to handle start date and end date
  const [startDate, setStartDate] = useState<any>();

  const [endDate, setEndDate] = useState<any>();

  // Function to check if a date is unavailable for start date picker
  const isStartDateUnavailable = (date: any) => {
    if (endDate) {
      return date >= endDate; // Start date should be before the end date
    }
    return false;
  };

  // Function to check if a date is unavailable for end date picker
  const isEndDateUnavailable = (date: any) => {
    if (startDate) {
      return date <= startDate; // End date should be after the start date
    }
    return false;
  };

  // Check if all companies are selected
  const isAllSelected =
    selectedCompanies.length === filteredCompanies.length - 1; // Minus 1 to exclude the "All" option itself

  // Handle selection/deselection of all companies
  const handleSelectAll = () => {
    if (selectAllCompanies) {
      setSelectAllCompanies(false);
    } else {
      setSelectAllCompanies(true);
    }
    setSelectedCompanies([]);
  };

  // Handle individual company selection
  const handleSelectionChange = (company: any) => {
    if (company.id === "all") {
      handleSelectAll();
    } else if (selectedCompanies.some((item: any) => item.id === company.id)) {
      setSelectAllCompanies(false);
      // If the company is already selected, remove it from the selected list
      setSelectedCompanies((prev: any) =>
        prev.filter((item: any) => item.id !== company.id)
      );
    } else {
      setSelectAllCompanies(false);
      // Add the company to the selected list
      setSelectedCompanies((prev: any) => [...prev, company]);
    }
  };

  // Function to remove a company from the selected list
  const handleRemoveSelectedCompany = (company: any) => {
    setSelectedCompanies((prev: any) =>
      prev.filter((item: any) => item.id !== company.id)
    );
  };

  // recurring message types
  const recurringTypes: any = [
    {
      label: "Non-recurring",
      value: "nonRecurring",
    },
    {
      label: "Daily",
      value: "daily",
    },
    {
      label: "Weekly",
      value: "weekly",
    },
    {
      label: "Bi-weekly",
      value: "biWeekly",
    },
    {
      label: "Monthly",
      value: "monthly",
    },
    {
      label: "Quarterly",
      value: "quarterly",
    },
    {
      label: "Annually",
      value: "annually",
    },
  ];

  //state to handle recurring type
  const [recurringType, setRecurringType] = useState(recurringTypes[0]);

  // handle subject text field change
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputData((prev) => ({
      ...prev,
      subject: value,
    }));
  };

  // handle message text field change
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputData((prev) => ({
      ...prev,
      message: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (event: any) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles: any) => [...prevFiles, ...selectedFiles]);
  };

  // Handle removing a file
  const handleRemoveFile = (fileName: any) => {
    setFiles((prevFiles: any) =>
      prevFiles.filter((file: any) => file.name !== fileName)
    );
  };

  // setting filtered companies to companies on initial load
  useEffect(() => {
    if (companies?.length > 0) {
      setFilteredCompanies([{company_name: "All", id: "all"},...companies]);
    }
  }, [companies]);

  // use Effect to handle search functionality and exclude selected companies from filtered results
  useEffect(() => {
    if (searchTerm.length > 0 && searchData) {
      setFilteredCompanies(
        searchData.filter(
          (company: any) =>
            !selectedCompanies.some(
              (selected: any) => selected.id === company.id
            )
        )
      );
    } else if (companies && searchTerm.length < 1) {
      setFilteredCompanies([
        {company_name: "All", id: "all"},...companies.filter(
          (company: any) =>
            !selectedCompanies.some(
              (selected: any) => selected.id === company.id
            )
        )]
      );
    }
  }, [searchTerm, companies, searchData, selectedCompanies]);

  useEffect(() => {
    if (filteredCompanies?.length < 1 && searchTerm.length < 1) {
      setLimit(limit + 5);
    }
  },[filteredCompanies])

  const state = useOverlayTriggerState({});

  return (
    <div className="bg-white h-auto">
      <header className="flex justify-between items-center shadow-lg">
        <div></div>
        <div className="text-[#475569] font-semibold text-lg">Send {activeFilter?.name}</div>
        <IoIosCloseCircleOutline
          color="#94A3B8"
          onClick={() => setShow(false)}
          size={30}
        />
      </header>
      <div className="bg-[#F2F4F7] px-4 py-2">
        <div className="bg-white px-4 rounded-lg pt-6 pb-3">
          <div className="flex justify-center  ">
            <Tabs
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              filters={filters}
            />
          </div>

          <div className="input-holder">
            <label>Subject</label>
            <input
              type="text"
              value={inputData.subject}
              onChange={handleSubjectChange}
              placeholder="Type message subject here"
              className="text-sm"
            />
          </div>

          <div className="input-holder">
            <label>Message</label>
            <textarea
              value={inputData.message}
              onChange={handleMessageChange}
              placeholder="Type message here"
              className="text-sm"
            />
          </div>
          {!(activeFilter?.id == 0) && (
            <div>
              <label className="text-xs mb-1 font-normal text-slate-700">
                Add Files
              </label>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 my-2">
                  {files?.map((file: any, index: any) => (
                    <div key={index} className="flex gap-2">
                      <p className="text-sm text-[#334155]">{file?.name}</p>
                      <RiDeleteBin5Line
                        color="#DC2626"
                        size={20}
                        onClick={() => handleRemoveFile(file.name)}
                        className="cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="w-fit mb-4">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc"
                  style={{ display: "none" }}
                  id="file-input"
                />
                <label
                  className="bg-primary-green cursor-pointer flex gap-2 py-3 text-white text-center text-sm px-4 hover:opacity-95 items-center rounded-lg w-full"
                  htmlFor="file-input"
                >
                  {" "}
                  Select File
                  <MdAttachFile color="white" size={20} />
                </label>
              </div>
            </div>
          )}
          <div className="mb-4 hide-input-borders input-holder">
            <label className="text-xs mb-1 font-normal text-slate-700">
              Company
            </label>
            {/* <div className="border w-full flex gap-2 flex-wrap py-2 px-1 border-[#E2E8F0] bg-[#F8FAFC]  rounded-lg my-1 shadow-sm">
                  <div className="flex flex-wrap flex-1 gap-2">
                    {selectedCompanies?.map((company: any) => (
                      <div
                        className="border border-[#E2E8F0] bg-white px-2 py-1 flex gap-2 items-center rounded-lg z-[200000]"
                        // onMouseDown={(e) => {
                        //   e.stopPropagation();
                        // }}
                      >
                        <p className="text-sm text-slate-900">
                          {company?.company_name}{" "}
                        </p>
                        <div className="cursor-pointer">
                          <IoIosCloseCircleOutline
                            color="#DC2626"
                            size={20}
                            onClick={() => handleRemoveSelectedCompany(company)}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="input-holder">
                      <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    {selectedCompanies?.length < 1 && (
                      
                      <div className="input-holder">
                        <input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search Company"
                        />
                      </div>
                    )}
                  </div>
                  <div className="">
                    <BiChevronDown size={21} color="#94A3B8" />
                  </div>
            <Autocomplete>
              {[
                  { company_name: "All", id: "all" },
                  ...filteredCompanies,
                ]?.map((company: any) => (
                <AutocompleteItem
                
                  key={company?.id}
                  value={company?.company_name}
                  className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[rgb(241,245,249)]"
                  onPress={() => {
                    console.log('pressing.... ')
                    handleSelectionChange(company);
                  }}

                  onPressStart={() => {
                    console.log('press start')
                  }}
                >
                  {company?.company_name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            </div> */}

            <Popover placement="bottom" state={state}>
              <PopoverTrigger>
                <div
                  className="border w-full flex gap-2 flex-wrap py-2 px-1 border-[#E2E8F0] bg-[#F8FAFC]  rounded-lg my-1 shadow-sm"
                  onClick={() => state.open()}
                >
                  <div className="flex flex-wrap flex-1 gap-2">
                    {selectedCompanies?.map((company: any) => (
                      <div
                        className="border border-[#E2E8F0] bg-white px-2 py-1 flex gap-2 items-center rounded-lg z-[200000]"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <p className="text-sm text-slate-900">
                          {company?.company_name}{" "}
                        </p>
                        <div
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <IoIosCloseCircleOutline
                            color="#DC2626"
                            size={20}
                            onClick={() => handleRemoveSelectedCompany(company)}
                          />
                        </div>
                      </div>
                    ))}
                    {selectedCompanies?.length < 1 && !selectAllCompanies && (
                      <div className="w-full px-3 flex justify-between items-center">
                        <p className="text-sm text-slate-900">
                          Select companies
                        </p>{" "}
                      </div>
                    )}
                    {selectAllCompanies && (
                      <div className="w-full px-3 flex justify-between items-center">
                        <p className="text-sm text-slate-900">All</p>{" "}
                      </div>
                    )}
                  </div>
                  <div>
                    <BiChevronDown size={21} color="#94A3B8" />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="bg-white border rounded-lg border-[#E2E8F0] w-[28rem]">
                <div className="input-holder">
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {[
                  
                  ...filteredCompanies,
                ]?.map((company: any) => (
                  <div
                    className="items-center cursor-pointer w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                    onClick={() => {
                      handleSelectionChange(company);
                    }}
                  >
                    {company?.company_name}
                  </div>
                ))}
                {filteredCompanies?.length < 1 && (
                  <p className="text-slate-900 text-sm">No results</p>
                )}
                {!searchTerm && (
                  <button
                    className=" cursor-pointer bg-gray-400 flex gap-2 py-3 text-white text-center justify-center text-sm px-4 hover:opacity-95 items-center rounded-lg w-full"
                    onClick={() => setLimit(limit + 5)}
                  >
                    Load more...
                  </button>
                )}
              </PopoverContent>
            </Popover>
            {/* <Autocomplete
              variant="bordered"
              className="w-full "
              placeholder={"Search Company"}
              selectedKey={selectedCompany}
              scrollShadowProps={{
                isEnabled: false,
              }}
              popoverProps={{
                offset: 10,
                classNames: {
                  content:
                    "shadow-md bg-white border border-[#F1F5F9] p-0 rounded-lg min-w-72 flex flex-col gap-3",
                },
              }}
              onSelectionChange={(key: any) => {
                setSelectedCompany(key);
              }}
              classNames={{
                base: "flex w-full bg-slate-50 h-auto rounded-lg border border-[#E2E8F0]",
              }}
            >
              {companies?.map((company: any) => (
                <AutocompleteItem
                  key={company?.id}
                  value={company?.company_name}
                  className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[rgb(241,245,249)]"
                  startContent={
                    <img
                      src={company?.company_logo}
                      style={{
                        height: "24px",
                        width: "24px",
                        borderRadius: "50%",
                      }}
                    />
                  }
                >
                  {company?.company_name}
                </AutocompleteItem>
              ))}
            </Autocomplete> */}
          </div>
          <div className="mb-4 flex flex-col">
            <label className="text-xs mb-1 font-normal text-slate-700">
              Recipients
            </label>
            <Dropdown>
              <DropdownTrigger>
                <button className="outline-none border w-full py-2 px-1 border-[#E2E8F0] bg-[#fcfdff]  rounded-lg my-1 shadow-sm">
                  <div className="flex gap-2 w-full justify-between items-center py-0 px-3">
                    <p className=" font-medium text-sm">
                      {selectedRecipient?.label}
                    </p>

                    <div className="">
                      <BiChevronDown size={21} color="#94A3B8" />
                    </div>
                  </div>
                </button>
              </DropdownTrigger>
              <DropdownMenu
                className="shadow-md bg-white border border-[#F1F5F9] w-[34rem]  -mt-4 rounded-lg flex flex-col gap-3"
                aria-label="Static Actions"
              >
                <DropdownItem
                  key="view"
                  className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                  onClick={() =>
                    setSelectedRecipient({ label: "All", value: "all" })
                  }
                >
                  All
                </DropdownItem>
                <DropdownItem
                  key="view"
                  className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                  onClick={() =>
                    setSelectedRecipient({
                      label: "Company Admin",
                      value: "companyAdmin",
                    })
                  }
                >
                  Company Admin
                </DropdownItem>
                <DropdownItem
                  key="view"
                  className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                  onClick={() =>
                    setSelectedRecipient({
                      label: "Contact Person",
                      value: "contactPerson",
                    })
                  }
                >
                  Contact Person
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="bg-white px-4 rounded-lg mt-6 py-3">
          <div className="mb-4 flex flex-col">
            <label className="text-xs mb-1 font-normal text-slate-700">
              Recurring Message
            </label>
            <Dropdown>
              <DropdownTrigger>
                <button className="outline-none border w-full py-2 px-1 border-[#E2E8F0] bg-[#fcfdff]  rounded-lg my-1 shadow-sm">
                  <div className="flex gap-2 w-full justify-between items-center py-0 px-3">
                    <p className=" font-medium text-sm">
                      {recurringType?.label}
                    </p>

                    <div className="">
                      <BiChevronDown size={21} color="#94A3B8" />
                    </div>
                  </div>
                </button>
              </DropdownTrigger>
              <DropdownMenu
                className="shadow-md bg-white border border-[#F1F5F9] w-[34rem]  -mt-4 rounded-lg flex flex-col gap-3"
                aria-label="Static Actions"
              >
                {recurringTypes?.map((recurringType: any) => (
                  <DropdownItem
                    key="view"
                    className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                    onClick={() => setRecurringType(recurringType)}
                  >
                    {recurringType.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className="mb-4 flex flex-col">
            <label className="text-xs mb-1 font-normal text-slate-700">
              Start Date
            </label>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              className="max-w-full text-[#334155] text-sm font-medium border w-full px-1 border-[#E2E8F0] bg-[#fcfdff]  rounded-lg my-1 shadow-sm "
              variant="flat"
              classNames={{
                popoverContent: "bg-white border border-[#E2E8F0] rounded-lg",
              }}
              isDateUnavailable={isStartDateUnavailable}
            />
          </div>
          <div className="mb-4 flex flex-col">
            <label className="text-xs mb-1 font-normal text-slate-700">
              End Date
            </label>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              className="max-w-full text-[#334155] text-sm font-medium border w-full px-1 border-[#E2E8F0] bg-[#fcfdff]  rounded-lg my-1 shadow-sm "
              variant="flat"
              classNames={{
                popoverContent: "bg-white border border-[#E2E8F0] rounded-lg",
              }}
              isDateUnavailable={isEndDateUnavailable}
            />
          </div>
        </div>

        <div className="mt-4 mb-2">
          <button className="bg-primary-green disabled:bg-gray-400 py-3 text-white text-center text-sm px-4 hover:opacity-95 items-center rounded-lg w-full">
            {" "}
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
