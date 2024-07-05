"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { IoIosAddCircleOutline } from "react-icons/io";
import Link from "next/link";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/Modal/Modal";
import { GoDotFill } from "react-icons/go";
import DeleteIcon from "@/public/icons/DeleteIcon";
import EditIconSetup from "@/public/icons/EditIconSetup";
import SelectCountryEdit from "../components/selectCountryEdit";
import TextInput from "../components/TextInput";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Countrie, Countrieses } from "../components/Countries";
import { editSubsectorByID } from "@/services/features/sectorService";

const schema = yup.object().shape({
  id: yup.number().required(),
  countryName: yup.string().required(),
  sector: yup
    .object()
    .shape({
      sectorId: yup.number().required(),
      subSectors: yup.array().of(yup.string().required()).required(),
      parentSector: yup.string().required(),
    })
    .required(),
});

function EditSector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const Id = searchParams.get("id");
  const countryId = searchParams.get("countryId");
  const { data, isLoading } = useQuery({
    queryKey: ["all sectorByID", countryId, Id],
    queryFn: services.getSubSectorByID(Number(countryId), Number(Id)),
    enabled: !!countryId && !!Id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: 0,
      countryName: "",
      sector: {
        sectorId: 0,
        subSectors: [],
        parentSector: "",
      },
    },
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [subSectorToDelete, setSubSectorToDelete] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("countryName", data.countryName);
      setValue("sector.sectorId", data.sector.sectorId);
      setValue("sector.subSectors", data.sector.subSectors);
      setValue("sector.parentSector", data.sector.parentSector);
    }
  }, [data, setValue]);

  const subSectors = watch("sector.subSectors");

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditValue(subSectors[index]);
  };

  const handleSaveEdit = () => {
    if (editIndex !== null) {
      const updatedSubSectors = [...subSectors];
      updatedSubSectors[editIndex] = editValue;
      setValue("sector.subSectors", updatedSubSectors);
      setEditIndex(null);
      setEditValue("");
    }
  };

  const handleDelete = (index: number) => {
    setSubSectorToDelete(index);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    if (subSectorToDelete !== null) {
      const updatedSubSectors = subSectors.filter(
        (_, i) => i !== subSectorToDelete
      );
      setValue("sector.subSectors", updatedSubSectors);
      setShowDeleteModal(false);
      setSubSectorToDelete(null);
    }
  };

  const onSubmit = async () => {
    try {
      const subSectorsToSend = watch("sector.subSectors");
      const sectorIdToSend = watch("sector.sectorId");
      console.log("Submitting with sectorId:", sectorIdToSend);
      console.log("Submitting subSectors:", subSectorsToSend);

      const response = await editSubsectorByID(
        Number(sectorIdToSend),
        subSectorsToSend
      );

      toast.success("Sub-sector edited successfully", {
        position: "top-center",
        duration: 3000,
        style: {
          color: "green",
        },
      });
      router.push("/sector-setup"); // Redirect to sector setup page
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data");
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
                className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
              >
                <IoIosAddCircleOutline size={20} />
                Save Changes
              </button>
            </div>
          </div>
          <div>
            <div className="mb-3 relative">
              <SelectCountryEdit
                label="Country"
                autoComplete="off"
                {...register("countryName")}
                value={watch("countryName")}
                error={errors.countryName?.message}
                options={[data?.countryName || ""]} // Ensure options is an array
                readOnly
                PrependIcon={
                  data?.countryName ? (
                    <img
                      src={Countrie(data.countryName)?.flags.png}
                      alt={Countrie(data.countryName)?.name.common}
                      style={{ height: "auto", width: "30px" }}
                    />
                  ) : null
                }
                style={{ width: "30%", height: "30%" }}
              />
            </div>
            <label className="inline-block mr-2 text-xs font-bold text-black-300">
              Parent Sector Name
            </label>
            <div className="mb-5 relative">
              <TextInput
                type="text"
                autoComplete="off"
                className="rounded xl"
                {...register("sector.parentSector")}
                error={errors.sector?.parentSector?.message}
                style={{ width: "30%", height: "30%" }}
                defaultValue={watch("sector.parentSector")}
                readOnly
              />
            </div>
            <label
              className="inline-block mr-2 text-xs font-bold text-black-400"
              htmlFor="input"
            >
              <GoDotFill className="inline-block " />
              Sub-sectors
            </label>
            {subSectors &&
              subSectors.map((subSector, index) => (
                <div className="flex items-center mb-4" key={index}>
                  <input
                    type="text"
                    {...register(`sector.subSectors.${index}`)}
                    defaultValue={subSector}
                    className="mr-2 px-5 border-b mb-1 pb-1 input-custom"
                    style={{ width: "30%" }}
                    readOnly
                  />
                  <div style={{ width: "100%" }}>
                    <div className="flex items-center" style={{ width: "30%" }}>
                      <div
                        className="mr-2 px-5 border-b mb-1 pb-1"
                        style={{ width: "30%" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span></span>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleEdit(index)}
                              className="rounded-full"
                            >
                              <EditIconSetup />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(index)}
                              className="rounded-full ml-2"
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {/* <div
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
            </div> */}
          </div>
        </form>
      </div>

      {editIndex !== null && (
        <Modal
          isOpen={editIndex !== null}
          setIsOpen={() => setEditIndex(null)}
          title="Edit Sub-Sector"
        >
          <div>
            <div className="px-7">
              <TextInput
                label="Sub-Sector name"
                type="text"
                placeholder=""
                autoComplete="off"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            </div>

            <div className="p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
              <button
                onClick={() => setEditIndex(null)}
                className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-2xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-primary-green py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-2xl"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          setIsOpen={setShowDeleteModal}
          title="Are you sure you want to delete this sub-sector?"
        >
          <div>
            <p className="px-5 mt-5 text-[#334155]">
              The sub-sector will be deleted permanently.
            </p>

            <div className="p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-center mt-5">
              <button
                onClick={handleDeleteConfirmed}
                className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-2xl"
              >
                Okay
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default EditSector;
