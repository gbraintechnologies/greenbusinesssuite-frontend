"use client";
import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import "../index.css";
import Countries, { Countrie } from "../components/Countries";
import SelectInput from "../components/SelectInput";
import TextInput from "../components/TextInput";
import UploadAreaInput from "../components/UploadAreaInput";
import { RiDeleteBin5Line } from "react-icons/ri";
import FormatByte from "../components/FormatByte";
import ExcelIcon from "@/public/icons/ExcelIcon";
import Link from "next/link";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  createFreeInputJurisdiction,
  createParentDropdownJurisdiction,
  csvUploads,
} from "@/services/features/jurisdictionsService";

const schema = yup.object().shape({
  id: yup.number().required(),
  name: yup.string().required(),
  jurisdiction: yup.object().shape({
    id: yup.number().required(),
    countryId: yup.number().required(),
    name: yup.string().required(),
  }),
  inputType: yup.string().required(),
});

function NewIndividual() {
  const router = useRouter();
  type typeOfSchema = yup.InferType<typeof schema>;
  const [selectedOption, setSelectedOption] = useState("Free Input");
  const [IDImage, setIDImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileName, setFileName] = useState<any>({ name: "", size: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<typeOfSchema>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: 0,
      name: "",
      jurisdiction: {
        id: 0,
        countryId: 0,
        name: "Ghana",
      },
      inputType: "free-input",
    },
  });

  const [dropdownItems, setDropdownItems] = useState("");
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    setValue("inputType", selectedOption.toLowerCase().replace(" ", "-"));
  }, [selectedOption, setValue]);

  useEffect(() => {
    const defaultCountry = "Ghana";
    setValue("jurisdiction.name", defaultCountry);
  }, [setValue]);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    const acceptedExtensions = [".csv", ".xls", ".xlsx"];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (acceptedExtensions.includes(fileExtension)) {
      setFileName({ name: file.name, size: file.size });
      setIDImage(file);

      console.log("File accepted for upload:", file);

      const simulateImport = () => {
        console.log("Starting upload progress simulation...");
        for (let i = 0; i <= 100; i += 10) {
          setTimeout(() => {
            console.log(`Upload progress: ${i}%`);
            setUploadProgress(i);
          }, i * 50);
        }
      };
      simulateImport();
    } else {
      console.warn("Invalid file type. Please upload a CSV or XLS file.");
      alert("Please upload a CSV or XLS file.");
    }
  };

  const onSubmit = async (data: typeOfSchema) => {
    try {
      const Payload = {
        id: data.id,
        name: data.name,
        jurisdiction: {
          id: data.jurisdiction.id,
          countryId: data.jurisdiction.countryId,
          name: data.jurisdiction.name,
        },
        inputType: data.inputType,
      };
      await createFreeInputJurisdiction(Payload);

      toast.success("Jurisdiction created Successfully", {
        position: "top-center",
        duration: 3000,
        style: {
          color: "green",
        },
      });
      router.push("/country-setup");
    } catch (error: any) {
      console.error("Error occurred:", error);
      alert(error.message);
    }
  };

  const handleSaveAndContinue = async () => {
    // console.log("Button clicked, function triggered.");

    if (isSubmitting) {
      // console.log("Submission is already in progress.");
      return;
    }

    setIsSubmitting(true);
    // console.log("Submission started.");

    try {
      if (IDImage && fileName) {
        const formData = new FormData();
        formData.append("file", IDImage);
        await csvUploads(formData, fileName.name);

        toast.success("CSV file uploaded Successfully", {
          position: "top-center",
          duration: 3000,
          style: {
            color: "green",
          },
        });

        setIDImage(null);
        setUploadProgress(0);
        setFileName({ name: "", size: 0 });

        setIsSubmitting(false);

        router.push("/country-setup");
        return;
      }

      const items = dropdownItems
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
      console.log("Dropdown items set:", items);

      const data = getValues();
      console.log("Form values:", data);

      const Payload2 = {
        parentAddressScheme: {
          id: data.id,
          name: data.name,
          jurisdiction: {
            id: data.jurisdiction.id,
            countryId: data.jurisdiction.countryId,
            name: data.jurisdiction.name,
          },
          inputType: data.inputType,
        },
        entries: items.map((label, index) => ({
          id: index + 1,
          name: label,
        })),
      };
      //console.log("Payload prepared:", Payload2);

      const parentId = await createParentDropdownJurisdiction(Payload2);
      // console.log("Parent dropdown created:", parentId);

      toast.success("Address Scheme saved Successfully", {
        position: "top-center",
        duration: 3000,
        style: {
          color: "green",
        },
      });

      router.push(`/country-setup/region-input?id=${parentId.data}`);
    } catch (error: any) {
      console.error("Error occurred:", error);
      alert(
        `An error occurred: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-5">
      <div className="w-full">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full text-primary-dark flex justify-between">
            <div>
              <h3 className="font-semibold text-xl">
                Country / Jurisdiction Setup
              </h3>
              <p className="text-black-400 text-sm">
                configure all jurisdiction for the company
              </p>
            </div>
          </div>
          <div>
            <div className="mb-2 relative">
              <SelectInput
                listdata={Countries()}
                label="Country"
                autoComplete="off"
                {...register("jurisdiction.name")}
                error={errors.jurisdiction?.name?.message}
                PrependIcon={
                  <span className="absolute left-0 top-2 bottom-0 flex items-center pl-2">
                    <img
                      src={
                        Countrie(getValues("jurisdiction.name") ?? "")?.flags
                          .png
                      }
                      alt={
                        Countrie(getValues("jurisdiction.name") ?? "")?.name
                          .common
                      }
                      style={{ height: "auto", width: "30px" }}
                    />
                  </span>
                }
                style={{ width: "30%", height: "30%" }}
              />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-black-400">Addressing Scheme</h4>
            <p className="text-black-400 text-sm">
              Setup all Parent and Child sub-levels for the Country
            </p>
          </div>

          <div className="mb-1 relative">
            <TextInput
              type="text"
              autoComplete="off"
              label="Level name"
              placeholder="Enter name of category"
              className="rounded xl"
              style={{ width: "30%", height: "30%" }}
              {...register("name")}
              error={errors.name?.message}
            />
          </div>
          <div>
            <p className="text-black-400 text-sm">Child Sub-level Type</p>
          </div>
          <div>
            <div className="flex space-x-4">
              <div
                onClick={() => handleOptionClick("Free Input")}
                className={`relative border border-dashed py-3 rounded-[11px] h-[90px] w-[230px] cursor-pointer ${
                  selectedOption === "Free Input" ? "border-green-500" : ""
                }`}
                style={{
                  backgroundColor:
                    selectedOption === "Free Input" ? "#E5FFEF" : "",
                }}
              >
                <div className="flex flex-col justify-between h-full px-3">
                  <div className="flex justify-between items-center w-full relative">
                    <p className="text-sm font-bold text-gray-900">
                      Free Input
                    </p>
                    <input
                      type="radio"
                      id="free-input"
                      className="custom-radio absolute top-0 right-0 mr-5 mt-0.5"
                      checked={selectedOption === "Free Input"}
                      readOnly
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Free input</p>
                </div>
              </div>

              <div
                onClick={() => handleOptionClick("Dropdown")}
                className={`relative border border-dashed py-3 rounded-[11px] h-[90px] w-[230px] cursor-pointer ${
                  selectedOption === "Dropdown" ? "border-green-500" : ""
                }`}
                style={{
                  backgroundColor:
                    selectedOption === "Dropdown" ? "#E5FFEF" : "",
                }}
              >
                <div className="flex flex-col justify-between h-full px-3">
                  <div className="flex justify-between items-center w-full relative">
                    <p className="text-sm font-bold text-gray-900">Dropdown</p>
                    <input
                      type="radio"
                      id="dropdown"
                      className="custom-radio absolute top-0 right-0 mr-5 mt-0.5"
                      checked={selectedOption === "Dropdown"}
                      readOnly
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {" "}
                    Add your sublevels
                  </p>
                </div>
              </div>
            </div>

            {selectedOption === "Free Input" && (
              <div className="mt-6">
                <div className="flex mb-3" style={{ width: "30%" }}>
                  <button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl mr-2"
                  >
                    <IoIosAddCircleOutline size={20} />
                    Save Changes
                  </button>
                  <Link href="/country-setup">
                    <button
                      type="button"
                      className="button bg-gray-50 border border-gray-200 shadow-sm py-3 px-4 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                    >
                      Cancel
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {selectedOption === "Dropdown" && (
              <div className="mt-6">
                <div>
                  <div className="mb-1 relative">
                    <TextInput
                      type="text"
                      autoComplete="off"
                      label="Dropdown Items"
                      placeholder="Enter a list of comma separated values"
                      className="rounded xl"
                      style={{ width: "30%", height: "30%" }}
                      value={dropdownItems}
                      onChange={(e) => setDropdownItems(e.target.value)}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "30%",
                      margin: "10px 0",
                    }}
                  >
                    <div
                      style={{ flex: 1, borderBottom: "1px solid lightgray" }}
                    ></div>
                    <span
                      style={{
                        margin: "0 10px",
                        fontSize: "16px",
                        color: "black",
                      }}
                    >
                      or
                    </span>
                    <div
                      style={{ flex: 1, borderBottom: "1px solid lightgray" }}
                    ></div>
                  </div>
                  <div className="h-[300px]" style={{ width: "30%" }}>
                    {IDImage ? (
                      <div className="px-5 py-5 pb-5 mt-1 border border-dashed border-grey-500 max-w-[540px] min-h-[70px] rounded-2xl cursor-pointer hover:border-grey-800 flex flex-col justify-center p-4 bg-gray-100">
                        <div className="relative">
                          <div className="flex flex-row mb-2">
                            <ExcelIcon />
                            <div>
                              <div className="font-semibold">
                                &nbsp;&nbsp;{fileName?.name}
                              </div>
                              <div>
                                {FormatByte(fileName ? fileName.size : 0)}
                              </div>
                            </div>
                          </div>
                          <div className="w-auto h-3 bg-white rounded-full relative">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <div className="absolute top-0 right-0 mb-20">
                            <button
                              className="rounded-full"
                              onClick={() => {
                                setIDImage(null);
                                setUploadProgress(0);
                                setFileName({ name: "", size: 0 });
                              }}
                            >
                              <RiDeleteBin5Line
                                color="red"
                                className="h-5 w-10"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <UploadAreaInput
                        onDrop={handleDrop}
                        label="Drag and drop or choose a file to upload"
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-4" style={{ width: "30%" }}>
                  <Link href="/country-setup">
                    <button
                      type="button"
                      className="button bg-gray-50 border border-gray-200 shadow-sm py-3 px-4 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl mr-3"
                    >
                      Cancel
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSaveAndContinue}
                    className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                  >
                    Save and Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewIndividual;
