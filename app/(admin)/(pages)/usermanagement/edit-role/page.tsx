"use client";

import "./index.css";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
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
import { useSearchParams } from "next/navigation";
import DataLoadingIndicator from "@/components/DataLoadingIndicator/DataLoadingIndicator";

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

function EditRole() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const searchParams = useSearchParams();
  const roleId = searchParams.get("roleId");
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["roleById", roleId],
    queryFn: services.getRoleById(Number(roleId)),
    enabled: !!roleId,
  });

  if (isLoading) {
    return <DataLoadingIndicator />;
  }

  if (data) {
    const initialValues = {
      roleName: data?.roleName,
      roleDescription: data?.description,
      permissions: data?.permissions,
    };

    const handleSubmit = async (
      values: FormValues,
      { setSubmitting }: FormikHelpers<FormValues>
    ) => {
      const { roleName, roleDescription, permissions } = values;

      let loading = toast.info("Updating role. Please wait...");

      try {
        console.log("Role update payload:", {
          name: roleName,
          description: roleDescription,
        });

        const updateRoleResponse = await services.EditRole({
          name: roleName,
          description: roleDescription,
          id: Number(roleId),
        });

        const updatedRoleId = updateRoleResponse.data.id;

        if (permissions) {
          const permissionIds = Object.keys(permissions)
            .filter((key) => permissions[key])
            .map((key) => Number(key));

          const permissionsPayload = {
            permission_ids: permissionIds,
          };

          await services.updateMultiPermissionForRole(
            permissionsPayload,
            updatedRoleId
          );
        }

        toast.dismiss(loading);
        toast.success("Role updated successfully");
        router.push("/usermanagement");
      } catch (error) {
        toast.dismiss(loading);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="px-5 pb-20">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={RoleSchema}
          onSubmit={(values) => {
            //
          }}
          // onSubmit={handleSubmit}
        >
          {({ errors, isSubmitting }) => {
            return (
              <Form>
                {/* HEADER */}
                <div className="w-full text-primary-dark flex justify-between">
                  <h3 className="font-semibold text-xl">Edit role</h3>

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
                      disabled
                    />
                    <ShowError name="roleName" />
                  </div>

                  {/* ROLE DESCRIPTION */}
                  <div className="input-holder">
                    <label>Role description</label>
                    <Field
                      disabled
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
                    This grants access to certain functions the user can
                    perform. It can be used to set limitations as well
                  </label>

                  {errors.permissions && (
                    <span className="text-xs text-[#FF2828] block">
                      {/* {errors.permissions[0]} */}
                    </span>
                  )}
                  <div className="flex flex-col gap-2 pt-2 pb-5">
                    {data?.permissions.map(
                      ({ name, description, id, module, action }: any) => (
                        <CustomCheckbox
                          key={id}
                          name={`permissions.${id}`}
                          label={toSpace(name)}
                          subtext={description}
                          moduleName={module}
                        />
                      )
                    )}
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
}

export default EditRole;
