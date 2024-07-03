"use client";
import Dropdown from "@/components/Dropdown/Dropdown";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { PhoneSelector } from "@/components/PhoneSelector/PhoneSelector";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import * as Yup from "yup";
import UploadIcon from "@/public/svg/upload.svg";

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
  adminFirstName: Yup.string().required("First name is required"),
  adminLastName: Yup.string().required("Last name is required"),
  adminEmail: Yup.string().email("Invalid email").required("Email is required"),
  contactFirstName: Yup.string().required("First name is required"),
  contactLastName: Yup.string().required("Last name is required"),
  contactEmail: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
});

type Props = {
  headerText: string;
  logoPresentOnLoad?: boolean;
  initialValues: Partial<ICompany>;
  submitFn: any;
  setShowCancelModal: React.Dispatch<React.SetStateAction<boolean>>;
  companyLogo: File | null;
  setCompanyLogo: React.Dispatch<React.SetStateAction<File | null>>;
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
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
};
const CompanyForm: React.FC<Props> = ({
  headerText,
  logoPresentOnLoad = false,
  initialValues,
  submitFn,
  setShowCancelModal,
  companyLogo,
  setCompanyLogo,
  phone,
  setPhone,
  backgroundImageUrl,
  setBackgroundImageUrl,
  selectedIndustry,
  setSelectedIndustry,
  selectedJurisdiction,
  setSelectedJurisdiction,
}) => {
  useEffect(() => {
    if (companyLogo) {
      const url = URL.createObjectURL(companyLogo);
      setBackgroundImageUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [companyLogo]);

  console.log('company logo ', companyLogo)

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
                {/* INDUSTRY */}
                <div className="input-holder half">
                  <label>Industry</label>
                  <Dropdown
                    options={[
                      { label: "Finance", value: "finance" },
                      { label: "Technology", value: "Technology" },
                    ]}
                    selected={selectedIndustry}
                    setSelected={setSelectedIndustry}
                    bgColor="bg-slate-50"
                  />
                  <ShowError name="industry" />
                </div>
                {/* JURISDICTION */}
                <div className="input-holder half">
                  <label>Company jurisdiction</label>
                  <Dropdown
                    options={[]}
                    selected={selectedJurisdiction}
                    setSelected={setSelectedJurisdiction}
                    bgColor="bg-slate-50"
                  />
                  <ShowError name="industry" />
                </div>
                {/* COMPANY LOGO */}
                <div className="flex justify-center items-center w-full relative">
                  <label
                    className="flex justify-center items-center bg-slate-50 rounded-lg border-2 border-dashed w-full h-64 group text-center"
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

              {/* COMPANY ADMIN */}
              <div className="max-w-2xl pt-6">
                <header className="pb-8 ">
                  <h3 className="text-lg text-primary-dark font-semibold">
                    Company Admin
                  </h3>
                  <p className="text-sm text-[#667085]">
                    Setup the administrator of this company{" "}
                  </p>
                </header>
                {/* ADMIN NAME */}
                <div className="flex gap-5">
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
                </div>

                {/* ADMIN EMAIL */}
                <div className="input-holder">
                  <label>Company admin email address</label>
                  <Field
                    style={logoPresentOnLoad ? {...getStyles(errors, "adminEmail"),  backgroundColor: "rgba(248 250 252,0.5)", color: "#666", cursor: "not-allowed"}: getStyles(errors,"adminEmail")}
                    name="adminEmail"
                    placeholder=""
                    disabled={logoPresentOnLoad}
                  />
                  <ShowError name="adminEmail" />
                </div>
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
            </Form>
          );
        }}
      </Formik>
      {/* CANCEL MODAL: DISCARD ALL CHANGES */}
    </>
  );
};

export default CompanyForm;
