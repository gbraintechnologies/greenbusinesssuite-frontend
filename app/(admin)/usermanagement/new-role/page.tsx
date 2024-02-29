"use client";

import "./index.css";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

//
//
import { useRouter } from "next/navigation";

// utils
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import { CustomCheckbox } from "../components/Customcheckbox";
import toCamelCase from "@/utils/CamelCase/CamelCase";

// components
import Modal from "@/components/Modal/Modal";

interface Permission {
  id: number;
  header: string;
  subtext: string;
}

interface FormValues {
  roleName: string;
  roleDescription: string;
  permissions: { [key: string]: boolean };
}

const permissionsData: Permission[] = [
  {
    id: 1,
    header: "Dashboard",
    subtext: "User can view the main application dashboard",
  },
  {
    id: 2,
    header: "Order management",
    subtext: "User can view the main application dashboard",
  },
  {
    id: 3,
    header: "Product management",
    subtext: "User can view the main application dashboard",
  },
  {
    id: 4,
    header: "Inventory management",
    subtext: "User can view the main application dashboard",
  },
  {
    id: 5,
    header: "Shipment management",
    subtext: "User can view the main application dashboard",
  },
  {
    id: 6,
    header: "User management",
    subtext: "User can view the main application dashboard",
  },
  {
    id: 7,
    header: "Customer management",
    subtext: "User can view the main application dashboard",
  },
  {
    id: 8,
    header: "Finance management",
    subtext: "User can view the main application dashboard",
  },
];

const permissionsSchema = permissionsData.reduce((acc, curr) => {
  acc[curr.header] = Yup.boolean().required(
    `The ${curr.header} permission is required`
  );
  return acc;
}, {} as { [key: string]: Yup.BooleanSchema });

const RoleSchema = Yup.object().shape({
  roleName: Yup.string().required("Required"),
  roleDescription: Yup.string(),
  permissions: Yup.object().shape(permissionsSchema),
});

function NewRole() {
  // states
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  //
  const router = useRouter();

  //initial values
  const initialValues: FormValues = {
    roleName: "",
    roleDescription: "",
    permissions: permissionsData.reduce((acc, curr) => {
      acc[curr.header] = false;
      return acc;
    }, {} as { [key: string]: boolean }),
  };

  const handleSubmit = (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    console.log("is submitting");
    console.log(values);
    setSubmitting(false);
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={RoleSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, isSubmitting }) => {
          return (
            <Form>
              {/* HEADER */}
              <div className="w-full text-primary-dark  flex justify-between">
                <h3 className="font-semibold text-xl">Create a new role</h3>

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

              {/* BODY */}
              <div className="max-w-2xl rounded-lg py-5 pb-3">
                {/* ROLE NAME */}
                <div className="input-holder">
                  <label>Name of role</label>
                  <Field
                    style={getStyles(errors, "roleName")}
                    name="roleName"
                    placeholder=""
                  />
                  <ShowError name="roleName" />
                </div>

                {/* ROLE DESCRIPTION */}
                <div className="input-holder">
                  <label>Role description</label>
                  <Field
                    style={getStyles(errors, "roleDescription")}
                    as="textarea"
                    className="h-32 resize-none bg-slate-50 border-1 border-slate-200 px-4 py-3"
                    name="roleDescription"
                    placeholder="Enter role description"
                  />
                  <ShowError name="roleDescription" />
                </div>
              </div>

              {/* PERMISSIONS */}
              <div className="max-w-2xl">
                <h3 className="font-semibold text-xl">Permissions</h3>
                <label className="text-sm mb-1 text-slate-500">
                  This grants access to certain functions the user can perform.
                  It can be used to set limitations as well
                </label>

                {errors.permissions && (
                  <span className="text-xs text-[#FF2828] block">
                    {errors.permissions[0]}
                  </span>
                )}
                <div className="flex flex-col gap-2 pt-2 pb-5">
                  {permissionsData.map((permission, index) => (
                    <CustomCheckbox
                      key={permission.id}
                      name={`permissions.${toCamelCase(permission.header)}`}
                      label={permission.header}
                      subtext={permission.subtext}
                    />
                  ))}
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
  );
}

export default NewRole;
