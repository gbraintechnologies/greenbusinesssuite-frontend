"use client";

import services from "@/services";
import { Button, Spinner } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import Loader from "@/components/Loader/Loader";
import { CompanyType } from "@/types";
import { PhoneSelector } from "@/components/PhoneSelector/PhoneSelector";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

function displayName(user: any) {
  const first = user?.firstName ?? user?.first_name ?? "";
  const last = user?.lastName ?? user?.last_name ?? "";
  return `${first} ${last}`.trim() || user?.email || "Administrator";
}

function CompanyAdmins({ companyId }: any) {
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const {
    data: companyData,
    isLoading: companyDataLoading,
  } = useQuery<CompanyType>({
    queryKey: ["company", companyId],
    queryFn: services.getCompanyById(Number(companyId)),
  });

  const companyIdentifier =
    companyData?.companyIdentifier ||
    (companyData as any)?.company_identifier ||
    "";

  const {
    data: admins = [],
    isLoading: adminsLoading,
    refetch: refetchAdmins,
  } = useQuery({
    queryKey: ["company admins", companyIdentifier],
    queryFn: services.listCompanyAdmins(companyIdentifier),
    enabled: Boolean(companyIdentifier),
  });

  const initialValues = {
    email: "",
    firstname: "",
    lastname: "",
  };

  const UserSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    lastname: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email address is required"),
  });

  const createAdmin = async (values: any, resetForm: any) => {
    const data = {
      email: values.email,
      username: values.email,
      firstName: values.firstname,
      lastName: values.lastname,
      phone,
      profileImage: "string",
      status: "ACTIVE",
    };

    const loadingToast = toast.info(
      "Creating and assigning administrator. Please wait..."
    );

    setLoading(true);
    try {
      await services.assignAndCreateAdminWithTenantId({
        data,
        tenantId: companyIdentifier,
      });
      toast.success("Administrator created successfully");
      resetForm();
      setPhone("");
      await refetchAdmins();
      queryClient.invalidateQueries({ queryKey: ["company", companyId] });
    } catch {
      toast.error("Error creating company administrator");
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const startEdit = (admin: any) => {
    setEditingId(Number(admin.id));
    setEditEmail(String(admin.email || ""));
  };

  const saveEmail = async (admin: any) => {
    const next = editEmail.trim();
    if (!next || !next.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    setSavingEdit(true);
    try {
      await services.updateCompanyAdminUser({
        userId: admin.id,
        tenantId: companyIdentifier,
        data: {
          email: next,
          username: next,
          firstName: admin.firstName ?? admin.first_name,
          lastName: admin.lastName ?? admin.last_name,
          phone: admin.phoneNumber ?? admin.phone ?? admin.phone_number,
        },
      });
      toast.success("Email updated");
      setEditingId(null);
      await refetchAdmins();
    } catch {
      toast.error("Could not update email");
    } finally {
      setSavingEdit(false);
    }
  };

  const removeAdmin = async (admin: any) => {
    if (
      !window.confirm(
        `Remove administrator ${admin.email}? They will lose access to this company.`
      )
    ) {
      return;
    }
    try {
      await services.deleteCompanyAdminUser({
        userId: admin.id,
        tenantId: companyIdentifier,
      });
      toast.success("Administrator removed");
      await refetchAdmins();
      queryClient.invalidateQueries({ queryKey: ["company", companyId] });
    } catch {
      toast.error("Could not remove administrator");
    }
  };

  if (companyDataLoading) {
    return (
      <div className="min-h-[30vh] flex items-start justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-[40vh] py-5">
      {companyData && companyData?.buildStatus != "ACTIVE" ? (
        <div className="border rounded-xl p-20 flex items-center justify-center">
          <div className="flex flex-col text-gray-700 items-center justify-center gap-2">
            <Spinner size="lg" color="primary" />
            <p className="text-gray-500 mt-2">
              [ Company is being setup, please wait... ]
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-10">
            <h2 className="header-3">Company administrators</h2>
            <p className="text-gray-500 max-w-2xl text-sm mt-1">
              Staff accounts for {companyData?.companyName || "this company"}.
              They sign in at{" "}
              <span className="font-medium text-slate-700">
                /{companyIdentifier}/auth
              </span>
              .
            </p>

            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
              {adminsLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner />
                </div>
              ) : admins.length === 0 ? (
                <p className="px-5 py-8 text-sm text-slate-500">
                  No administrators yet. Create one below.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {admins.map((admin: any) => (
                    <li
                      key={admin.id}
                      className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">
                          {displayName(admin)}
                        </p>
                        {editingId === Number(admin.id) ? (
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <input
                              className="min-w-[220px] rounded-lg border border-slate-200 px-3 py-2 text-sm"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              type="email"
                            />
                            <Button
                              size="sm"
                              color="primary"
                              isLoading={savingEdit}
                              onPress={() => saveEmail(admin)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="light"
                              onPress={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <p className="truncate text-sm text-slate-500">
                            {admin.email}
                          </p>
                        )}
                      </div>
                      {editingId !== Number(admin.id) && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(admin)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                            aria-label="Edit email"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeAdmin(admin)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-red-500 hover:bg-red-50"
                            aria-label="Delete administrator"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <h2 className="header-3">Add new company administrator</h2>
          <p className="text-gray-500 max-w-2xl md:w-full text-sm">
            A user account will be created and an email with the Company ID and
            initial password will be sent.
          </p>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
              createAdmin(values, resetForm);
            }}
            validationSchema={UserSchema}
          >
            {({ errors }) => (
              <Form>
                <div className="max-w-2xl rounded-lg py-5 pb-10">
                  <div className="flex gap-10">
                    <div className="input-holder">
                      <label>First name</label>
                      <Field
                        style={getStyles(errors, "firstname")}
                        name="firstname"
                        placeholder="First name"
                      />
                      <ShowError name="firstname" />
                    </div>

                    <div className="input-holder">
                      <label>Last name</label>
                      <Field
                        style={getStyles(errors, "lastname")}
                        name="lastname"
                        placeholder="Last name"
                      />
                      <ShowError name="lastname" />
                    </div>
                  </div>

                  <div className="input-holder">
                    <label>Email</label>
                    <Field
                      style={getStyles(errors, "email")}
                      name="email"
                      placeholder="Email"
                    />
                    <ShowError name="email" />
                  </div>

                  <div className="input-holder">
                    <label className="pb-2">Phone number</label>
                    <PhoneSelector phone={phone} setPhone={setPhone} />
                  </div>

                  <Button
                    isLoading={loading}
                    isDisabled={loading || !companyIdentifier}
                    type="submit"
                    className="w-full"
                    color="primary"
                  >
                    Create Administrator
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
}

export default CompanyAdmins;
