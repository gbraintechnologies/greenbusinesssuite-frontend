"use client";

import "./index.css";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import { CustomCheckbox } from "../components/Customcheckbox";
import Modal from "@/components/Modal/Modal";
import services from "@/services";
import toSpace from "@/utils/UnderScore/UnderScore";
import { IoIosArrowBack } from "react-icons/io";

interface Permission {
  app_id: number;
  permission_name: string;
  description: string;
  id: number;
}

interface FormValues {
  roleName: string;
  roleDescription: string;
  permissions?: { [key: string]: boolean };
}

const RoleSchema = Yup.object().shape({
  roleName: Yup.string().required("Required"),
  roleDescription: Yup.string(),
});

function NewRole() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const router = useRouter();

  const { data: permissions } = useQuery({
    queryKey: ["allPermissions", { limit: 400, offset: 0 }],
    queryFn: services.allPermissions(400, 0),
  });

  const initialValues: FormValues = {
    roleName: "",
    roleDescription: "",
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    const { roleName, roleDescription, permissions } = values;

    let loading = toast.info("Creating role. Please wait...");

    services
      .createRole({
        name: roleName,
        description: roleDescription,
      })
      .then((res) => {
        toast.dismiss(loading);
        toast.success("Role created successfully");
        router.push("/usermanagement/view-roles");
      })
      .catch((e) => {
        toast.dismiss(loading);
        toast.error("Error creating role");
      });
  };

  return (
    <div className="px-5 pb-20">
      <Formik
        initialValues={initialValues}
        validationSchema={RoleSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, isSubmitting }) => {
          return (
            <Form>
              {/* HEADER */}
              <div className="w-full text-primary-dark flex justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="my-3 cursor-pointer flex text-sm items-center gap-2"
                    onClick={() => router.back()}
                  >
                    <IoIosArrowBack size={12} />
                  </div>
                  <h3 className="font-semibold text-xl">All Roles</h3>
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
              {/* <div className="max-w-2xl">
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
                  {permissions && permissions.length > 0 ? (
                    permissions.map(
                      ({ permission_name, description, id }: Permission) => (
                        <CustomCheckbox
                          key={id}
                          name={`permissions.${id}`}
                          label={toSpace(permission_name)}
                          subtext={description}
                        />
                      )
                    )
                  ) : (
                    <p>No permissions available</p>
                  )}
                </div>
              </div> */}
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
                router.push("/usermanagement");
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
