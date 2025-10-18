"use client";

import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { toast } from "sonner";
import services from "@/services";

import FormikControl from "@/components/Formik/FormikControl";
import { getStyles } from "@/components/Formik/formHelpers";
import Border from "@/components/Border/Border";
import DataLoadingIndicator from "@/components/DataLoadingIndicator/DataLoadingIndicator";
import NoDataIndicator from "@/components/NoDataIndicator/NoDataIndicator";

const Profile = ({
  companyData,
  isLoading,
}: {
  companyData: any;
  isLoading: any;
}) => {
  // state for handling the submitting state
  const [submitting, setSubmitting] = useState<boolean>(false);

  const router = useRouter();

  const companySchema = Yup.object().shape({
    companyName: Yup.string().min(5).required("Company name is required"),
    industry: Yup.string().required("Industry is required"),
    companyAddress: Yup.string().required("Address is required"),
    primaryContactName: Yup.string().required(
      "Contact Persion name is required"
    ),
    primaryContactEmail: Yup.string()
      .email()
      .required("Contact Persion email is required"),
    primaryContactPhoneNumber: Yup.string().required(
      "Contact Persion phone number is required"
    ),
    description: Yup.string().required("Company description is required"),
    primaryCurrency: Yup.string().required("Currency is required"),
  });

  if (isLoading) {
    <DataLoadingIndicator />;
  }

  if (companyData) {
    const initialValues: any = {
      ...companyData,
    };
    const createCompany = (values: any, reset: any) => {
      setSubmitting(true);

      services
        .editCompany({
          data: { ...companyData, ...values },
        })
        .then((res) => {
          toast.message(res?.data?.message ?? "Company updated successfully");
          setSubmitting(false);
        })
        .catch((e) => {
          setSubmitting(false);
          console.log("error creating", e);
          toast.error("Error editing company");
        });
    };

    return (
      <div className="pb-20">
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            console.log("values", values);
            createCompany(values, resetForm);
          }}
          validationSchema={companySchema}
        >
          {({ errors, values }) => (
            <Form>
              <div className="flex flex-col">
                <h4 className="header-4">Company Information</h4>
                <Border hasTopBottomMargin={false} />
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <FormikControl
                      style={getStyles(errors, "companyName")}
                      control="input"
                      type="text"
                      isDisabled
                      isRequired
                      label="Name"
                      name="companyName"
                      placeholder="Company Name"
                    />
                    <FormikControl
                      style={getStyles(errors, "industry")}
                      control="input"
                      type="text"
                      isRequired
                      label="Industry"
                      name="industry"
                      placeholder="Industry"
                    />
                    <FormikControl
                      style={getStyles(errors, "companyAddress")}
                      control="input"
                      type="text"
                      isRequired
                      label="Address"
                      name="companyAddress"
                      placeholder="Address"
                    />
                    <FormikControl
                      style={getStyles(errors, "companyDigitalAddress")}
                      control="input"
                      type="text"
                      label="Digital Address"
                      name="companyDigitalAddress"
                      placeholder="Digital Address"
                    />
                  </div>
                  <FormikControl
                    style={getStyles(errors, "description")}
                    control="textarea"
                    rows={4}
                    type="text"
                    isRequired
                    label="Description"
                    name="description"
                    placeholder="Description"
                  />
                </div>

                {/* CONTACT INFORMAITON */}
                <div className="mt-5">
                  <h4 className="header-4">Contact Person</h4>
                  <Border hasTopBottomMargin={false} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <FormikControl
                    style={getStyles(errors, "primaryContactName")}
                    control="input"
                    type="text"
                    isRequired
                    label="Primary Contact Name"
                    name="primaryContactName"
                  />
                  <FormikControl
                    style={getStyles(errors, "primaryContactEmail")}
                    control="input"
                    type="text"
                    isRequired
                    label="Primary Contact Email"
                    name="primaryContactEmail"
                  />
                  <FormikControl
                    style={getStyles(errors, "primaryContactPhoneNumber")}
                    control="input"
                    type="text"
                    isRequired
                    label="Primary Contact Phone Number"
                    name="primaryContactPhoneNumber"
                  />
                </div>

                {/* TAX AND BANK INFORMATION */}

                <div className="mt-5">
                  <h4 className="header-4">Tax & Bank Infomration</h4>
                  <Border hasTopBottomMargin={false} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <FormikControl
                    style={getStyles(errors, "companyBankName")}
                    control="input"
                    type="text"
                    label="Company Bank Name"
                    name="companyBankName"
                  />
                  <FormikControl
                    style={getStyles(errors, "primaryCurrency")}
                    control="select"
                    options={[
                      { key: "GHC", value: "GHC" },
                      { key: "USD", value: "USD" },
                      { key: "JPY", value: "JPY" },
                      { key: "EUR", value: "EUR" },
                      { key: "GBP", value: "GBP" },
                    ]}
                    type="text"
                    label="Currency"
                    name="primaryCurrency"
                  />
                  <FormikControl
                    style={getStyles(errors, "taxId")}
                    control="input"
                    type="text"
                    label="Tax ID"
                    name="taxId"
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }

  return <NoDataIndicator />;
};

export default Profile;
