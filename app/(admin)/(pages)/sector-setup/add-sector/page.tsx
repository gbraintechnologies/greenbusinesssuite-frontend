"use client";
import React, { useState, useEffect } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Countrieses } from "../components/Countries";
import FormatByte from "../components/FormatByte";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import TextInput from "../components/TextInput";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import UploadAreaInput from "../components/UploadAreaInput";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ExcelIcon from "@/public/icons/ExcelIcon";
import { RiDeleteBin5Line } from "react-icons/ri";
import { createSector, csvUpload } from "@/services/features/sectorService";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";

type Key = any;

const schema = yup.object().shape({
  id: yup.number(),
  countryName: yup.string(),
  parentSector: yup.array().of(yup.string()),
});

function AddSector() {
  type typeOfSchema = yup.InferType<typeof schema>;
  const router = useRouter();
  const [countries, setCountries] = useState<string[]>([]);
  const [IDImage, setIDImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileName, setFileName] = useState<{
    name: string;
    size: number;
  } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
    trigger,
  } = useForm<typeOfSchema>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: 0,
      countryName: "",
      parentSector: [],
    },
  });
  const [parentsectorItems, setParentSectorItems] = useState("");
  const { data: countriesData } = useQuery({
    queryKey: ["all_countries"],
    queryFn: services.allcountries(),
  });

  useEffect(() => {
    if (countriesData && Array.isArray(countriesData)) {
      setCountries(countriesData);
    } else {
      setCountries([]);
    }
  }, [countriesData]);

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
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (IDImage && fileName) {
        const formData = new FormData();
        formData.append("file", IDImage);

        await csvUpload(formData, fileName.name);

        toast.success("CSV file uploaded successfully", {
          position: "top-center",
          duration: 3000,
        });

        setIDImage(null);
        setUploadProgress(0);
        setFileName(null);

        router.push("/sector-setup");
        return;
      }
    } catch (error: any) {
      toast.error(
        `An error occurred: ${error.response?.data?.message || error.message}`,
        {
          position: "top-center",
          duration: 3000,
          style: { color: "red" },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveAndContinue = async (data: typeOfSchema) => {
    const items = parentsectorItems
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);

    const payload = {
      countryName: data.countryName,
      parentSector: items,
    };

    try {
      const response = await createSector(payload);
      toast.success("Sector saved successfully", {
        position: "top-center",
        duration: 3000,
      });

      router.push(`/sector-setup/parentsector-inputs?id=${response.data}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("Sector already exists", {
          position: "top-center",
          duration: 3000,
        });
      } else {
        toast.error(
          `An error occurred: ${
            error.response?.data?.message || error.message
          }`,
          {
            position: "top-center",
            duration: 3000,
          }
        );
      }
    }
  };

  return (
    <div className="w-full p-5">
      <div className="w-full">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full text-primary-dark flex justify-between">
            <div>
              <h3 className="font-semibold text-xl">Sector Setup</h3>
              <p className="text-black-400 text-sm">
                Configure all sectors for a jurisdiction
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <Link href="/sector-setup">
                <button
                  type="button"
                  className="button bg-gray-50 border border-gray-200 shadow-sm py-3 px-4 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                >
                  Cancel
                </button>
              </Link>

              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
              >
                <IoIosAddCircleOutline size={20} />
                Save
              </button>
            </div>
          </div>
          <div>
            <div className="new-input half hide-input-borders">
              <label className="text-xs">Country</label>
              <div
                className="mt-1 flex w-full bg-slate-50 h-auto rounded-lg border border-[#E2E8F0]"
                style={{ width: "30%" }}
              >
                <Autocomplete
                  variant="bordered"
                  className="w-full "
                  placeholder={"Select country"}
                  selectedKey={selectedCountry}
                  scrollShadowProps={{
                    isEnabled: false,
                  }}
                  popoverProps={{
                    offset: 10,
                    classNames: {
                      content:
                        "shadow-md bg-white border border-[#F1F5F9] p-0 rounded-lg min-w-72 flex flex-col gap-3",
                    },
                  }}
                  onSelectionChange={(key: Key | null) => {
                    const keyString = key ? String(key) : null;
                    setSelectedCountry(keyString);
                    setValue("countryName", keyString || "");
                    trigger("countryName");
                  }}
                  aria-labelledby="Country"
                >
                  {countriesData?.map((country: any) => (
                    <AutocompleteItem
                      key={country}
                      value={country}
                      className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[rgb(241,245,249)]"
                      startContent={
                        <img
                          src={Countrieses(country)?.flags.png}
                          alt={Countrieses(country)?.name.common}
                          style={{
                            height: "24px",
                            width: "24px",
                            borderRadius: "50%",
                          }}
                        />
                      }
                    >
                      {country}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
            </div>

            <label className="inline-block mr-2 mt-6 text-xs text-black-300">
              Parent Sectors
            </label>
            <div className="mb-5 relative">
              <TextInput
                type="text"
                autoComplete="off"
                className="rounded xl"
                name="parentSector"
                value={parentsectorItems}
                onChange={(e) => setParentSectorItems(e.target.value)}
                style={{ width: "30%", height: "30%" }}
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit(saveAndContinue)}
              className="bg-primary-green py-3 text-white text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl"
              style={{ width: "30%" }}
            >
              <IoIosAddCircleOutline />
              Save and add Sub-sectors
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "30%",
                margin: "20px 0",
              }}
            >
              <div
                style={{ flex: 1, borderBottom: "1px solid lightgray" }}
              ></div>
              <span
                style={{ margin: "0 10px", fontSize: "16px", color: "black" }}
              >
                or
              </span>
              <div
                style={{ flex: 1, borderBottom: "1px solid lightgray" }}
              ></div>
            </div>
          </div>

          <div className="h-[300px]" style={{ width: "30%" }}>
            <div className="w-full h-[304px]">
              {IDImage ? (
                <div className="px-5 py-5 pb-5 mt-1 border border-dashed border-grey-500 max-w-[540px] min-h-[70px] rounded-2xl cursor-pointer hover:border-grey-800 flex flex-col justify-center p-4 bg-gray-100">
                  <div className="relative">
                    <div className="flex flex-row mb-2">
                      <ExcelIcon />
                      <div>
                        <div className="font-semibold">
                          &nbsp;&nbsp;{fileName?.name}
                        </div>
                        <div>{FormatByte(fileName ? fileName.size : 0)}</div>
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
                        <RiDeleteBin5Line color="red" className="h-5 w-10" />
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
        </form>
      </div>
    </div>
  );
}

export default AddSector;
