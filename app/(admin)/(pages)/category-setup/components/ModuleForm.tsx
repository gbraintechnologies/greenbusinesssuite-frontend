import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import Switch from "@/components/Switch/Switch";
import { ShowError } from "@/utils/FormHelpers/FormHelpers";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import * as Yup from "yup";

interface Props {
  initialValues: any;
  submitFn: any;
  headerText: string;
  isCategorySpecificModule?: boolean;
}

const moduleSchema = Yup.object()
  .shape({
    moduleName: Yup.string().required("Module name is required"),
    // moduleType: Yup.mixed()
    //   .oneOf(["coreModule", "categorySpecificModule"] as const)
    //   .defined(),
    companyAdminPortal: Yup.string(),
    clientPortal: Yup.string(),
  })
  .test(
    "at-least-one",
    "At least one of 'Company Admin Portal' or 'Client Portal' must be filled",
    (values) => {
      return !!values.companyAdminPortal || !!values.clientPortal;
    }
  );
const ModuleForm: React.FC<Props> = ({
  initialValues,
  submitFn,
  headerText,
  isCategorySpecificModule = false,
}) => {
  const router = useRouter();

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      console.log("checked");
    } else {
      console.log("unchecked");
    }
  };
  return (
    <div className="px-5 pb-20">
      <Formik
        initialValues={initialValues}
        validationSchema={moduleSchema}
        onSubmit={submitFn}
      >
        {({ errors, isSubmitting }) => {
          return (
            <Form>
              {/* HEADER */}
              <div className="w-full text-primary-dark  flex justify-between">
                <div className="flex items-center gap-3">
                  {/* <div
                    className="my-3 cursor-pointer flex text-sm items-center gap-2"
                    onClick={() => router.back()}
                  >
                    <IoIosArrowBack size={12} />
                  </div> */}
                  <h3 className="font-semibold text-xl">{headerText}</h3>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => router.back()}
                    type="button"
                    className="bg-gray-50 border border-gray-200 shadow-sm py-2 flex text-primary-dark text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                  >
                    Cancel
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

              <div className="max-w-2xl py-5 pb-3">
                <header className="pb-4 ">
                  <h3 className="text-lg text-primary-dark font-semibold">
                    Module Details
                  </h3>
                </header>

                <div className="input-holder">
                  <label className="flex items-start gap-1">
                    Module Name<span className=" text-red-500 ">*</span>
                  </label>
                  <Field
                    // style={getStyles(errors, "moduleName")}
                    name="moduleName"
                    placeholder="eg. Documents"
                    className="!text-sm"
                  />
                  <ShowError name="moduleName" />
                </div>

                {/* <div className="mb-4">
                  <label className="text-xs mb-1 font-normal text-slate-700">Module Type</label>
                  <div className="flex flex-col">
                    <label className="flex items-center gap-2 text-sm mb-1 font-normal text-[#141A1F]">
                      <Field
                        type="radio"
                        name="moduleType"
                        value="coreModule"
                        className=""
                      />
                      Core Module
                    </label>

                    <label className="flex items-center gap-2 text-sm text-[#141A1F] mb-1 font-normal w-auto">
                      <Field
                        type="radio"
                        name="moduleType"
                        value="categorySpecificModule"
                        className=""
                      />
                      Category Specific Module
                    </label>
                  </div>
                  <ShowError name="moduleType" />
                </div> */}

                <div className="input-holder">
                  <label>Company Admin Portal Feature Description</label>
                  <Field
                    // style={getStyles(errors, "moduleDescription")}
                    as="textarea"
                    className="h-32 resize-none border-1 border-slate-200 px-4 py-3 text-sm"
                    name="companyAdminPortal"
                    placeholder="eg. Upload and assign documents"
                  />
                  <ShowError name="companyAdminPortal" />
                </div>
                <div className="input-holder">
                  <label>Client Portal Feature Description</label>
                  <Field
                    // style={getStyles(errors, "moduleDescription")}
                    as="textarea"
                    className="h-32 resize-none border-1 border-slate-200 px-4 py-3 text-sm"
                    name="clientPortal"
                    placeholder="eg. View and download assigned documents."
                  />
                  <ShowError name="clientPortal" />
                </div>
                {isCategorySpecificModule && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-[#475569]">
                      Module is a template
                    </p>
                    <Switch onSwitchChange={handleSwitchChange} />
                  </div>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ModuleForm;
