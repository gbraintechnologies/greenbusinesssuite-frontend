'use client'
import React, { ChangeEvent, useState } from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import Countries, { Countrie } from "../components/Countries";
import SelectInput from "../components/SelectInput";
import Image from "next/image";
import { IoCloseCircleOutline } from "react-icons/io5";
import FormatByte from "../components/FormatByte";
import Link from 'next/link';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { GoDotFill } from "react-icons/go";
import { useForm } from "react-hook-form";
import TextInput from '../components/TextInput';
import UploadAreaInput from '../components/UploadAreaInput';
import DeleteIcon from '@/public/icons/DeleteIcon';
import EditIconSetup from '@/public/icons/EditIconSetup';
import Modal from "../../../../components/Modal/Modal";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createSector } from '@/services/features/sectorService';


interface SectorData {
  id: number;
  parentSector: string;
  subSector: string[];
}


const schema = yup.object({
  id: yup.number(),
  countryName: yup.string().required(),
  sectors: yup.array().of(
    yup.object({
      id: yup.number(),
      parentSector: yup.string(),
      subSector: yup.array().of(yup.string())
    })
  )
});

function AddSector() {

  type typeOfSchema = yup.InferType<typeof schema>;
  const router = useRouter();
  const [IDImage, setIDImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileName, setFileName] = useState<any>({ 'name': '', 'size': '' });
  const [sectorlevels, setSectorLevels] = useState<SectorData[]>([]);
  const [showSectorInput, setShowSectorInput] = useState<boolean>(false);
  const [sectorlevel, setSectorLevel] = useState<SectorData>({ id: 0, parentSector: '', subSector: [] });
  const [editMode, setEditMode] = useState<number | null>(null);
  const [newSubSector, setNewSubSector] = useState('');
  const [editSubSectorIndex, setEditSubSectorIndex] = useState<number | null>(null);
  const [editSectorName, setEditSectorName] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [sectorToDelete, setSectorToDelete] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addingSector, setAddingSector] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting, errors, dirtyFields }, getValues } = useForm<typeOfSchema>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: 0,
      countryName: "",
      sectors: []
    },
  });

  const handleEditModalOpen: (id: number, subSectorIndex: number, subSector: string) => void = (id, subSectorIndex, subSector) => {
    setEditMode(id);
    setEditSubSectorIndex(subSectorIndex);
    setEditSectorName(subSector);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editMode !== null && editSubSectorIndex !== null) {
      setSectorLevels(prevSectorLevels =>
        prevSectorLevels.map(sectorlevel =>
          sectorlevel.id === editMode
            ? {
              ...sectorlevel,
              subSector: sectorlevel.subSector.map((sub, idx) =>
                idx === editSubSectorIndex ? editSectorName : sub
              )
            }
            : sectorlevel
        )
      );
      setEditMode(null);
      setEditSubSectorIndex(null);
      setEditSectorName('');
      setShowEditModal(false);
    }
  };


  const handleDeleteModalOpen = (id: number) => {
    alert(id)
    setSectorToDelete(id);
    setShowDeleteModal(true);
  };


  const handleDeleteConfirmed = (id: number) => {
    if (id !== null) {
      setSectorLevels(prevSectorLevels =>
        prevSectorLevels.filter(sectorlevel => sectorlevel.id !== id)
      );
      setShowDeleteModal(false);
      setEditMode(null);
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const acceptedExtensions = [".csv", ".xls", ".xlsx"];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    setFileName({ name: file.name, size: file.size });

    if (acceptedExtensions.includes(fileExtension)) {
      const simulateImport = () => {
        for (let i = 0; i <= 100; i += 10) {
          setTimeout(() => {
            setUploadProgress(i);
          }, i * 50);
        }
      };
      simulateImport();
    } else {
      alert("Please upload a CSV or XLS file.");
    }
  };

  const onSubmit = async (data: typeOfSchema) => {
    try {
      const sectorPayload = {
        id: data.id,
        countryName: data.countryName,
        sectors: sectorlevels,
      };
      // alert(JSON.stringify(sectorPayload));
     // await createSector(sectorPayload);
      toast.success("Currency added Successfully", {
        position: "top-center",
        duration: 3000,
      });
      router.push("/sector-setup");
    } catch (error: any) {
      console.error('Error occurred:', error);
      alert(error.message);
    }
  }

  const handleAddSectorLevel = async () => {
    if (newSubSector.trim() === '' || addingSector) return;

    setAddingSector(true);

    try {
      const updatedSectorLevels = [...sectorlevels];
      const sectorToUpdateIndex = updatedSectorLevels.findIndex(sector => sector.parentSector === sectorlevel.parentSector);

      if (sectorToUpdateIndex !== -1) {
        const sectorToUpdate = updatedSectorLevels[sectorToUpdateIndex];
        if (!sectorToUpdate.subSector.includes(newSubSector)) {
          sectorToUpdate.subSector.push(newSubSector);
          updatedSectorLevels[sectorToUpdateIndex] = sectorToUpdate;
        }
      } else {
        const newId = updatedSectorLevels.length + 1;
        updatedSectorLevels.push({ id: newId, parentSector: sectorlevel.parentSector, subSector: [newSubSector] });
      }

      setSectorLevels(updatedSectorLevels);
      setNewSubSector('');
      setShowSectorInput(false);
    } catch (error) {
      console.error('Error occurred while adding sector:', error);
    } finally {
      setAddingSector(false);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSectorLevel((prevSectorLevel) => ({
      ...prevSectorLevel,
      parentSector: value,
    }));
  };

  const handleInputChange = (index: number, value: string) => {
    setSectorLevels((prevSectorLevels) => {
      const updatedSectorLevels = [...prevSectorLevels];
      const sectorToUpdateIndex = updatedSectorLevels.findIndex(sector => sector.parentSector === sectorlevel.parentSector);

      if (sectorToUpdateIndex !== -1) {
        updatedSectorLevels[sectorToUpdateIndex].subSector = [
          ...updatedSectorLevels[sectorToUpdateIndex].subSector,
          ...value.split(',').map(s => s.trim())
        ];
      }

      return updatedSectorLevels;
    });
  };

  const handleNewSubSectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSubSector(e.target.value);
  };

  return (
    <div className='w-full p-5'>
      <div className="w-full">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full text-primary-dark flex justify-between">
            <div>
              <h3 className="font-semibold text-xl">Sector Setup</h3>
              <p className="text-black-400 text-sm">Configure all sectors for a jurisdiction</p>
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
                disabled={isSubmitting || !dirtyFields.countryName}
                onClick={handleSubmit(onSubmit)}
                className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
              >
                <IoIosAddCircleOutline size={20} />Save
              </button>
            </div>
          </div>
          <div>
            <div className="mb-8 relative">
              <SelectInput
                listdata={Countries()}
                label="Country"
                autoComplete="off"
                {...register("countryName")}
                error={errors.countryName?.message}
                PrependIcon={
                  <span className="absolute left-0 top-2 bottom-0 flex items-center pl-2">
                    <img
                      src={Countrie(getValues("countryName") ?? '')?.flags.png}
                      alt={Countrie(getValues("countryName") ?? '')?.name.common}
                      style={{ height: "auto", width: "30px" }}
                    />
                  </span>
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
                name="parentSector"
                value={sectorlevel.parentSector}
                style={{ width: "30%", height: "30%" }}
                onChange={handleChange}
              />
            </div>
            <label className="inline-block mr-2 text-xs font-bold text-black-400" htmlFor="input">
              <GoDotFill className="inline-block " />Sub-sectors
            </label>
            {sectorlevels.map((sectorlevel, index) => (
              <div className="flex items-center mb-4" key={index}>
                {editMode === sectorlevel.id ? (
                  <input
                    type="text"
                    id={`sub-level-${index}`}
                    name={`sectors[${index}].subSector`}
                    value={sectorlevel.subSector.join(', ')}
                    className="mr-2 px-5 border-b mb-1 pb-1"
                    style={{ width: "30%" }}
                    onChange={(e) => handleInputChange(sectorlevel.id, e.target.value)}
                  />
                ) : (
                  <div style={{ width: "100%" }}>
                    {sectorlevel.subSector.map((sub, subIndex) => (
                      <div key={subIndex} className="flex items-center" style={{ width: "100%" }}>
                        <div className="mr-2 px-5 border-b mb-1 pb-1" style={{ width: "30%" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span>{sub}</span>
                            <div className="flex items-center">
                              <button className="rounded-full" onClick={() => handleEditModalOpen(sectorlevel.id, subIndex, sub)}>
                                <EditIconSetup />
                              </button>
                              <button className="rounded-full ml-2" onClick={() => handleDeleteModalOpen(sectorlevel.id)}>
                                <DeleteIcon />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {showSectorInput && (
              <div className="combined-input-container flex items-center mb-3" style={{ width: "30%" }}>
                <TextInput
                  name="subSector"
                  type="text"
                  autoComplete="off"
                  className="rounded xl"
                  style={{ width: "93%" }}
                  value={newSubSector}
                  onChange={handleNewSubSectorChange}
                />
                &nbsp;&nbsp;
                <button
                  type="button"
                  onClick={handleAddSectorLevel}
                  className="bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100"
                >
                  Add
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowSectorInput(true)}
              className="bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100"
              style={{ width: "30%" }}
            >
              <IoIosAddCircleOutline />
              Add Sub-Sector
            </button>
            <div style={{ display: 'flex', alignItems: 'center', width: '30%', margin: '20px 0' }}>
              <div style={{ flex: 1, borderBottom: '1px solid lightgray' }}></div>
              <span style={{ margin: '0 10px', fontSize: '16px', color: 'black' }}>or</span>
              <div style={{ flex: 1, borderBottom: '1px solid lightgray' }}></div>
            </div>
          </div>

          <div className="h-[300px]" style={{ width: "30%" }}>
            {IDImage ? (
              <div className="border relative border-dashed border-gray-300 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{fileName.name}</span>
                  <IoCloseCircleOutline
                    size={24}
                    className="cursor-pointer"
                    onClick={() => setIDImage(null)}
                  />
                </div>
                <div className="w-full bg-gray-200 h-1 mt-2 rounded">
                  <div
                    className="bg-primary-green h-1 rounded"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm">{FormatByte(fileName.size)}</div>
              </div>
            ) : (
              <UploadAreaInput onDrop={handleDrop} />
            )}
          </div>
        </form>
      </div>
      <Modal
        isOpen={showEditModal}
        setIsOpen={setShowEditModal}
        title="Edit Sub-Sector"
      >
        <div>
          <div className="px-7">
            <TextInput
              label="Sub-Sector name"
              type="text"
              placeholder=""
              autoComplete="off"
              value={editSectorName}
              onChange={(e) => setEditSectorName(e.target.value)}
            />
          </div>

          <div className="p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
            <button
              onClick={() => setShowEditModal(false)}
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

      <Modal
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
        title="Are you sure you want to delete sub-sector?"
      >
        <div>
          <p className="px-5 mt-5 text-[#334155]">
            The sub-sector will be deleted permanently
          </p>

          <div className=" float-center p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-center mt-5">
            <button
              onClick={() => {
                if (sectorToDelete !== null) {
                  handleDeleteConfirmed(sectorToDelete);
                }
              }}
              className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-2xl"
            >
              Okay
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AddSector;