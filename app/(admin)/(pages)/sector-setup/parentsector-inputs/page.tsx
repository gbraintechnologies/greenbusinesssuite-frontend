"use client";
import React, { useState, useEffect } from "react";
import TextInput from "../components/TextInput";
import Link from "next/link";
import { IoIosAddCircleOutline } from "react-icons/io";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import { updateSector } from "@/services/features/sectorService";

interface Sector {
  id: number;
  parentSector: string;
  subSector: string[];
}

interface FormData {
  id: number;
  countryName: string;
  sectors: Sector[];
}

const schema = yup.object({
  id: yup.number().required(),
  countryName: yup.string().required(),
  sectors: yup
    .array()
    .of(
      yup.object({
        id: yup.number().required(),
        parentSector: yup.string().required(),
        subSector: yup.array().of(yup.string().required()).required(),
      })
    )
    .required(),
});

function ParentSectorInputs() {
  const searchParams = useSearchParams();
  const Id = searchParams.get("id");
  const router = useRouter();

  const { data: initialEntries } = useQuery<FormData>({
    queryKey: ["all Parent entries"],
    queryFn: services.getSectorByID(parseInt(Id || "", 10)),
    enabled: !!Id,
    refetchOnWindowFocus: false,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    countryName: "",
    sectors: [],
  });

  useEffect(() => {
    if (initialEntries) {
      setFormData(initialEntries);
      reset(initialEntries);
    }
  }, [initialEntries, reset]);

  const handleChange = (index: number, value: string) => {
    const updatedSectors = [...formData.sectors];
    updatedSectors[index].subSector = value.split(",").map((s) => s.trim());
    setFormData((prev) => ({ ...prev, sectors: updatedSectors }));
    setValue(`sectors.${index}.subSector`, updatedSectors[index].subSector);
  };

  const onSubmitHandler = async (data: FormData) => {
    try {
      console.log("Form Data Before Payload Construction:", getValues());

      const payload = {
        id: data.id,
        countryName: data.countryName,
        sectors: data.sectors.map((sector, index) => ({
          id: sector.id,
          parentSector: sector.parentSector,
          subSector: formData.sectors[index].subSector,
        })),
      };

      console.log("Constructed Payload:", payload);
      await updateSector(payload);

      // Success feedback
      toast.success("Sector Setup created successfully", {
        position: "top-center",
        duration: 3000,
        style: {
          color: "green",
        },
      });
      router.push("/sector-setup");
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div className="w-full p-5">
      <div className="w-full">
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <div className="w-full text-primary-dark flex justify-between">
            <div>
              <h3 className="font-semibold text-xl">Sector Setup</h3>
              <p className="text-black-400 text-sm">
                Configure all sectors for the jurisdiction
              </p>
            </div>
          </div>

          {formData.sectors &&
            formData.sectors.map((sector, index) => (
              <div className="mt-4" key={sector.id}>
                <div className="mb-1 relative">
                  <TextInput
                    type="text"
                    autoComplete="off"
                    label={sector.parentSector}
                    placeholder="Enter comma separated values"
                    className="rounded xl"
                    style={{ width: "30%", height: "100px" }}
                    value={sector.subSector.join(", ")}
                    onChange={(e) => handleChange(index, e.target.value)}
                  />
                </div>
              </div>
            ))}

          <div className="flex justify-end mt-1" style={{ width: "30%" }}>
            <Link href="/sector-setup/add-sector">
              <button
                type="button"
                className="button bg-gray-50 border border-gray-200 shadow-sm py-3 px-4 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl mr-3"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
            >
              <IoIosAddCircleOutline size={20} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ParentSectorInputs;
