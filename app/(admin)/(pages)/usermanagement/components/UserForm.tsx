import Dropdown from "@/components/Dropdown/Dropdown";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { PhoneSelector } from "@/components/PhoneSelector/PhoneSelector";
import useFileUpload from "@/hooks/useFileUpload";
import BigUserIcon from "@/public/icons/BigUserIcon";
import services from "@/services";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import { useQuery } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { MdOutlineEdit } from "react-icons/md";
import * as Yup from "yup";
import "../edit-user/index.css";

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

type Props = {
  initialValues: any;
  submitFn: any;
  setShowCancelModal?: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  profileImage: File | null;
  setProfileImage: React.Dispatch<React.SetStateAction<File | null>>;
  profilePicPresentOnLoad?: boolean;
  profilePic?: any;
  setProfilePic?: any;
  readonly?: boolean;
  roleId?: string;
};

const UserForm = ({
  initialValues,
  submitFn,
  setShowCancelModal,
  loading,
  setLoading,
  title,
  phone,
  setPhone,
  profileImage,
  setProfileImage,
  profilePicPresentOnLoad = false,
  profilePic,
  setProfilePic,
  readonly = false,
  roleId,
}: Props) => {
  const inputFileRef = React.useRef();


  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>();

  const [selectedRole, setSelectedRole] = useState<any>(null);

  const { handleFileUpload, loadingFile } = useFileUpload();
  useEffect(() => {
    if (profileImage) {
      const url = URL.createObjectURL(profileImage);
      setProfilePic(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [profileImage]);

  // Get ALL MESH BUSINESS SUITE ROLES
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["mesh roles"],
    // ID OF MESH APP IS 1 IN DB
    queryFn: services.getMeshBusinessSuiteRoles(1),
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (data) {
      let temp = [];
      for (let i = 0; i < data.length; i++) {
        temp.push({
          id: data[i].id,
          value: data[i].id,
          label: data[i].role_name,
        });
      }

      if (roleId && temp.length > 0) {
        setSelectedRole(temp.find((role: any) => role.id === roleId));
      
      }
      // @ts-ignore
      setRoles(temp);
    }
  }, [data, isLoading, roleId]);

  if (!isLoading && typeof initialValues?.email !== "undefined") {
    return (
      <>
        <Formik
          initialValues={initialValues}
          onSubmit={submitFn}
          validationSchema={UserSchema}
        >
          {({ errors }) => (
            <Form aria-disabled={readonly}>
              {/* HEADER */}
              <div className="w-full text-primary-dark  flex justify-between">
                {setShowCancelModal && (
                  <>
                    <h3 className="font-semibold text-xl">{title}</h3>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowCancelModal(true)}
                        className="bg-gray-50 border border-gray-200 shadow-sm py-2 flex text-primary-dark text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                      >
                        Discard
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                      >
                        {loading ? (
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
                  </>
                )}
              </div>

              {/* profile picture */}
              <div className="relative w-[140px] h-[140px] rounded-full">
                {profilePic ? (
                  <div className="rounded-full overflow-hidden w-[140px] h-[140px]">
                    <label
                      className="rounded-full block bg-slate-50 w-[140px] h-[140px] object-cover"
                      style={{
                        backgroundImage: profilePicPresentOnLoad
                          ? `url(${profilePic})`
                          : profileImage
                          ? `url(${profilePic})`
                          : "",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></label>
                  </div>
                ) : (
                  <div className="rounded-full  flex items-center justify-center w-[140px] h-[140px] bg-slate-50">
                    <BigUserIcon />
                  </div>
                )}

                {!readonly && (
                  <>
                    {" "}
                    <input
                      type="file"
                      // @ts-ignore
                      ref={inputFileRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        setProfileImage(e.target.files && e.target.files[0]);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        // @ts-ignore
                        inputFileRef?.current?.click();
                      }}
                      className="absolute flex items-center gap-1 border hover:bg-gray-100 border-gray-300 text-sm bg-white rounded-lg px-3 py-1 bottom-4 -right-8"
                    >
                      <MdOutlineEdit />
                      Edit
                    </button>
                  </>
                )}
              </div>

              {/* FORM */}
              <div className="max-w-2xl rounded-lg py-5 pb-10">
                {/* NAME */}
                <div className="flex gap-10">
                  <div className="input-holder">
                    <label>First name</label>
                    <Field
                      style={getStyles(errors, "firstname")}
                      name="firstname"
                      placeholder="First name"
                      disabled={readonly}
                    />{" "}
                    <ShowError name="firstname" />
                  </div>

                  <div className="input-holder">
                    <label>Last name</label>
                    <Field
                      style={getStyles(errors, "lastname")}
                      name="lastname"
                      placeholder="Last name"
                      disabled={readonly}
                    />
                    <ShowError name="lastname" />
                  </div>
                </div>

                {/* Email */}
                <div className="input-holder">
                  <label>Email</label>
                  <Field
                    style={getStyles(errors, "lastname")}
                    name="email"
                    placeholder="Email"
                    disabled={true}
                  />
                  <ShowError name="email" />

                  {!readonly && (
                    <p className="font-light text-xs text-gray-500">
                      A temporal passsword would be sent to this email address
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="input-holder">
                  <label>Phone number</label>
                  <div className="w-[50%]">
                    <PhoneSelector
                      phone={phone}
                      setPhone={setPhone}
                      disabled={readonly}
                    />
                  </div>
                </div>

                <div className="input-holder">
                  <label>Roles</label>
                  <Dropdown
                    selected={selectedRole}
                    setSelected={setSelectedRole}
                    options={roles}
                    disabled={true}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </>
    );
  } else {
    return (
      <div className="h-[20rem] flex items-center justify-center">
        <div>
          <LoadingIcon />
          <p className="mt-2 text-xs text-gray-500">Fetching user details</p>
        </div>
      </div>
    );
  }
};

export default UserForm;
