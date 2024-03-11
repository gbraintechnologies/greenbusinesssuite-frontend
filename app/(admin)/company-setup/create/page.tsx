"use client";
import "./index.css";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import Modal from "@/components/Modal/Modal";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import { Field, Form, Formik, FormikBag, FormikHelpers, FormikState } from "formik";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import * as Yup from "yup";
import Dropdown from "@/components/Dropdown/Dropdown";
import UploadIcon from "@/public/svg/upload.svg";
import Image from "next/image";
import { PhoneSelector } from "@/components/PhoneSelector/PhoneSelector";
import useFileUpload from "@/hooks/useFileUpload";

interface FormValues {
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
  companyName: Yup.string().required('Company name is required'),
  companyDescription: Yup.string().required('Company description is required'),
  companyLogo: Yup.mixed().required('A company logo file is required'), 
  adminFirstName: Yup.string().required('First name is required'),
  adminLastName: Yup.string().required('Last name is required'),
  adminEmail: Yup.string().email('Invalid email').required('Email is required'),
  contactFirstName: Yup.string().required('First name is required'),
  contactLastName: Yup.string().required('Last name is required'),
  contactEmail: Yup.string().email('Invalid email').required('Email is required'),
});

const CreateCompany = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const [phone, setPhone] = useState("");

  const [profileImage, setProfileImage] = useState<File | null>(null);


  const inputFileRef = useRef();


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Handle the file upload here
  };

  const router = useRouter();

  const initialValues: Partial<FormValues> = {
    companyName: "",
    companyDescription: "",
    companyLogo: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
  };

  const { handleFileUpload } = useFileUpload();

  const createCompany = (values: Partial<FormValues>, resetForm: FormikHelpers<Partial<FormValues>> ) => {
    const {} = values;
    

  }

  return (
    <div className="px-5 pb-20">
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={companySchema}
          onSubmit={(values, resetForm) => {
            createCompany(values, resetForm)
          }}
        >
          {({ errors, isSubmitting }) => {
            return (
              <Form>
                {/* HEADER */}
                <div className="w-full text-primary-dark  flex justify-between">
                  <h3 className="font-semibold text-xl">Create new company</h3>

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
                      options={[]}
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
                      selected={selectedIndustry}
                      setSelected={setSelectedIndustry}
                      bgColor="bg-slate-50"
                    />
                    <ShowError name="industry" />
                  </div>
                  {/* COMPANY LOGO */}
                  <div className="flex justify-center items-center w-full">
                    <label className="flex justify-center items-center bg-slate-50 rounded-lg border-2 border-dashed w-full h-64 group text-center">
                      <div className="flex flex-col gap-3">
                        <div className="flex w-full items-center justify-center">
                          <div className="flex  items-center justify-center rounded-full w-12 h-12 bg-[#F1F5F9]">
                            <Image src={UploadIcon} alt="upload icon" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="font-medium text-base ">
                            Upload company logo file here
                          </p>
                          <p className="text-[#64748B] text-xs">
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
                          setProfileImage(e.target.files && e.target.files[0]);
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
                      style={getStyles(errors, "adminEmail")}
                      name="adminEmail"
                      placeholder=""
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
        <Modal
          isOpen={showCancelModal}
          setIsOpen={setShowCancelModal}
          title="Are you sure you want to discard all changes?"
        >
          <div>
            <p className="px-5 mt-5 text-[#334155]">
              Discard changes would delete all the changes you have made. <br />{" "}
              Nothing would be saved.
            </p>

            <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
              <button
                onClick={() => setShowCancelModal(false)}
                className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                className="bg-primary-red py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                onClick={() => {
                  router.back();
                }}
              >
                Yes, discard changes
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CreateCompany;
