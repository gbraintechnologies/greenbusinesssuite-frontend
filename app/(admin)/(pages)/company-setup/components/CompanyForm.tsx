"use client";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { PhoneSelector } from "@/components/PhoneSelector/PhoneSelector";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import * as Yup from "yup";
import UploadIcon from "@/public/svg/upload.svg";
import {
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Dropdown,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import { Countrie } from "../../country-setup/components/Countries";
import { toast } from "sonner";
import ComboSearch from "@/components/SearchBox/ComboSearch";
import CloudUploadIcon from "@/public/icons/CloudUploadIcon";
import WriteIcon from "@/public/icons/WriteIcon";
import DeleteIcon from "@/public/icons/DeleteIcon";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SketchPicker } from "react-color";

export interface ICompany {
  companyName: string;
  companyDescription: string;
  industry: string;
  jurisdiction: string;
  companyLogo: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
}

const companySchema = Yup.object().shape({
  companyName: Yup.string().required("Company name is required"),
  companyDescription: Yup.string().required("Company description is required"),
  // adminFirstName: Yup.string().required("First name is required"),
  // adminLastName: Yup.string().required("Last name is required"),
  // adminEmail: Yup.string().email("Invalid email").required("Email is required"),
  contactFirstName: Yup.string().required("First name is required"),
  contactLastName: Yup.string().required("Last name is required"),
  contactEmail: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
});

type Props = {
  headerText: string;
  selectedAdminOption?: any;
  setSelectedAdminOption?: any;
  logoPresentOnLoad?: boolean;
  initialValues: Partial<ICompany>;
  submitFn: any;
  setShowCancelModal: React.Dispatch<React.SetStateAction<boolean>>;
  companyLogo: File | null;
  setCompanyLogo: React.Dispatch<React.SetStateAction<File | null>>;
  companySmallLogo: File | null;
  setCompanySmallLogo: React.Dispatch<React.SetStateAction<File | null>>;
  smallLogoUrl: string;
  setSmallLogoUrl: React.Dispatch<React.SetStateAction<string>>;
  backgroundImageUrl: string;
  setBackgroundImageUrl: React.Dispatch<React.SetStateAction<string>>;
  selectedIndustry:
    | {
        label: string;
        value: string;
      }
    | undefined;
  setSelectedIndustry: React.Dispatch<
    React.SetStateAction<
      | {
          label: string;
          value: string;
        }
      | undefined
    >
  >;
  selectedJurisdiction:
    | {
        label: string;
        value: string;
      }
    | undefined;
  setSelectedJurisdiction: React.Dispatch<
    React.SetStateAction<
      | {
          label: string;
          value: string;
        }
      | undefined
    >
  >;
  selectedSubJurisdiction:
    | {
        label: string;
        value: string;
      }
    | undefined;
  setSelectedSubJurisdiction: React.Dispatch<
    React.SetStateAction<
      | {
          label: string;
          value: string;
        }
      | undefined
    >
  >;
  selectedSubLevel:
    | {
        label: string;
        value: string;
      }
    | undefined;
  setSelectedSubLevel: React.Dispatch<
    React.SetStateAction<
      | {
          label: string;
          value: string;
        }
      | undefined
    >
  >;
  selectedSubSector:
    | {
        label: string;
        value: string;
      }
    | undefined;
  setSelectedSubSector: React.Dispatch<
    React.SetStateAction<
      | {
          label: string;
          value: string;
        }
      | undefined
    >
  >;
  sectorId: number | string;
  setSectorId: React.Dispatch<React.SetStateAction<number | string>>;
  initialLoad: boolean;
  setInitialLoad: React.Dispatch<React.SetStateAction<boolean>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
};
const CompanyForm: React.FC<Props> = ({
  headerText,
  logoPresentOnLoad = false,
  initialValues,
  submitFn,
  setShowCancelModal,
  companyLogo,
  setCompanyLogo,
  companySmallLogo,
  setCompanySmallLogo,
  smallLogoUrl,
  setSmallLogoUrl,
  phone,
  setPhone,
  backgroundImageUrl,
  setBackgroundImageUrl,
  selectedIndustry,
  setSelectedIndustry,
  selectedJurisdiction,
  setSelectedJurisdiction,
  selectedSubJurisdiction,
  setSelectedSubJurisdiction,
  selectedSubLevel,
  setSelectedSubLevel,
  selectedSubSector,
  setSelectedSubSector,
  sectorId,
  setSectorId,
  setSelectedAdminOption,
  selectedAdminOption,
  initialLoad,
  setInitialLoad,
  color,
  setColor,
}) => {
  const [industries, setIndustries] = useState<any>([]);

  const [subSectors, setSubSectors] = useState<any>([]);

  const [subJurisdiction, setSubJurisdiction] = useState<any>([]);

  const [subSectorsLoading, setSubSectorsLoading] = useState<any>([]);

  const [subJurisdictionsLoading, setSubJurisdictionsLoading] =
    useState<boolean>(false);

  const [showColorPicker, setShowColorPicker] = useState(false);

  const {
    data: jurisdictions,
    isLoading: jurisdictionsLoading,
    refetch,
  } = useQuery({
    queryKey: ["all jurisdictions"],
    queryFn: services.allJurisdictions(),
  });

  // fetch all users
  const { data: options, isLoading } = useQuery({
    queryKey: ["all users"],
    queryFn: services.allUsers(),
  });

  const [searchAdminEmail, setSearchAdminEmail] = useState("");

  const filteredOptions =
    searchAdminEmail === ""
      ? options
      : options?.filter((option: any) =>
          option?.email
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(searchAdminEmail.toLowerCase().replace(/\s+/g, ""))
        );

  const fetchIndustries = async (jurisdiction: string) => {
    try {
      if (!initialLoad) {
        setSelectedIndustry(undefined);
        setSelectedSubSector(undefined);
        setIndustries([]);
        setSubSectors([]);
      }
      const response = await services.getSectorByCountryRaw(jurisdiction);
      console.log("response ", response);
      let industryId = response[0]?.id;

      if (industryId) {
        const sectorsResponse = await services.getSectorByIDRaw(industryId);
        setIndustries(sectorsResponse);
      } else {
        setIndustries([]);
      }
    } catch (err) {
      toast.error("An error occurred while fetching industries");
    }
  };

  // const fetchSubSectors = async (
  //   sectorSetupId: string | number,
  //   sectorId: string
  // ) => {
  //   try {
  //     if (!initialLoad) {
  //       setSubSectorsLoading(true);
  //       setSelectedSubSector(undefined);
  //     }
  //     const response = await services.getSubSectorByIdRaw(
  //       Number(sectorSetupId),
  //       Number(sectorId)
  //     );
  //     setSubSectors(response?.sector?.subSectors);
  //   } catch (err) {
  //     toast.error("An error occurred while fetching sub sectors");
  //   } finally {
  //     if (!initialLoad) {
  //       setSubSectorsLoading(false);
  //     }
  //   }
  // };

  const handleChangeComplete = (newColor: any) => {
    setColor(newColor.hex);
  };

  const getJurisdictionEntries = async (jurisdictionId: number) => {
    try {
      if (!initialLoad) {
        setSubJurisdictionsLoading(true);
        setSelectedSubJurisdiction(undefined);
        setSelectedSubLevel(undefined);
        setSubJurisdiction([]);
      }
      const response = await services.getJurisdictionEntriesByIdRaw(
        jurisdictionId
      );
      setSubJurisdiction(response);
    } catch (err) {
      console.log("error ", err);
    } finally {
      if (!initialLoad) {
        setSubJurisdictionsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (companyLogo) {
      const url = URL.createObjectURL(companyLogo);
      setBackgroundImageUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [companyLogo]);

  useEffect(() => {
    if (companySmallLogo) {
      const smallUrl = URL.createObjectURL(companySmallLogo);
      setSmallLogoUrl(smallUrl);

      return () => URL.revokeObjectURL(smallUrl);
    }
  }, [companySmallLogo]);

  useLayoutEffect(() => {
    if (selectedJurisdiction?.label) {
      fetchIndustries(selectedJurisdiction?.label);
      getJurisdictionEntries(Number(selectedJurisdiction?.value));
    }
  }, [selectedJurisdiction]);

  useLayoutEffect(() => {
    if (!initialLoad) {
      setSelectedSubLevel(undefined);
    }
  }, [selectedSubJurisdiction]);

  useLayoutEffect(() => {
    if (!initialLoad) {
      setSelectedSubSector(undefined);
    }
  }, [selectedIndustry]);

  // useLayoutEffect(() => {
  //   if (selectedIndustry?.value && sectorId) {
  //     fetchSubSectors(sectorId, selectedIndustry?.value);
  //   }
  // }, [selectedIndustry, sectorId]);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={companySchema}
        onSubmit={submitFn}
      >
        {({ errors, isSubmitting }) => {
          return (
            <Form>
              {/* HEADER */}
              <div className="w-full text-primary-dark  flex justify-between">
                <h3 className="font-semibold text-xl">{headerText}</h3>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    type="button"
                    className="bg-gray-50 border border-gray-200 shadow-sm py-2 flex text-primary-dark text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingIcon />
                        Saving
                      </>
                    ) : (
                      <>
                        {" "}
                        <HiOutlineInboxArrowDown /> Save
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* COMPANY INFORMATION */}
              <div className="max-w-2xl py-5 pb-3">
                <header className="pb-4 ">
                  <h3 className="text-lg text-primary-dark font-semibold">
                    Company Information
                  </h3>
                  <p className="text-sm text-[#667085]">
                    Information about the company
                  </p>
                </header>
                {/* COMPANY NAME */}
                <div className="input-holder">
                  <label>Company Name</label>
                  <Field
                    style={getStyles(errors, "companyName")}
                    name="companyName"
                    placeholder=""
                  />
                  <ShowError name="companyName" />
                </div>
                {/* COMPANY DESCRIPTION */}
                <div className="input-holder">
                  <label>Company description</label>
                  <Field
                    style={getStyles(errors, "companyDescription")}
                    as="textarea"
                    className="h-32 resize-none bg-slate-50 border-1 border-slate-200 px-4 py-3"
                    name="companyDescription"
                    placeholder="Enter company description"
                  />
                  <ShowError name="companyDescription" />
                </div>
                {/* JURISDICTION */}
                <div className="input-holder half">
                  <label>Company jurisdiction</label>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button className="border min-w-72 py-2 px-5 border-[#E2E8F0] bg-slate-50  rounded-lg my-2 shadow-sm text-left flex justify-start">
                        <div className="flex gap-4 items-center">
                          {typeof selectedJurisdiction !== "undefined" && (
                            <img
                              src={
                                Countrie(selectedJurisdiction?.label)?.flags.png
                              }
                              alt={
                                Countrie(selectedJurisdiction?.label)?.name
                                  .common
                              }
                              style={{ height: "20px", width: "25px" }}
                            />
                          )}
                          <p>
                            {selectedJurisdiction?.label ||
                              "Select Jurisdiction"}
                          </p>
                        </div>
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      className="shadow-md bg-white border border-[#F1F5F9] rounded-lg min-w-72 flex flex-col gap-3"
                      aria-label="Static Actions"
                      variant="flat"
                      selectionMode="single"
                    >
                      {jurisdictions?.map((jurisdiction: any) => (
                        <DropdownItem
                          key="view"
                          className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                          onClick={() => {
                            setSelectedJurisdiction({
                              label: jurisdiction?.name,
                              value: jurisdiction?.id,
                            });
                            setInitialLoad(false);
                          }}
                        >
                          <div className="flex gap-4 items-center">
                            <img
                              src={Countrie(jurisdiction?.name)?.flags.png}
                              alt={Countrie(jurisdiction?.name)?.name.common}
                              style={{ height: "20px", width: "25px" }}
                            />
                            <p>{jurisdiction?.name}</p>
                          </div>
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>

                  <ShowError name="industry" />
                </div>

                {subJurisdictionsLoading && <LoadingIcon />}
                {!(typeof selectedJurisdiction == "undefined") &&
                  !subJurisdictionsLoading && (
                    <div className="flex gap-5">
                      {/* SUB JURISDICTION */}
                      <div className="input-holder half">
                        <label>
                          {subJurisdiction?.parentAddressScheme?.name ||
                            "Sub Jurisdiction"}
                        </label>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button className="border min-w-72 py-2 px-5 border-[#E2E8F0] bg-slate-50  rounded-lg my-2 shadow-sm text-left flex justify-start">
                              {selectedSubJurisdiction?.label || `Select`}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            className="shadow-md bg-white border border-[#F1F5F9] rounded-lg min-w-72 flex flex-col gap-3"
                            aria-label="Static Actions"
                            variant="flat"
                            selectionMode="single"
                          >
                            {subJurisdiction?.parentAddressScheme?.entries?.map(
                              (subJurisdiction: any) => (
                                <DropdownItem
                                  key="view"
                                  className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                                  onClick={() => {
                                    setSelectedSubJurisdiction({
                                      label: subJurisdiction?.name,
                                      value: subJurisdiction?.id,
                                    });
                                    setInitialLoad(false);
                                  }}
                                >
                                  {subJurisdiction?.name}
                                </DropdownItem>
                              )
                            )}
                          </DropdownMenu>
                        </Dropdown>
                        {subJurisdictionsLoading && <LoadingIcon />}
                      </div>
                      {/* SUB LEVEL */}
                      {selectedSubJurisdiction && (
                        <div className="input-holder half">
                          <label>Sub Level</label>
                          <Dropdown>
                            <DropdownTrigger>
                              <Button className="border min-w-72 py-2 px-5 border-[#E2E8F0] bg-slate-50  rounded-lg my-2 shadow-sm text-left flex justify-start">
                                {selectedSubLevel?.label || `Select Sub Level`}
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              className="shadow-md bg-white border border-[#F1F5F9] rounded-lg min-w-72 flex flex-col gap-3"
                              aria-label="Static Actions"
                              variant="flat"
                              selectionMode="single"
                            >
                              {subJurisdiction?.parentAddressScheme?.entries
                                ?.find(
                                  (entry: any) =>
                                    entry?.name ==
                                    selectedSubJurisdiction?.label
                                )
                                ?.childEntries?.map((subLevel: any) => (
                                  <DropdownItem
                                    key="view"
                                    className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                                    onClick={() => {
                                      setSelectedSubLevel({
                                        label: subLevel?.name,
                                        value: subLevel?.id,
                                      });
                                      setInitialLoad(false);
                                    }}
                                  >
                                    {subLevel?.name}
                                  </DropdownItem>
                                ))}
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      )}
                    </div>
                  )}

                {/* INDUSTRY */}
                {selectedJurisdiction && (
                  <div className="flex gap-5">
                    <div className="input-holder half">
                      <label>Industry</label>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button className="border min-w-72 py-2 px-5 border-[#E2E8F0] bg-slate-50  rounded-lg my-2 shadow-sm text-left flex justify-start">
                            {selectedIndustry?.label || "Select Industry"}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          className="shadow-md bg-white border border-[#F1F5F9] rounded-lg min-w-72 flex flex-col gap-3"
                          aria-label="Static Actions"
                          variant="flat"
                          selectionMode="single"
                        >
                          {industries?.sectors?.map((industry: any) => (
                            <DropdownItem
                              key="view"
                              className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                              onClick={() => {
                                setSelectedIndustry({
                                  label: industry?.parentSector,
                                  value: industry?.id,
                                });
                                setSectorId(industries.id);
                                setInitialLoad(false);
                              }}
                            >
                              {industry?.parentSector}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                      <ShowError name="industry" />
                    </div>

                    {selectedIndustry && (
                      <div className="input-holder half">
                        <label>Sub Sector</label>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button className="border min-w-72 py-2 px-5 border-[#E2E8F0] bg-slate-50  rounded-lg my-2 shadow-sm text-left flex justify-start">
                              {selectedSubSector?.label || "Select Sub Sector"}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            className="shadow-md bg-white border border-[#F1F5F9] rounded-lg min-w-72 flex flex-col gap-3"
                            aria-label="Static Actions"
                            variant="flat"
                            selectionMode="single"
                          >
                            {industries?.sectors
                              ?.find(
                                (sector: any) =>
                                  sector?.parentSector ==
                                  selectedIndustry?.label
                              )
                              ?.subSector?.map((sector: any) => (
                                <DropdownItem
                                  key="view"
                                  className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                                  onClick={() => {
                                    setSelectedSubSector({
                                      label: sector,
                                      value: sector,
                                    });
                                    setInitialLoad(false);
                                  }}
                                >
                                  {sector}
                                </DropdownItem>
                              ))}
                          </DropdownMenu>
                        </Dropdown>
                        <ShowError name="industry" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* COMPANY ADMIN */}
              <div className="max-w-2xl pt-6">
                <header className="pb-3">
                  <h3 className="text-lg text-primary-dark font-semibold">
                    Company Admin
                  </h3>
                  <p className="text-sm text-[#667085]">
                    Search for user using email and select the a user to be the
                    administrator of this company
                  </p>
                </header>
                {/* ADMIN NAME */}
                {/* <div className="flex gap-5">
                  <div className="input-holder">
                    <label>First Name</label>
                    <Field
                      style={getStyles(errors, "adminFirstName")}
                      name="adminFirstName"
                      placeholder=""
                    />
                    <ShowError name="adminFirstName" />
                  </div>
                  <div className="input-holder">
                    <label>Last Name</label>
                    <Field
                      style={getStyles(errors, "adminLastName")}
                      name="adminLastName"
                      placeholder=""
                    />
                    <ShowError name="adminLastName" />
                  </div>
                </div> */}

                {/* ADMIN EMAIL */}
                {/* <div className="input-holder">
                  <label>Company admin email address</label>
                  <Field
                    style={
                      logoPresentOnLoad
                        ? {
                            ...getStyles(errors, "adminEmail"),
                            backgroundColor: "rgba(248 250 252,0.5)",
                            color: "#666",
                            cursor: "not-allowed",
                          }
                        : getStyles(errors, "adminEmail")
                    }
                    name="adminEmail"
                    placeholder=""
                    disabled={logoPresentOnLoad}
                  />
                  <ShowError name="adminEmail" />
                </div> */}

                {/* REFACTORING: SEARCH BY EMAIL AND SELECT */}
                <ComboSearch
                  search={searchAdminEmail}
                  setSearch={setSearchAdminEmail}
                  setSelected={setSelectedAdminOption}
                  selected={selectedAdminOption}
                  placeholder="Search users by email"
                  data={filteredOptions ? filteredOptions : []}
                />
              </div>

              {/* CONTACT PERSON DETAILS */}
              <div className="max-w-2xl pt-6">
                <header className="pb-8 ">
                  <h3 className="text-lg text-primary-dark font-semibold">
                    Contact person details
                  </h3>
                  <p className="text-sm text-[#667085]">
                    Details of the company’s representative for this product{" "}
                  </p>
                </header>
                {/* CONTACT PERSON NAME */}
                <div className="flex gap-5">
                  <div className="input-holder">
                    <label>First Name</label>
                    <Field
                      style={getStyles(errors, "contactFirstName")}
                      name="contactFirstName"
                      placeholder=""
                    />
                    <ShowError name="contactFirstName" />
                  </div>
                  <div className="input-holder">
                    <label>Last Name</label>
                    <Field
                      style={getStyles(errors, "contactLastName")}
                      name="contactLastName"
                      placeholder=""
                    />
                    <ShowError name="contactLastName" />
                  </div>
                </div>
                {/* CONTACT PERSON EMAIL AND PHONE*/}
                <div className="flex gap-5">
                  <div className="input-holder">
                    <label className="pb-2">Phone number</label>
                    <PhoneSelector phone={phone} setPhone={setPhone} />
                  </div>
                  <div className="input-holder">
                    <label>Email address</label>
                    <Field
                      style={getStyles(errors, "contactEmail")}
                      name="contactEmail"
                      placeholder=""
                    />
                    <ShowError name="contactEmail" />
                  </div>
                </div>
              </div>

              {/* BRANDING SETTINGS */}
              <div className="max-w-2xl pt-6">
                <header className="pb-3">
                  <h3 className="text-lg text-primary-dark font-semibold">
                    Branding Settings
                  </h3>
                  <p className="text-sm text-[#667085]">
                    Set your default branding elements to determine how the
                    interface appears to customers.
                  </p>
                </header>
                {/* COMPANY SMALL LOGO */}
                <div className="mt-2">
                  <h2 className="text-base text-primary-dark font-medium">
                    Upload small icon
                  </h2>
                  <p className="text-sm text-[#667085]">
                    A smaller representation of your logo to be used as favicon.
                    It must be squared and at at least 128px by 128px with a max
                    size of 512KB. Supported formats are JPG and PNG only.
                  </p>
                  {!(logoPresentOnLoad || companySmallLogo) && (
                    <label className=" mt-2 flex gap-2 items-center my-2  bg-white w-fit h-fit border p-2 rounded-md text-[#334155] font-medium border-[#E2E8F0] text-sm cursor-pointer ">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          setCompanySmallLogo(
                            e.target.files && e.target.files[0]
                          );
                        }}
                        accept=".jpg, .png"
                      />
                      <CloudUploadIcon /> <p>Upload</p>
                    </label>
                  )}
                  {companySmallLogo && (
                    <div
                      className="w-32 h-32 rounded-md my-3"
                      style={{
                        backgroundImage: logoPresentOnLoad
                          ? `url(${smallLogoUrl})`
                          : companySmallLogo
                          ? `url(${smallLogoUrl})`
                          : "",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "1px solid #E2E8F0",
                        position: "relative",
                      }}
                    >
                      <div className="absolute bottom-3 right-[-2.1rem] border border-[#E2E8F0] rounded-md bg-white flex items-center">
                        <div
                          className="border-r border-[#E2E8F0] flex justify-center items-center w-8 py-2 cursor-pointer"
                          onClick={() => setCompanySmallLogo(null)}
                        >
                          <RiDeleteBin6Line color="#0E121B" />
                        </div>
                        <label className="flex justify-center items-center w-8 py-2 relative cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              setCompanySmallLogo(
                                e.target.files && e.target.files[0]
                              );
                            }}
                            accept=".jpg, .png"
                          />
                          <WriteIcon />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                {/* COMPANY LOGO */}
                <div className="">
                  <h2 className="text-base text-primary-dark font-medium">
                    Upload full sized logo
                  </h2>
                  <p className="text-sm text-[#667085]">
                    The full sized version of your logo. It must be at least
                    128px by 128px with a max size of 512KB. Supported formats
                    are JPG and PNG only.
                  </p>
                  <div className="flex justify-center items-center w-full relative my-2">
                    <label
                      className="flex justify-center items-center bg-slate-50 rounded-lg border-2 border-dashed w-full h-64 group-item text-center"
                      style={{
                        backgroundImage: logoPresentOnLoad
                          ? `url(${backgroundImageUrl})`
                          : companyLogo
                          ? `url(${backgroundImageUrl})`
                          : "",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {(companyLogo || logoPresentOnLoad) && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 h-64"></div>
                      )}

                      <div className="flex flex-col gap-3 z-10 relative">
                        <div className="flex w-full items-center justify-center">
                          <div className="flex  items-center justify-center rounded-full w-12 h-12 bg-[#F1F5F9]">
                            <Image src={UploadIcon} alt="upload icon" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p
                            className={
                              "font-medium text-base " +
                              (companyLogo || logoPresentOnLoad
                                ? " text-white "
                                : "")
                            }
                          >
                            Upload company logo file here
                          </p>
                          <p
                            className={
                              " text-xs" +
                              (companyLogo || logoPresentOnLoad
                                ? " text-white "
                                : " text-[#64748B]")
                            }
                          >
                            Supported formats: JPG, PNG (2MB max file size)
                          </p>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-20 h-8 border-1 border-[#E2E8F0] text-sm bg-white flex items-center justify-center rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)]">
                            Browse
                          </div>
                        </div>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          setCompanyLogo(e.target.files && e.target.files[0]);
                        }}
                        accept=".jpg, .png"
                      />
                    </label>
                  </div>
                </div>
                {/* COMPANY COLOR */}
                <div className="input-holder">
                  <h2 className="text-base text-primary-dark font-medium">
                    Company Color
                  </h2>
                  <p className="text-sm text-[#667085]">
                    Add a splash of colour to your pages
                  </p>
                  {!color && (
                    <button
                      className=" mt-2 flex gap-2 items-center my-2  bg-white w-fit h-fit border py-2 px-4 rounded-md text-[#334155] font-medium border-[#E2E8F0] text-sm cursor-pointer "
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    >
                      Select
                    </button>
                  )}
                  {color && (
                    <button
                      className=" mt-2 flex items-center my-2  bg-white w-fit h-8 border rounded-md text-[#334155] font-medium border-[#E2E8F0] text-sm cursor-pointer "
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    >
                      <div
                        className={`w-5 h-8 rounded-tl-md rounded-bl-md`}
                        style={{ backgroundColor: color }}
                      ></div>
                      <p className="p-2">{color}</p>
                    </button>
                  )}
                  {showColorPicker && (
                    <SketchPicker
                      color={color}
                      onChangeComplete={handleChangeComplete}
                    />
                  )}
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
      {/* CANCEL MODAL: DISCARD ALL CHANGES */}
    </>
  );
};

export default CompanyForm;
