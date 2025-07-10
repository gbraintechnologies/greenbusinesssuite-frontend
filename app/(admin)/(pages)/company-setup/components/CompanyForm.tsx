"use client";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { PhoneSelector } from "@/components/PhoneSelector/PhoneSelector";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";

// icons
import { CiCircleInfo } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";

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
// import { SketchPicker } from "react-color";
import { useRouter } from "next/navigation";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@nextui-org/autocomplete";
import { GrFormNextLink } from "react-icons/gr";

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
  selectedCountry:
    | {
        label: string;
        value: string;
      }
    | undefined;
  setSelectedCountry: React.Dispatch<
    React.SetStateAction<
      | {
          label: string;
          value: string;
        }
      | undefined
    >
  >;
  selectedParentLevel:
    | {
        label: string;
        value: string;
      }
    | undefined;
  setSelectedParentLevel: React.Dispatch<
    React.SetStateAction<
      | {
          label: string;
          value: string;
        }
      | undefined
    >
  >;
  selectedChildLevel:
    | {
        label: string;
        value: string;
      }
    | undefined;
  setSelectedChildLevel: React.Dispatch<
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
  currencyId: string;
  setCurrencyId: React.Dispatch<React.SetStateAction<string>>;
  step?: number;
  errors: any;
};
const CompanyForm: React.FC<Props> = ({
  headerText,
  logoPresentOnLoad = false,
  initialValues,
  submitFn,
  errors,
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
  selectedCountry,
  setSelectedCountry,
  selectedParentLevel,
  setSelectedParentLevel,
  selectedChildLevel,
  setSelectedChildLevel,
  selectedSubSector,
  setSelectedSubSector,
  sectorId,
  setSectorId,
  initialLoad,
  setInitialLoad,
  color,
  setColor,
  currencyId,
  setCurrencyId,
  step,
}) => {
  const [industries, setIndustries] = useState<any>([]);

  const [subSectors, setSubSectors] = useState<any>([]);

  const [subJurisdiction, setSubJurisdiction] = useState<any>([]);

  const [subJurisdictionsLoading, setSubJurisdictionsLoading] =
    useState<boolean>(false);

  const [sectorsLoading, setSectorsLoading] = useState<boolean>(false);

  const [showColorPicker, setShowColorPicker] = useState(false);

  const { data: countries, isLoading: countriesLoading } = useQuery({
    queryKey: ["all countries"],
    queryFn: services.allcountries(),
  });

  const fetchIndustries = async (jurisdiction: string) => {
    try {
      if (!initialLoad) {
        setSelectedIndustry(undefined);
        setSelectedSubSector(undefined);
        setIndustries([]);
        setSubSectors([]);
        setSectorsLoading(true);
      }
      const response = await services.getSectorByCountryRaw(jurisdiction);
      let industryId = response[0]?.id;

      if (industryId) {
        const sectorsResponse = await services.getSectorByIDRaw(industryId);
        setIndustries(sectorsResponse);
      } else {
        setIndustries([]);
      }
    } catch (err) {
      toast.error("An error occurred while fetching industries");
    } finally {
      setSectorsLoading(false);
    }
  };

  const router = useRouter();

  const handleChangeComplete = (newColor: any) => {
    setColor(newColor.hex);
  };

  const getJurisdictionEntries = async (country: string) => {
    try {
      if (!initialLoad) {
        setSubJurisdictionsLoading(true);
        setSelectedParentLevel(undefined);
        setSelectedChildLevel(undefined);
        setSubJurisdiction([]);
      }
      const response = await services.getCountryInfoByName(country);
      setSubJurisdiction(response);
    } catch (err) {
      console.log("error ", err);
    } finally {
      if (!initialLoad) {
        setSubJurisdictionsLoading(false);
      }
    }
  };

  const getAndSetCurrency = async (country: string) => {
    try {
      const response = await services.getCurrencyByCountryName(country);
      setCurrencyId(response[0]?.id);
      if (response[0]?.id) {
        toast.success(`Currency for ${country} found`);
      }
    } catch (err: any) {
      setCurrencyId("");
      toast.error(
        err?.response?.data ?? "An error occurred. Please try again later."
      );
      console.log("error ", err);
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

  useEffect(() => {
    if (selectedCountry?.label) {
      fetchIndustries(selectedCountry?.label);
      getJurisdictionEntries(selectedCountry?.value);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (!initialLoad) {
      setSelectedChildLevel(undefined);
    }
  }, [selectedParentLevel]);

  useEffect(() => {
    if (!initialLoad) {
      setSelectedSubSector(undefined);
    }
  }, [selectedIndustry]);

  useEffect(() => {
    const currencyFn = async () => {
      if (selectedCountry?.value) {
        await getAndSetCurrency(selectedCountry?.value);
      }
    };

    currencyFn();
  }, [selectedCountry]);

  // useLayoutEffect(() => {
  //   if (selectedIndustry?.value && sectorId) {
  //     fetchSubSectors(sectorId, selectedIndustry?.value);
  //   }
  // }, [selectedIndustry, sectorId]);

  return (
    <div className="">
      <Form>
        {/* HEADER */}
        <div className="w-full text-primary-dark  flex justify-between">
          <div className="flex items-center gap-3">
            <div
              className="my-3 cursor-pointer flex text-sm items-center gap-2"
              onClick={() => router.back()}
            >
              <IoIosArrowBack size={12} />
            </div>
            <h3 className="font-semibold text-xl">{headerText}</h3>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowCancelModal(true)}
              type="button"
              className="bg-gray-50 border border-gray-200 shadow-sm py-2 flex text-primary-dark text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={submitFn}
              className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
            >
              <>
                {" "}
                {step && step == 1 ? (
                  <>
                    <GrFormNextLink />
                    Proceed to configuration
                  </>
                ) : (
                  <>
                    <HiOutlineInboxArrowDown /> Save
                  </>
                )}
              </>
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
          {/* COMPANY SMS SENDER ID */}
          <div className="input-holder">
            <label>Company SMS Sender id</label>
            <Field
              style={getStyles(errors, "companySmsSenderId")}
              name="companySmsSenderId"
              placeholder=""
            />
            <ShowError name="companySmsSenderId" />
          </div>
          {/* JURISDICTION */}
          <div className="bg-blue-50 px-3 py-3 mb-4 rounded-lg text-lg flex justify-center items-center text-blue-900 flex-row gap-2">
            <CiCircleInfo size={20} />{" "}
            <p className="text-sm">
              A company can only be created in a country that has a currency set
              up. If the selected country doesn’t have a currency yet, please
              ensure you set one up before proceeding.
            </p>
          </div>
          <div className="new-input half hide-input-borders">
            <label>Country</label>
            <div className="flex w-full bg-slate-50 h-auto rounded-lg border border-[#E2E8F0]">
              <Autocomplete
                variant="bordered"
                className="w-full "
                placeholder={"Select Country"}
                selectedKey={selectedCountry?.value}
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
                  setSelectedCountry({
                    label: key,
                    value: key,
                  });
                  setInitialLoad(false);
                }}
                aria-labelledby="Country"
              >
                {countries?.map((country: any) => (
                  <AutocompleteItem
                    key={country}
                    value={country}
                    className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[rgb(241,245,249)]"
                    startContent={
                      <img
                        src={Countrie(country)?.flags.png}
                        alt={Countrie(country)?.name.common}
                        style={{
                          height: "24px",
                          width: "24px",
                          borderRadius: "50%",
                        }}
                      />
                    }
                  >
                    {country}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </div>

          {(subJurisdictionsLoading || sectorsLoading) && <LoadingIcon />}
          {!(typeof selectedCountry == "undefined") &&
            !subJurisdictionsLoading && (
              <div className="flex gap-5">
                {/* SUB JURISDICTION */}
                <div className="new-input half hide-input-borders">
                  <label>
                    {subJurisdiction?.addressingScheme?.parentLevelName ||
                      "Sub Jurisdiction"}
                  </label>

                  <div className="flex w-full bg-slate-50 h-auto rounded-lg border border-[#E2E8F0]">
                    <Autocomplete
                      variant="bordered"
                      className="w-full"
                      placeholder={
                        subJurisdiction?.addressingScheme?.parentLevelName ||
                        "Sub Jurisdiction"
                      }
                      selectedKey={selectedParentLevel?.label}
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
                        setSelectedParentLevel({
                          label: key,
                          value: key,
                        });
                        setInitialLoad(false);
                      }}
                      aria-labelledby="Parent Level"
                    >
                      {subJurisdiction?.addressingScheme?.parentLevels
                        ?.filter((item: any) => item?.parentName?.length > 1)
                        ?.map((subJurisdiction: any) => (
                          <AutocompleteItem
                            key={subJurisdiction.id}
                            value={subJurisdiction.parentName}
                            className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                          >
                            {subJurisdiction?.parentName}
                          </AutocompleteItem>
                        ))}
                    </Autocomplete>
                  </div>
                </div>
                {/* SUB LEVEL */}
                {selectedParentLevel && (
                  <div className="new-input half hide-input-borders">
                    <label>
                      {subJurisdiction?.addressingScheme?.childLevelName ||
                        "Sub Level"}
                    </label>
                    <div className="flex w-full bg-slate-50 h-auto rounded-lg border border-[#E2E8F0]">
                      <Autocomplete
                        variant="bordered"
                        className="w-full"
                        placeholder={
                          subJurisdiction?.addressingScheme?.childLevelName ||
                          "Sub Level"
                        }
                        popoverProps={{
                          offset: 10,
                          classNames: {
                            content:
                              "shadow-md bg-white border border-[#F1F5F9] p-0 rounded-lg min-w-72 flex flex-col gap-3",
                          },
                        }}
                        selectedKey={selectedChildLevel?.label}
                        scrollShadowProps={{
                          isEnabled: false,
                        }}
                        onSelectionChange={(key: any) => {
                          setSelectedChildLevel({
                            label: key,
                            value: key,
                          });
                          setInitialLoad(false);
                        }}
                      >
                        {subJurisdiction?.addressingScheme?.parentLevels
                          ?.find(
                            (entry: any) =>
                              entry?.id == selectedParentLevel?.value
                          )
                          ?.childLevels?.filter((item: any) => item?.length > 1)
                          ?.map((subLevel: any) => (
                            <AutocompleteItem
                              key={subLevel}
                              value={subLevel}
                              className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                            >
                              {subLevel}
                            </AutocompleteItem>
                          ))}
                      </Autocomplete>
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* INDUSTRY */}
          {selectedCountry && !sectorsLoading && (
            <div className="flex gap-5">
              <div className="new-input half hide-input-borders">
                <label>Sector</label>

                <div className="flex w-full bg-slate-50 h-auto rounded-lg border border-[#E2E8F0]">
                  <Autocomplete
                    variant="bordered"
                    className="w-full"
                    placeholder="Select Sector"
                    selectedKey={selectedIndustry?.label}
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
                      setSelectedIndustry({
                        label: key,
                        value: key,
                      });
                      setSectorId(industries.id);
                      setInitialLoad(false);
                    }}
                    aria-labelledby="Industry"
                  >
                    {industries?.sectors?.map((industry: any) => (
                      <AutocompleteItem
                        key={industry.id}
                        value={industry.parentSector}
                        className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                      >
                        {industry.parentSector}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </div>

              {/* Sub Sector */}
              {selectedIndustry && (
                <div className=" half new-input hide-input-borders">
                  <label>Sub Sector</label>
                  <div className="flex w-full bg-slate-50 h-auto rounded-lg border border-[#E2E8F0]">
                    <Autocomplete
                      variant="bordered"
                      className="w-full"
                      placeholder="Select sub level"
                      selectedKey={selectedSubSector?.label ?? ""}
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
                        setSelectedSubSector({
                          label: key,
                          value: key,
                        });
                        setInitialLoad(false);
                      }}
                    >
                      {industries?.sectors
                        ?.find(
                          (sector: any) => sector?.id == selectedIndustry?.value
                        )
                        ?.subSector?.map((sector: any) => (
                          <AutocompleteItem
                            key={sector}
                            value={sector}
                            className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                          >
                            {sector}
                          </AutocompleteItem>
                        ))}
                    </Autocomplete>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* COMPANY ADMIN */}
        <div className="max-w-2xl pt-6">
          <header className="pb-3">
            <h3 className="text-lg text-primary-dark font-semibold pb-4">
              Company Administrator
            </h3>

            <div className="bg-blue-50 px-3 py-3 rounded-lg text-lg flex justify-center items-center text-blue-900 flex-row gap-2">
              <CiCircleInfo size={20} />{" "}
              <p className="text-sm">
                Company Administrators can only be assigned after the company is
                created and can be set up in Administrators tab when viewing a
                single company
              </p>
            </div>
          </header>
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
              Set your default branding elements to determine how the interface
              appears to customers.
            </p>
          </header>
          {/* COMPANY SMALL LOGO */}
          <div className="mt-2">
            <h2 className="text-base text-primary-dark font-medium">
              Upload small icon
            </h2>
            <p className="text-sm text-[#667085]">
              A smaller representation of your logo to be used as favicon. It
              must be squared and at at least 128px by 128px with a max size of
              512KB. Supported formats are JPG and PNG only.
            </p>
            {!smallLogoUrl && (
              <label className=" mt-2 flex gap-2 items-center my-2  bg-white w-fit h-fit border p-2 rounded-md text-[#334155] font-medium border-[#E2E8F0] text-sm cursor-pointer ">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    setCompanySmallLogo(e.target.files && e.target.files[0]);
                  }}
                  accept=".jpg, .png"
                />
                <CloudUploadIcon /> <p>Upload</p>
              </label>
            )}
            {Boolean(smallLogoUrl) && (
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
                    onClick={() => {
                      setCompanySmallLogo(null);
                      setSmallLogoUrl("");
                    }}
                  >
                    <RiDeleteBin6Line color="#0E121B" />
                  </div>
                  <label className="flex justify-center items-center w-8 py-2 relative cursor-pointer">
                    <input
                      type="file"
                      className="hidden m-0 p-0"
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
              The full sized version of your logo. It must be at least 128px by
              128px with a max size of 512KB. Supported formats are JPG and PNG
              only.
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
                        (companyLogo || logoPresentOnLoad ? " text-white " : "")
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
              <></>
              // <SketchPicker
              //   color={color}
              //   onChangeComplete={handleChangeComplete}
              // />
            )}
          </div>
        </div>
      </Form>

      {/* CANCEL MODAL: DISCARD ALL CHANGES */}
    </div>
  );
};

export default CompanyForm;
