"use client";

import { IFilter } from "@/types";

import React, { useEffect, useRef, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

// tabs
import Tabs from "../../../../../components/Tabs/Tabs";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import Select, { components } from "react-select";

// DATE TIME HELPERS

import {
  now,
  getLocalTimeZone,
  endOfMonth,
  parseDateTime,
} from "@internationalized/date";

// api
import services from "@/services";

// ui components
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { DatePicker } from "@nextui-org/date-picker";

// ICONS
import { BiChevronDown, BiSearch } from "react-icons/bi";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { useOverlayTriggerState } from "@react-stately/overlays";

//
import { toast } from "sonner";

// HOOKS
import useAdmin from "@/hooks/useAdmin";
import ComboSearch from "@/components/SearchBox/ComboSearch";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdAttachFile } from "react-icons/md";
import MultiComboSearch from "@/components/SearchBox/MultiComboSearch";
import useCompany from "@/hooks/useCompany";
import { IoCheckmark } from "react-icons/io5";

type Props = {
  // setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: any;
  isDisplayMode?: boolean;
  notification?: any;
  type?: "super-admin" | "company-admin";
};

const Notifications: React.FC<Props> = ({
  onClose,
  isDisplayMode = false,
  notification,
  type = "super-admin",
}) => {
  // page and limit states for pagination
  const [page, setPage] = useState(0);

  const { admin } = useAdmin();
  const { companyAdmin } = useCompany();

  const [limit, setLimit] = useState(4);

  const queryClient = useQueryClient();

  //state to handle search value
  const [searchTerm, setSearchTerm] = useState("");

  const [activeRecipientGroup, setActiveRecipientGroup] = useState("companies");

  //state to handle filtered companies
  const [filteredCompanies, setFilteredCompanies] = useState<any>([]);

  const [selectedCompaniesState, setSelectedCompaniesState] = useState<any>([]);

  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchMoreData = () => {
    if (limit < 14) {
      setLimit(limit + 4);
    }
  };

  // get companies
  // const { data: companies, isLoading } = useQuery({
  //   queryKey: ["companies", page, limit],
  //   queryFn: services.getAllCompanies(page * limit, limit),
  //   enabled: type === "super-admin",
  // });

  // getting all companies
  const { data: companies, isLoading } = useQuery({
    queryKey: ["all companies"],
    queryFn: services.getAllCompanies(),
    enabled: type === "super-admin",
  });

  //fetching companies by search
  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["search company", searchTerm],
    queryFn: services.searchCompany(searchTerm),
    enabled: Boolean(searchTerm) && type === "super-admin",
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
    },
  ];

  const [activeFilter, setActiveFilter] = useState<IFilter>({
    id: 1,
    name: "Email",
    value: "email",
  });

  const groupFilters: IFilter[] = [
    {
      id: 0,
      name: "Users",
      value: "Users",
    },
    {
      id: 1,
      name: "Companies",
      value: "companies",
    },
  ];
  const [activeGroupFilter, setActiveGroupFilter] = useState<IFilter>({
    id: 1,
    name: "Companies",
    value: "companies",
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
    label: "Company Admin",
    value: "companyAdmin",
  });

  // state to handle selected Company
  const [selectedCompany, setSelectedCompany] = useState<any>("");

  // state to store all selected companies
  const [selectedCompanies, setSelectedCompanies] = useState<any>([]);

  //state to handle files
  const [files, setFiles] = useState<any>([]);

  // state to handle start date and end date
  const [startDate, setStartDate] = useState<any>(now(getLocalTimeZone()));

  const [endDate, setEndDate] = useState<any>(
    endOfMonth(now(getLocalTimeZone()))
  );

  // state to handle show all recipients or just a few
  const [showAllRecipients, setShowAllRecipients] = useState(false);

  // Function to toggle the state
  const handleToggleViewRecipients = () => {
    setShowAllRecipients(!showAllRecipients);
  };

  // recipients to display
  const recipientsToDisplay = isDisplayMode
    ? showAllRecipients
      ? notification?.recipients
      : notification?.recipients.slice(0, 4)
    : 0;

  // remaining recipients
  const remainingRecipientsCount = isDisplayMode
    ? notification?.recipients.length - recipientsToDisplay.length
    : 0;

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
  // const handleSelectionChange = (company: any) => {
  //   if (company.id === "all") {
  //     handleSelectAll();
  //   } else if (selectedCompanies.some((item: any) => item.id === company.id)) {
  //     setSelectAllCompanies(false);
  //     // If the company is already selected, remove it from the selected list
  //     setSelectedCompanies((prev: any) =>
  //       prev.filter((item: any) => item.id !== company.id)
  //     );
  //   } else {
  //     setSelectAllCompanies(false);
  //     // Add the company to the selected list
  //     setSelectedCompanies((prev: any) => [...prev, company]);
  //   }
  // };

  // Function to remove a company from the selected list
  // const handleRemoveSelectedCompany = (company: any) => {
  //   setSelectedCompanies((prev: any) =>
  //     prev.filter((item: any) => item.id !== company.id)
  //   );
  // };

  const handleCompanyChange = (selectedOptions: any) => {
    setSelectedCompaniesState(selectedOptions);
    const selectedValues = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    setSelectedCompanies(selectedValues);
  };

  const handleRemoveSelectedCompany = (company: any) => {
    setSelectedCompanies((prev: any) =>
      prev.filter((item: any) => item.id !== company.value.id)
    );
  };

  // recurring message types
  const recurringTypes: any = [
    {
      label: "Non-recurring",
      value: "NON_RECURRING",
    },
    {
      label: "Daily",
      value: "DAILY",
    },
    {
      label: "Weekly",
      value: "WEEKLY",
    },
    {
      label: "Bi-weekly",
      value: "BI_WEEKLY",
    },
    {
      label: "Monthly",
      value: "MONTHLY",
    },
    {
      label: "Quarterly",
      value: "QUARTERLY",
    },
    {
      label: "Annually",
      value: "ANNUAL",
    },
  ];

  //state to handle recurring type
  const [recurringType, setRecurringType] = useState(recurringTypes[0]);

  // state to handle editing recurring type on display mode
  const [editingRecurringType, setEditingRecurringType] = useState(false);

  //state to handle saving recurring type udpate
  const [savingRecurringType, setSavingRecurringType] = useState(false);

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

  //handle changing recurring type
  const handleEditRecurringType = async () => {
    if (isDisplayMode && editingRecurringType && notification) {
      try {
        setSavingRecurringType(true);
        await services.updateRecurringMessageType(
          notification?.id,
          recurringType?.value
        );
        toast.success("Recurring type updated successfully");
        setEditingRecurringType(false);
      } catch (error) {
        console.log(error);
        toast.error("Error updating recurring type");
      } finally {
        setSavingRecurringType(false);
      }
    } else {
      setEditingRecurringType(true);
    }
  };

  // setting filtered companies to companies on initial load
  useEffect(() => {
    if (companies?.length > 0) {
      setFilteredCompanies([
        // TODO: IMPLEMENT ALL FUNCTIONALITY BY LOADING ALL COMPANIES INTO RECIPIENTS
        // { company_name: "All", id: "all" },
        ...companies.sort((a: any, b: any) =>
          a.company_name.localeCompare(b.company_name)
        ),
      ]);
    }
  }, [companies]);

  // use Effect to handle search functionality and exclude selected companies from filtered results
  // useEffect to handle search functionality and exclude selected companies from filtered results
  useEffect(() => {
    if (searchTerm.length > 0 && searchData) {
      setFilteredCompanies(
        searchData
          .filter(
            (company: any) =>
              !selectedCompanies.some(
                (selected: any) => selected?.id === company.id
              )
          )
          .sort((a: any, b: any) =>
            a.company_name.localeCompare(b.company_name)
          )
      );
    } else if (companies && searchTerm.length < 1) {
      setFilteredCompanies(
        companies
          .filter(
            (company: any) =>
              !selectedCompanies.some(
                (selected: any) => selected.id === company.id
              )
          )
          .sort((a: any, b: any) =>
            a.company_name.localeCompare(b.company_name)
          )
      );
    }
  }, [searchTerm, companies, searchData, selectedCompanies]);

  useEffect(() => {
    if (filteredCompanies.length < 1 && !searchTerm) {
      fetchMoreData();
    }
  }, [filteredCompanies]);

  // setting initial values for display mode
  useEffect(() => {
    if (isDisplayMode) {
      setRecurringType(
        recurringTypes?.find(
          (recurringType: any) =>
            recurringType?.value == notification?.recurringType
        ) || recurringTypes?.[0]
      );

      // setting initial values for start and end date
      const startDateString = new Date(notification?.startDate)
        .toISOString()
        .slice(0, 16);
      const endDateString = new Date(notification?.endDate)
        .toISOString()
        .slice(0, 16);
      setStartDate(parseDateTime(startDateString));
      setEndDate(parseDateTime(endDateString));
    }
  }, [isDisplayMode]);

  const [userSearchTerm, setUserSearchTerm] = useState("");

  const [selectedUsers, setSelectedUsers] = useState<any>([]);

  const {
    data: users,
    isLoading: loading,
    isError: error,
  } = useQuery({
    queryKey: ["user search", userSearchTerm],
    queryFn: services.searchUsers(userSearchTerm),
    enabled: !!userSearchTerm,
  });

  // SENDING EMAIL / SMS MESSAGE
  const sendMessage = async () => {
    // subject test
    if (inputData?.subject?.length < 3) {
      toast.error("Please enter a subject");
      return;
    }

    // Check for message
    if (inputData?.message?.length < 3) {
      toast.error("Please enter a message to send");
      return;
    }

    // CHECK FOR RECURRING / NON RECURRING FIRST BEFORE SPLITTING INTO TYPE OF NOTIFICATION
    // RECURRING MESSAGE

    let data: any = {
      subject: inputData?.subject,
      body: inputData?.message,
      isHtml: true,
      sender:
        type === "super-admin"
          ? admin?.first_name + " " + admin?.last_name
          : companyAdmin?.first_name + " " + companyAdmin?.last_name,
      recurringType: recurringType?.value.toUpperCase(),
    };

    if (recurringType?.value.toLowerCase() !== "non_recurring") {
      if (
        !Boolean(startDate) &&
        recurringType?.value.toLowerCase() !== "non_recurring"
      ) {
        // no start date specified
        toast.dismiss();
        toast.error("Specify the start date for recurring notification");
        return;
      }

      if (
        !Boolean(endDate) &&
        recurringType?.value.toLowerCase() !== "non_recurring"
      ) {
        // no start date specified
        toast.dismiss();
        toast.error("Specify the end date for recurring notification");
        return;
      }

      const { year, day, hour, minute, month, second, millisecond } = startDate;
      const start =
        year +
        "-" +
        month.toString().padStart(2, "0") +
        "-" +
        day.toString().padStart(2, "0") +
        "T" +
        hour.toString().padStart(2, "0") +
        ":" +
        minute.toString().padStart(2, "0") +
        ":" +
        second.toString().padStart(2, "0") +
        "." +
        millisecond +
        "Z";

      const end =
        year +
        "-" +
        endDate?.month.toString().padStart(2, "0") +
        "-" +
        endDate?.day.toString().padStart(2, "0") +
        "T" +
        endDate?.hour.toString().padStart(2, "0") +
        ":" +
        endDate?.minute.toString().padStart(2, "0") +
        ":" +
        endDate?.second.toString().padStart(2, "0") +
        "." +
        endDate?.millisecond +
        "Z";

      if (start === end) {
        toast.error("End date should be different from start date");
        return;
      }

      data = {
        ...data,
        triggerTime: start,
        startDate: start,
        endDate: end,
      };
    }

    //SMS SENDING
    if (activeFilter.id == 0) {
      if (
        type === "super-admin" &&
        activeGroupFilter?.id == 1 &&
        selectedCompanies?.length < 1
      ) {
        toast.dismiss();
        toast.error("Select recipient companies");
        return;
      }

      if (activeGroupFilter.id == 0 && selectedUsers.length < 1) {
        toast.error("Select recipients");
        return;
      }

      let recipients = [];

      // ACTIVE GROUP FILTER: COMPANY AND SUPER ADMIN TYPE
      if (
        type === "super-admin" &&
        activeGroupFilter?.id == 1 &&
        selectedRecipient.value == "companyAdmin"
      ) {
        for (let i = 0; i < selectedCompanies?.length; i++) {
          let adminId = selectedCompanies[i].company_admin_id;
          if (adminId) {
            const adminDetails = await services.userByIDRaw(adminId);
            if (adminDetails) {
              recipients.push(adminDetails?.phone_number);
            }
          }
        }
      }

      if (
        type === "super-admin" &&
        activeGroupFilter?.id == 1 &&
        selectedRecipient.value == "contactPerson"
      ) {
        for (let i = 0; i < selectedCompanies?.length; i++) {
          recipients.push(selectedCompanies[i].primary_contact_phone_number);
        }
      }

      // ACTIVE GROUP FILTER: USERS AND COMPANY ADMIN (OR SUPER ADMIN)
      // FOR SMS
      if (activeGroupFilter?.id == 0 && selectedUsers?.length > 0) {
        for (let i = 0; i < selectedUsers?.length; i++) {
          let phone = selectedUsers[i]?.phone_number;
          if (phone?.length > 5) {
            recipients.push(phone);
          }
        }
      }

      data = {
        ...data,
        isHtml: false,
        recipients: recipients,
      };

      if (recipients?.length == 0) {
        toast.error("No recipients selected");
        return;
      }

      // console.log("SENDING SMS", data);

      let loadingToast = toast.loading("Sending sms. Please wait...");
      services
        .sendSMS(data)
        .then((res) => {
          toast.dismiss(loadingToast);
          // refetch messages sent
          queryClient.invalidateQueries({
            queryKey: ["all messages"],
          });
          onClose();
          toast.success("SMS sent successfully");
        })
        .catch((e) => {
          console.log("error", e?.response?.data);
          toast.dismiss();
          toast.error("Error sending SMS");
          onClose();
        });
    }

    // EMAIL NOTIFICATION
    if (activeFilter.id == 1) {
      if (inputData.subject?.length < 2) {
        toast.error("Please enter a subject...");
        return;
      }

      if (activeGroupFilter?.id === 1 && selectedCompanies?.length < 1) {
        toast.dismiss();
        toast.error("Select recipient companies");
        return;
      }

      let recipients = [];

      if (
        activeGroupFilter?.id == 1 &&
        selectedRecipient.value == "companyAdmin"
      ) {
        for (let i = 0; i < selectedCompanies?.length; i++) {
          let adminId = selectedCompanies[i].company_admin_id;
          if (adminId) {
            const adminDetails = await services.userByIDRaw(adminId);
            if (adminDetails) {
              recipients.push(adminDetails?.email);
            }
          }
        }
      }

      if (
        activeGroupFilter?.id == 1 &&
        selectedRecipient.value == "contactPerson"
      ) {
        for (let i = 0; i < selectedCompanies?.length; i++) {
          recipients.push(selectedCompanies[i].primary_contact_email);
        }
      }

      // ACTIVE GROUP FILTER: USERS AND COMPANY ADMIN (OR SUPER ADMIN)
      // FOR EMAILS
      if (activeGroupFilter?.id == 0 && selectedUsers?.length > 0) {
        for (let i = 0; i < selectedUsers?.length; i++) {
          recipients.push(selectedUsers[i]?.email);
        }
      }

      if (recipients?.length == 0) {
        toast.error("Select recipients of notification");
        return;
      }

      // STANDARD DATA FOR NOTIFICATION
      data = {
        ...data,
        recipients: recipients,
        isHtml: true,
      };

      // console.log("EMAIL SENDING", data);

      let loadingToast = toast.loading("Sending email...");

      if (!!files?.length) {
        console.log("SENDING EMAIL with file: ", data, files[0]);
        services
          .sendEmailWithFile(data, files[0])
          .then((res) => {
            toast.dismiss(loadingToast);
            toast.success("Email sent successfully");
            onClose();
          })
          .catch((e) => {
            console.log("error", e);
            toast.dismiss();
            toast.error("Error sending email");
            onClose();
          });
      } else {
        services
          .sendEmail(data)
          .then((res) => {
            toast.dismiss(loadingToast);
            toast.success("Email sent successfully");
            onClose();
          })
          .catch((e) => {
            console.log("error", e);
            toast.dismiss();
            toast.error("Error sending email");
            onClose();
          });
      }
    }

    toast.dismiss();
  };

  const state = useOverlayTriggerState({});

  return (
    <div className="bg-white h-auto rounded-xl">
      <header className="flex justify-center items-center shadow-lg h-12">
        <div className="text-[#475569] font-semibold text-lg">
          {isDisplayMode
            ? notification?.messageType
            : `Send ${activeFilter?.name}`}
        </div>
      </header>
      <div className="bg-[#F2F4F7] px-4 py-2">
        <div className="bg-white px-4 rounded-lg pt-6 pb-3">
          {!isDisplayMode && (
            <div className="flex justify-center  ">
              <Tabs
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                filters={filters}
              />
            </div>
          )}

          <div className="input-holder">
            <label>Subject</label>
            <input
              type="text"
              value={isDisplayMode ? notification?.subject : inputData.subject}
              onChange={handleSubjectChange}
              placeholder="Type message subject here"
              className="text-sm"
              disabled={isDisplayMode}
              readOnly={isDisplayMode}
            />
          </div>

          <div className="input-holder">
            <label>Message</label>
            <textarea
              value={isDisplayMode ? notification?.body : inputData.message}
              onChange={handleMessageChange}
              placeholder="Type message here"
              rows={6}
              className={`text-sm ${isDisplayMode ? "fit-content" : ""}`}
              disabled={isDisplayMode}
              readOnly={isDisplayMode}
            />
          </div>

          {isDisplayMode && notification?.sender && (
            <div className="input-holder ">
              <label>Sender</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={notification?.sender}
                  className="text-sm "
                  disabled
                  readOnly
                />
              </div>
            </div>
          )}

          {isDisplayMode && notification?.totalRecipients > 0 && (
            <div className="input-holder">
              <label>Recipient(s)</label>
              <div className="grid grid-cols-2 gap-4">
                {recipientsToDisplay?.map((recipient: any) => (
                  <div className="border border-[#E2E8F0] px-5 py-2 flex gap-2 items-center rounded-lg z-[200000]">
                    <p className="text-sm text-slate-900">{recipient}</p>
                  </div>
                ))}
              </div>
              {!showAllRecipients && remainingRecipientsCount > 0 && (
                <button
                  className="outline-none w-full flex justify-end text-gray-600 p-2 text-sm rounded-lg"
                  onClick={handleToggleViewRecipients}
                >
                  {`Show ${remainingRecipientsCount} more`}
                </button>
              )}
              {showAllRecipients && (
                <button
                  className="outline-none w-full flex justify-end text-gray-600 p-2 text-sm rounded-lg"
                  onClick={handleToggleViewRecipients}
                >
                  View less
                </button>
              )}
            </div>
          )}
          {/* TODO: ADD SUPPORT FOR EMAIL FILES */}
          {!(activeFilter?.id == 0) && !isDisplayMode && (
            <div>
              <label className="text-xs mb-1 font-normal text-slate-700">
                Add File Attachment
              </label>
              {files.length > 0 && (
                <div className="grid grid-cols-2 w-full gap-2 my-2">
                  {files?.map((file: any, index: any) => (
                    <div
                      key={index}
                      className="flex gap-2  border border-gray-300 p-3 rounded-xl justify-between"
                    >
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
                  // multiple
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                  style={{ display: "none" }}
                  id="file-input"
                />
                {files?.length < 1 && (
                  <label
                    className="bg-primary-green cursor-pointer flex gap-2 mt-2 py-3 text-white text-center text-sm px-4 hover:opacity-95 items-center rounded-lg w-full"
                    htmlFor="file-input"
                  >
                    {" "}
                    Add file
                    <MdAttachFile color="white" size={20} />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* RECIPIENTS & COMPANY SELECTION */}
          {type === "super-admin" && !isDisplayMode && (
            <div className="mt-10 my-5">
              <Tabs
                activeFilter={activeGroupFilter}
                setActiveFilter={setActiveGroupFilter}
                filters={groupFilters}
              />
            </div>
          )}

          {type === "super-admin" && activeGroupFilter?.id == 1 && (
            <div className="grid grid-cols-2 gap-10">
              {!isDisplayMode && (
                <div className="mb-4 hide-input-borders">
                  <label className="text-xs font-normal text-slate-700">
                    Company
                  </label>

                  <Select
                    isMulti
                    options={filteredCompanies.map((company: any) => ({
                      value: company, // Store the entire company object in the value
                      label: company.company_name,
                    }))}
                    value={selectedCompaniesState}
                    onChange={handleCompanyChange}
                    onInputChange={(inputValue: string) =>
                      setSearchTerm(inputValue)
                    }
                    placeholder="Select company"
                    isLoading={isLoading || searchLoading}
                    onMenuScrollToBottom={fetchMoreData}
                    closeMenuOnSelect={false}
                    styles={{
                      control: (styles) => ({
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
                      menu: (styles) => ({
                        ...styles,
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        marginTop: "4px",
                        fontSize: "0.875rem",
                        lineHeight: "1.25rem",
                        zIndex: 9999,
                      }),
                      menuList: (styles) => ({
                        ...styles,
                        padding: "0px 4px",
                        maxHeight: "200px",
                        overflowY: "auto",
                      }),
                      option: (styles) => ({
                        ...styles,
                        // backgroundColor: isSelected ? '#007bff' : isFocused ? '#e0f7fa' : '#ffffff', // Hover color change
                        color: "#334155",
                        cursor: "pointer",
                        padding: "10px 15px",
                        margin: "4px 0",
                        borderRadius: "8px",
                        ":active": {
                          backgroundColor: "#F1F5F9",
                        },
                        ":visited": {
                          backgroundColor: "#fff",
                        },
                        ":hover": {
                          backgroundColor: "#F1F5F9",
                        },
                      }),
                      multiValueRemove: (styles) => ({
                        ...styles,
                        ":hover": {
                          backgroundColor: "transparent",
                        },
                      }),
                    }}
                    components={{
                      MultiValueRemove: CustomMultiValueRemove,
                      MultiValue: CustomMultiValue,
                      MultiValueContainer: CustomMultiValueContainer,
                    }}
                  />

                  {/* <Popover placement="bottom" state={state}>
                    <PopoverTrigger>
                      <div
                        className="border text-sm w-full flex gap-2 flex-wrap py-2 px-1 border-[#E2E8F0] bg-[#F8FAFC]  rounded-lg my-1 shadow-sm"
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
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <IoIosCloseCircleOutline
                                  color="#DC2626"
                                  size={20}
                                  onClick={() =>
                                    handleRemoveSelectedCompany(company)
                                  }
                                />
                              </div>
                            </div>
                          ))}
                          {selectedCompanies?.length < 1 &&
                            !selectAllCompanies && (
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
                      {[...filteredCompanies]?.map((company: any) => (
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
                  </Popover> */}
                </div>
              )}
              {!isDisplayMode && (
                <div className="mb-4 flex flex-col">
                  <label className="text-xs mb-1 font-normal text-slate-700">
                    Recipients
                  </label>
                  <Dropdown>
                    <DropdownTrigger>
                      <button className="outline-none border w-full py-2 px-1 border-[#E2E8F0] bg-[#fcfdff]  rounded-lg my-1 shadow-sm">
                        <div className="flex gap-2 w-full justify-between items-center py-0 px-4">
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
                      className="shadow-md bg-white border border-[#F1F5F9] w-[28rem]  -mt-2 rounded-lg flex flex-col gap-3"
                      aria-label="Static Actions"
                    >
                      {/* <DropdownItem
                    key="view"
                    className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                    onClick={() =>
                      setSelectedRecipient({ label: "All", value: "all" })
                    }
                  >
                    All
                  </DropdownItem> */}
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
              )}
            </div>
          )}

          {(activeGroupFilter?.id == 0 || type === "company-admin") &&
            !isDisplayMode && (
              <>
                <MultiComboSearch
                  data={users}
                  search={userSearchTerm}
                  setSearch={setUserSearchTerm}
                  selected={selectedUsers}
                  setSelected={setSelectedUsers}
                />
              </>
            )}
        </div>

        {/* RECURRING, START DATE AND TIME */}
        <div className="bg-white px-4 rounded-lg mt-6 py-5">
          <div className="grid grid-cols-3 gap-10">
            <div
              className={`mb-4 flex flex-col 
                
                ${
                  recurringType.value == "NON_RECURRING"
                    ? "col-span-1"
                    : "col-span-1"
                }
                  
              
              `}
            >
              <div
                className={
                  isDisplayMode
                    ? "flex w-full items-center justify-between"
                    : ""
                }
              >
                <label className="text-xs mb-1 font-normal text-slate-700">
                  Recurring type
                </label>
                {isDisplayMode &&
                  notification?.recurringType !== "NON_RECURRING" && (
                    <button
                      className={`w-auto outline-none border-b border-[#056ee9] border-dashed text-xs text-[#056ee9] disabled:border-[#4b5675] disabled:text-[#4b5675]`}
                      onClick={() => {
                        handleEditRecurringType();
                      }}
                    >
                      {editingRecurringType
                        ? savingRecurringType
                          ? "Saving..."
                          : "Save"
                        : "Edit"}
                    </button>
                  )}
              </div>
              <Dropdown isDisabled={isDisplayMode && !editingRecurringType}>
                <DropdownTrigger>
                  <button className="outline-none border w-full py-[0.625rem] px-1 border-[#E2E8F0] bg-[#fcfdff]  rounded-lg my-1 shadow-sm">
                    <div className="flex gap-2 w-full justify-between items-center py-0 px-4">
                      <p className=" font-medium text-sm">
                        {recurringType?.label}
                      </p>

                      {!(isDisplayMode && !editingRecurringType) && (
                        <div className="">
                          <BiChevronDown size={21} color="#94A3B8" />
                        </div>
                      )}
                    </div>
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  className="shadow-md bg-white border border-[#F1F5F9] w-[18rem]  -mt-4 rounded-lg flex flex-col gap-3"
                  aria-label="Static Actions"
                >
                  {recurringTypes?.map((recurType: any) => (
                    <DropdownItem
                      key="view"
                      className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                      onClick={() => setRecurringType(recurType)}
                    >
                      <div className="flex w-full items-center justify-between">
                        <p>{recurType.label}</p>
                        {recurType.value == recurringType?.value && (
                          <IoCheckmark size={20} color="#334155" />
                        )}
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>

            {recurringType.value !== "NON_RECURRING" && (
              <>
                <div className="mb-4 flex flex-col">
                  <label className="text-xs mb-1 font-normal text-slate-700">
                    Start Date
                  </label>
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                    hideTimeZone
                    // showMonthAndYearPickers
                    className="max-w-full text-[#334155] text-sm font-medium border w-full px-1 border-[#E2E8F0] bg-[#fcfdff]  rounded-lg my-1 shadow-sm "
                    variant="flat"
                    classNames={{
                      popoverContent:
                        "bg-white border border-[#E2E8F0] rounded-lg",
                    }}
                    isDateUnavailable={isStartDateUnavailable}
                    isDisabled={isDisplayMode}
                  />
                </div>
                <div className="mb-4 flex flex-col">
                  <label className="text-xs mb-1 font-normal text-slate-700">
                    End Date
                  </label>
                  <DatePicker
                    value={endDate}
                    hideTimeZone
                    // showMonthAndYearPickers
                    onChange={setEndDate}
                    className="max-w-full text-[#334155] text-sm font-medium border w-full px-1 border-[#E2E8F0] bg-[#fcfdff]  rounded-lg my-1 shadow-sm "
                    variant="flat"
                    classNames={{
                      popoverContent:
                        "bg-white border border-[#E2E8F0] rounded-lg",
                    }}
                    isDateUnavailable={isEndDateUnavailable}
                    isDisabled={isDisplayMode}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* SEND MESSAGE - EMAIL OR SMS */}
        {!isDisplayMode && (
          <div className="mt-4 mb-2">
            <button
              onClick={sendMessage}
              className="bg-primary-green disabled:bg-gray-400 py-3 text-white text-center text-sm px-4 hover:opacity-95 items-center rounded-lg w-full"
            >
              {" "}
              Send {activeFilter?.name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomMultiValue = (props: any) => (
  <div className="border border-[#E2E8F0] bg-white m-1 px-2 py-1 flex gap-2 items-center rounded-lg">
    <components.MultiValue {...props}>
      <div className="bg-white text-sm">{props.children}</div>
    </components.MultiValue>
  </div>
);

const CustomMultiValueContainer = (props: any) => (
  <components.MultiValueContainer {...props}>
    <span className="bg-white  flex gap-1 items-center">{props.children}</span>
  </components.MultiValueContainer>
);

const CustomMultiValueRemove = (props: any) => (
  <components.MultiValueRemove {...props}>
    <span className="bg-white hover:bg-transparent">
      <IoIosCloseCircleOutline color="#DC2626" size={20} />
    </span>
  </components.MultiValueRemove>
);

export default Notifications;
