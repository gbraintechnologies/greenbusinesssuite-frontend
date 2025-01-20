"use client";

import React, { useEffect, useState } from "react";

import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import services from "@/services";
import useUser from "@/hooks/useUser";
import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import useCompany from "@/hooks/useCompany";
import { toast } from "sonner";
import Loader from "@/components/Loader/Loader";
import { enumToArray } from "@/utils/EnumToArray/EnumToArray";
import { businessSectors, gender, TypeOfBusiness } from "@/enums";
import FormikControl from "@/components/FormikHelpers/FormikControl";
import { toEnumFormat } from "@/utils/EnumFormatConversion/EnumFormatConversion";
import UploadAreaInput from "@/app/(admin)/(pages)/country-setup/components/UploadAreaInput";
import { AiOutlineDelete } from "react-icons/ai";
import Image from "next/image";
import ProfileCompleteness from "./_components/ProfileCompleteness";

function BusinessProfile() {
  const { user } = useUser();
  const { companyBranding: company } = useCompany();

  const queryClient = useQueryClient();

  const [initialValues, setInitialValues] = useState<any>(null);

  const {
    data: profile,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ["business profile", user?.id],
    queryFn: services.getBusinessProfileOfUser(user?.id),
    enabled: Boolean(user?.id),
  });

  useEffect(() => {
    // Profile is sent as an array of 1 object
    if (isFetched) {
      if (Array.isArray(profile)) {
        // update initial values to profile already exisitng
        setInitialValues(profile[0]);
        return;
      } else {
        setInitialValues({
          businessName: "",
          companyId: "",
          userId: "",
          businessOwnerName: "",
          sector: "",
          typeOfBusiness: "",
          businessRegistrationNo: "",
          businessAddress: "",
          email: "",
          phoneNumber: "",
          gender: "",
          tin: "",
          socialMediaLink: "",
          completed: false,
        });
      }
    }
  }, [profile, isLoading, user, isFetched]);

  const [IDImage, setIDImage] = useState<File | null>(null);
  const [businessDocument, setBusinessDocument] = useState<File | null>(null);

  const submitFn = (values: any) => {
    const {
      businessName,
      businessOwnerName,
      sector,
      typeOfBusiness,
      businessRegistrationNo,
      businessAddress,
      email,
      phoneNumber,
      gender,
      tin,
      socialMediaLink,
      completed,
    } = values;

    // UPDATE PROFILE
    if (!!values?.id) {
      //  UPDATE
      services
        .updateBusinessProfile({
          ...values,
          sector: sector ? toEnumFormat(sector) : "",
          typeOfBusiness: typeOfBusiness ? toEnumFormat(typeOfBusiness) : "",
        })
        .then((res) => {
          toast.success("Updated business profile");
          queryClient.invalidateQueries({
            queryKey: ["business profile", user?.id],
          });
        })
        .catch((e) => {
          console.log("");
          toast.error("Error updating business profile");
        });
    } else {
      // CREATE NEW PROFILE

      let data: any = {
        companyId: company?.id,
        userId: user?.id,
        businessName,
        businessOwnerName,
        gender,
        sector: sector ? toEnumFormat(sector) : "",
        typeOfBusiness: typeOfBusiness ? toEnumFormat(typeOfBusiness) : "",
        businessRegistrationNo,
        businessAddress,
        email,
        phoneNumber,
        tin,
        socialMediaLink,
        completed,
      };

      if (!IDImage) {
        toast.error("Please upload Business Owner ID (Ghana Card)");
        return;
      }

      if (!businessDocument) {
        toast.error("Please upload your business document");
        return;
      }

      if (!!IDImage) {
        data = { ...data, businessOwnerIdImage: IDImage };
      }
      if (!!businessDocument) {
        data = { ...data, businessDocumentImage: businessDocument };
      }

      services
        .createBusinessProfile(data)
        .then((res) => {
          toast.success("Created business profile successfully");
          queryClient.invalidateQueries({
            queryKey: ["business profile", user?.id],
          });
        })
        .catch((e) => {
          toast.error("Error creating business profile");
          console.log("error creating", e);
        });
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const acceptedExtensions = [
      ".jpg",
      ".jpeg",
      ".gif",
      ".avif",
      ".webp",
      ".png",
    ];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (acceptedExtensions.includes(fileExtension)) {
      setIDImage(file);
    } else {
      alert("Please upload an image");
    }
  };

  const handleDropBusinessDocument = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const acceptedExtensions = [
      ".jpg",
      ".jpeg",
      ".gif",
      ".avif",
      ".webp",
      ".png",
    ];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (acceptedExtensions.includes(fileExtension)) {
      setBusinessDocument(file);
    } else {
      alert("Please upload an image");
    }
  };

  const schema = Yup.object().shape({
    // businessname: Yup.string().required("Business name is required"),
    // businessOwnerName: Yup.string().required("Business owner name is required"),
  });

  if (isLoading) {
    return (
      <div className="w-[80%]">
        {/* header */}
        <div className="flex items-center justify-between w-full mb-10">
          <div>
            <h3 className="text-2xl font-semibold">
              Business profile management
            </h3>
            <p>Manage your business information here</p>
          </div>
          <div className="border border-rounded-xl px-6 border-gray-300 text-center p-4 rounded-xl">
            <h5 className="font-semibold">Profile completeness</h5>
            {typeof profile !== "object" ? (
              <p className="bg-red-100 rounded-full border-red-600 border p-1 text-sm text-red-700 mt-2">
                Not started
              </p>
            ) : (
              <p className="bg-green-100 rounded-full border-green-600 border p-1 text-sm text-green-700 mt-2">
                Started
              </p>
            )}
          </div>
        </div>

        <div className="border border-gray-300 rounded-xl">
          <Loader text="Loading business profile" />
        </div>
      </div>
    );
  }

  if (initialValues) {
    return (
      <div className="w-[80%] mb-40">
        {/* header */}
        <div className="flex items-center justify-between w-full mb-10">
          <div>
            <h3 className="text-2xl font-semibold">
              Business profile management
            </h3>
            <p>Manage your business information here</p>
          </div>
          <ProfileCompleteness
            completed={initialValues && initialValues?.completed}
          />
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={submitFn}
        >
          {({ errors, isSubmitting }) => {
            return (
              <Form>
                <div className="border border-gray-300 p-4 rounded-xl flex flex-col gap-6 w-full mb-6">
                  <div className="input-holder">
                    <label>Business Name</label>
                    <Field
                      style={getStyles(errors, "businessName")}
                      name="businessName"
                      placeholder="Business Name"
                    />
                    <ShowError name="businessName" />
                  </div>

                  {/* owner name */}
                  <div className="input-holder">
                    <label>Business Owner Name</label>
                    <Field
                      style={getStyles(errors, "businessOwnerName")}
                      name="businessOwnerName"
                      placeholder="Business Owner Name"
                    />
                    <ShowError name="businessOwnerName" />
                  </div>

                  {/* gender */}
                  <div className="input-holder">
                    <label>Gender </label>

                    <FormikControl
                      control="select"
                      type="idType"
                      style={getStyles(errors, "gender")}
                      name="gender"
                      placeholder={
                        initialValues?.gender ? initialValues?.gender : "Gender"
                      }
                      options={enumToArray(gender)}
                    />
                    <ShowError name="gender" />
                  </div>

                  {/* business owner id card */}
                  <div className="input-holder">
                    <label className="mb-5">
                      Business Owner ID (Ghana Card){" "}
                    </label>
                    {!!initialValues?.businessOwnerIdImage ? (
                      <div>
                        {" "}
                        <Image
                          src={initialValues?.businessOwnerIdImage}
                          alt="profile"
                          width={280}
                          height={124}
                          className="rounded-md h-full w-[15rem] object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-[304px]">
                        {IDImage ? (
                          <div className="border relative border-dashed border-grey-500 max-w-[400px] min-h-[50px] rounded-2xl cursor-pointer hover:border-grey-800 flex flex-col justify-center p-4">
                            <Image
                              src={URL.createObjectURL(IDImage)}
                              alt="profile"
                              width={280}
                              height={124}
                              className="rounded-md h-full w-[15rem] object-cover"
                            />
                            <div className="absolute p-2 rounded-lg bg-red-700 top-2 right-2">
                              <AiOutlineDelete
                                onClick={() => setIDImage(null)}
                                size={20}
                                className="h-5 w-5 text-white"
                              />
                            </div>
                          </div>
                        ) : (
                          <UploadAreaInput
                            accept={[
                              ".jpg",
                              ".jpeg",
                              ".gif",
                              ".avif",
                              ".webp",
                              ".png",
                            ]}
                            subLabel="Accepted files: Jpg, png, avif"
                            onDrop={handleDrop}
                            label="Drag and drop or choose a file to upload"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* industry / sector */}
                  <div className="input-holder">
                    <label>Industry / Sector </label>

                    <FormikControl
                      control="select"
                      type="idType"
                      style={getStyles(errors, "sector")}
                      name="sector"
                      options={enumToArray(businessSectors)}
                      placeholder={
                        initialValues?.sector
                          ? initialValues?.sector
                          : "Business Sector"
                      }
                    />
                    <ShowError name="sector" />
                  </div>

                  {/* type of business */}
                  <div className="input-holder">
                    <label>Type of Business</label>

                    <FormikControl
                      control="select"
                      type="idType"
                      style={getStyles(errors, "typeOfBusiness")}
                      name="typeOfBusiness"
                      options={enumToArray(TypeOfBusiness)}
                      placeholder={
                        initialValues?.typeOfBusiness
                          ? initialValues?.typeOfBusiness
                          : "Type of Business"
                      }
                    />
                    <ShowError name="typeOfBusiness" />
                  </div>

                  {/* email address */}
                  <div className="input-holder">
                    <label>Email Address</label>
                    <Field
                      style={getStyles(errors, "email")}
                      name="email"
                      placeholder="Email Address"
                    />
                    <ShowError name="businessOwnerName" />
                  </div>

                  {/* phone Number */}
                  <div className="input-holder">
                    <label>Phone Number</label>
                    <Field
                      style={getStyles(errors, "phoneNumber")}
                      name="phoneNumber"
                      placeholder="Phone Number"
                    />
                    <ShowError name="phoneNumber" />
                  </div>

                  {/* tax identification */}
                  <div className="input-holder">
                    <label>Tax Identification Number (if Applicable)</label>
                    <Field
                      style={getStyles(errors, "tin")}
                      name="tin"
                      placeholder="TIN"
                    />
                    <ShowError name="tin" />
                  </div>

                  {/* social media links */}
                  <div className="input-holder">
                    <label>Social Media Link(s)</label>
                    <Field
                      as="textarea"
                      rows={5}
                      style={getStyles(errors, "socialMediaLink")}
                      name="socialMediaLink"
                    />
                    <ShowError name="socialMediaLink" />
                  </div>

                  {/* business documents */}
                  <div className="input-holder">
                    <label className="mb-5 block">
                      Upload Business documents
                    </label>
                    {!!initialValues?.businessDocumentImage ? (
                      <div>
                        <Image
                          src={initialValues?.businessDocumentImage}
                          alt="profile"
                          width={280}
                          height={124}
                          className="rounded-md h-full w-[15rem] object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mt-5 w-full h-[304px]">
                        {businessDocument ? (
                          <div className="border relative border-dashed border-grey-500 max-w-[400px] min-h-[50px] rounded-2xl cursor-pointer hover:border-grey-800 flex flex-col justify-center p-4">
                            <Image
                              src={URL.createObjectURL(businessDocument)}
                              alt="profile"
                              width={280}
                              height={124}
                              className="rounded-md h-full w-[15rem] object-cover"
                            />
                            <div className="absolute p-2 rounded-lg bg-red-700 top-2 right-2">
                              <AiOutlineDelete
                                onClick={() => setBusinessDocument(null)}
                                size={20}
                                className="h-5 w-5 text-white"
                              />
                            </div>
                          </div>
                        ) : (
                          <UploadAreaInput
                            accept={[
                              ".jpg",
                              ".jpeg",
                              ".gif",
                              ".avif",
                              ".webp",
                              ".png",
                            ]}
                            subLabel="Accepted files: Jpg, png, avif"
                            onDrop={handleDropBusinessDocument}
                            label="Drag and drop or choose a file to upload"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <CompanyThemedButton type="submit">
                    Save Changes
                  </CompanyThemedButton>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  } else {
    return <></>;
  }
}

export default BusinessProfile;
