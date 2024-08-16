"use client";
import React, { useState, useEffect } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Countrie, Countrieses } from "../components/Countries";
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
import {
  createorUpdateSector,
  csvUpload,
} from "@/services/features/sectorService";
import SelectCountryInput from "../components/selectCountryInput";



interface Country {
  id: number;
  name: string;
}

interface CountriesResponse {
  content: Country[];
  pageable: {
    // add other properties if needed
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}


const schema = yup.object().shape({
  id: yup.number(),
  countryName: yup.string(),
  parentSector: yup.array().of(yup.string()),
});

function AddSector() {
  type typeOfSchema = yup.InferType<typeof schema>;
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
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
    getValues,
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
  const { data: countriesData } = useQuery<CountriesResponse, Error>({
    queryKey: ["all_countries", page, limit, searchTerm],
    queryFn: services.allJurisdictions(page, limit, searchTerm),
  });

  useEffect(() => {
   // alert(JSON.stringify(countriesData))
    const countryName = getValues("countryName");

    if (countryName) {
      const country = Countrieses(countryName);
      //console.log("Matching country found:", country);
      if (country) {
        setSelectedCountry(country.cca2);
      }
    }
  }, [getValues("countryName"), countriesData]);

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
          style: { color: "green" },
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
      const response = await createorUpdateSector(payload);
      toast.success("Sector saved successfully", {
        position: "top-center",
        duration: 3000,
        style: { color: "green" },
      });

      router.push(`/sector-setup/parentsector-inputs?id=${response.data}`);
    } catch (error: any) {
      toast.error(
        `An error occurred: ${error.response?.data?.message || error.message}`,
        {
          position: "top-center",
          duration: 3000,
          style: { color: "red" },
        }
      );
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
            <div className="mb-3 relative">
              <SelectCountryInput
                key={selectedCountry}
                listdata={countriesData?.content ?? []}
                label="Country"
                autoComplete="off"
                {...register("countryName")}
                error={errors.countryName?.message}
                PrependIcon={
                  selectedCountry ? (
                    <span className="absolute left-0 top-2 bottom-0 flex items-center pl-2">
                      <img
                        src={
                          selectedCountry
                            ? Countrie(selectedCountry)?.flags.png
                            : ""
                        }
                        alt={
                          selectedCountry
                            ? Countrie(selectedCountry)?.name.common
                            : ""
                        }
                        style={{ height: "auto", width: "30px" }}
                      />
                    </span>
                  ) : null
                }
                style={{ width: "30%", height: "30%" }}
              />
            </div>
            <label className="inline-block mr-2 text-xs font-bold text-black-300">
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
