"use client";
import React, { useState, useEffect } from "react";
import TextInput from "../components/TextInput";
import Link from "next/link";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCountry } from "@/services/features/countryService";

interface ParentLevel {
  id: number;
  parentName: string;
  childLevels: string[];
}

interface FormData {
  addressingScheme: {
    parentLevels: ParentLevel[];
  };
}

function RegionInput() {
  const searchParams = useSearchParams();
  const parentId = searchParams.get("id");
  const router = useRouter();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [rawInputs, setRawInputs] = useState<string[]>([]);

  const { data } = useQuery({
    queryKey: ["all countries", parentId],
    queryFn: services.getcountryByID(Number(parentId)),
    enabled: !!parentId,
  });

  useEffect(() => {
    if (data) {
      setFormData(data);
      setRawInputs(data.addressingScheme.parentLevels.map(() => ""));
    }
  }, [data]);

  const handleChange = (index: number, value: string) => {
    const updatedInputs = [...rawInputs];
    updatedInputs[index] = value;
    setRawInputs(updatedInputs);
    if (formData) {
      const updatedParentLevels = formData.addressingScheme.parentLevels.map((level, idx) =>
        idx === index ? { ...level, childLevels: value.split(",").map(s => s.trim()) } : level
      );
      setFormData({
        ...formData,
        addressingScheme: {
          ...formData.addressingScheme,
          parentLevels: updatedParentLevels,
        },
      });
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData) {
      try {
        await updateCountry(formData); // Send formData to the API
        toast.success("Jurisdiction created Successfully", { position: "top-center", duration: 3000 });
        router.push("/country-setup"); // Redirect after success
      } catch (error) {
        toast.error("Failed to update country.");
        console.error(error);
      }
    }
  };

  return (
    <div className="w-full p-5">
      <div className="w-full">
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="w-full text-primary-dark flex justify-between">
            <div>
              <h3 className="font-semibold text-xl">Country / Jurisdiction Setup</h3>
              <p className="text-black-400 text-sm">Configure all jurisdictions for the company</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-black-400">Individual dropdown options</h4>
            <p className="text-black-400 text-sm">Setup all Parent and Child sub-levels for the Country</p>
          </div>

          {formData?.addressingScheme.parentLevels.map((level, index) => (
            <div className="mt-4" key={level.id}>
              <div className="mb-1 relative">
                <TextInput
                  type="text"
                  autoComplete="off"
                  label={level.parentName}
                  placeholder="Enter comma-separated values"
                  className="rounded xl"
                  style={{ width: "30%", height: "100px" }}
                  value={rawInputs[index] || ""}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-1" style={{ width: "30%" }}>
            <Link href="/country-setup/new-individual">
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

export default RegionInput;
