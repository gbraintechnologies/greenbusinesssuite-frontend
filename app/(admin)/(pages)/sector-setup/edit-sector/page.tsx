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
import { Countrie } from "../../country-setup/components/Countries";
import DataTable from "@/components/DataTable/DataTable";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteIcon from "@/public/icons/DeleteIcon";
import EditIconSetup from "@/public/icons/EditIconSetup";
import SelectCountryEdit from "../components/selectCountryEdit";
import TextInput from "../components/TextInput";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteAllSectors, updateSector } from "@/services/features/sectorService";

const schema = yup.object().shape({
  id: yup.number().required(),
  countryName: yup.string().required(),
  sectors: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().required(),
        parentSector: yup.string().required(),
        subSectors: yup.array().of(yup.string().required()).required(),
      })
    )
    .required(),
});

type Row = {
  id: number;
  sector: string;
  subSector: string;
};

interface SectorPayload {
  id: number;
  countryName: string;
  sectors: Array<{
    id: number;
    parentSector: string;
    subSectors: string[];
  }>;
}

interface UpdatedRow {
  id: number;
  countryName: string;
  sector: string;
  subSector: string;
  sectors: Array<{
    id: number;
    parentSector: string;
    subSectors: string[];
  }>;
}

function EditSector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const Id = searchParams.get("id");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["all sectors", Id],
    queryFn: services.getSectorByID(Number(Id)),
    enabled: !!Id,
  });

  useEffect(() => {
    // alert(JSON.stringify(data))
  }, [data])

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: 0,
      countryName: "",
      sectors: [],
    },
  });
  type typeOfSchema = yup.InferType<typeof schema>;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("countryName", data.countryName);
      setValue("sectors", data.sectors);

      if (Array.isArray(data.sectors)) {
        const transformedRows = data.sectors.map((sector: any) => ({
          id: sector.id,
          sector: sector.parentSector,
          subSector: sector.subSector.join(", "),
        }));

        setRows(transformedRows);
      }
    }
  }, [data, setValue]);


  // Assuming UpdatedRow includes 'countryName' and 'sectorsts'
  const handleSaveEdit = () => {
    if (!editRow) return;
  
    // Create an UpdatedRow object without countryName and sectors
    const updatedEditRow: UpdatedRow = {
      id: editRow.id,
      sector: editRow.sector,
      subSector: editRow.subSector,
      countryName: '', // If not needed, you can leave it empty or adjust as necessary
      sectors: [], // If not needed, you can leave it empty or adjust as necessary
    };
  
    // Update rows
    const rowIndex = rows.findIndex(row => row.id === editRow.id);
  
    if (rowIndex === -1) {
      console.error("Row not found in rows array.");
      return;
    }
  
    const updatedRows = [...rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      sector: editRow.sector,
      subSector: editRow.subSector,
    };
  
    setRows(updatedRows);
    handleParentChildrenUpdate(updatedEditRow); // Use UpdatedRow here
    setIsModalOpen(false);
  };
  

const mapRowsToPayload = (updatedRow: UpdatedRow): SectorPayload => {
  const formData = getValues();
  const { id, countryName, sectors } = formData;

  const updatedSectors = sectors.map((sector: any) => {
    if (sector.id === updatedRow.id) {
      return {
        ...sector,
        parentSector: updatedRow.sector,
        subSectors: updatedRow.subSector.split(", ").map((sub: string) => sub.trim()),
      };
    }
    return sector;
  });

  return {
    id,
    countryName,
    sectors: updatedSectors,
  };
};


  
  const handleParentChildrenUpdate = async (data: UpdatedRow) => {
    let loadingToast = toast.loading("Please wait...");
    try {
      const payload = mapRowsToPayload(data);
  
      // Log the payload to check if it's correct
      console.log('Payload to be sent:', JSON.stringify(payload));
  
      // Update sector using the API function
      await updateSector(payload);
  
      toast.dismiss(loadingToast);
      toast.success(payload?.sectors[0].parentSector + " updated");
  
      await refetch();
    } catch (error) {
      toast.dismiss(loadingToast);
  
      // Log the error to understand what went wrong
      console.error('Error updating sector:', error);
  
      toast.error("Error updating. Please try again");
    }
  };
  

  const handleDeleteRow = async (row: Row | null) => {
  };

  const handleDeleteAll = async () => {
    // alert(JSON.stringify(Id))
    try {
      if (!Id) {
        console.error("No ID provided for deletion.");
        return;
      }

      await deleteAllSectors(Id);
      setDeleteAllModalOpen(false);
      router.push("/sector-setup");
    } catch (error) {
      console.error("Error deleting parent address and associates:", error);
    }
  };

  const handleEditClick = (row: Row) => {
    setEditRow(row);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }
  const columns = [
    {
      field: "sector",
      headerName: "Sector",
      flex: 1,
      renderCell: (params: any) => (
        <div className="flex py-3 gap-4 my-3 items-center">
          <div className="h-10 flex items-center justify-center">
            {params.value}
          </div>
        </div>
      ),
    },
    {
      field: "subSector",
      headerName: "Sub Sector",
      flex: 4,
      renderCell: (params: any) => (
        <div className="flex flex-col gap-2 my-2" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
          <p className="font-medium text-sm">{params.value}</p>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params: any) => (
        <div className="flex items-center justify-end">
          <button type="button" className="rounded-full " style={{ right: '-10px' }} onClick={() => handleEditClick(params.row)}>
            <EditIconSetup />
          </button>
          <button type="button" className="rounded-full" style={{ right: '-10px' }} onClick={() => { setEditRow(params.row); setDeleteModalOpen(true); }}>
            <DeleteIcon />
          </button>
        </div>
      ),
    },
  ];


  return (
    <div className="w-full p-5">
      <div className="w-full">
        <form className="flex flex-col gap-6"
          //  onSubmit={(e) => {
          //   e.preventDefault();
          //   onSubmitHandler(getValues())
          // }}
          style={{ display: "inline-flex", width: "100%" }}>
          <div className="w-full text-primary-dark flex justify-between">
            <div>
              <h3 className="font-semibold text-xl">Edit Setup</h3>
              <p className="text-black-400 text-sm">Edit parent sector and sub-sectors</p>
            </div>
            <div className="flex gap-3 items-center justify-end">
              <Link href="/sector-setup">
                <button
                  type="button"
                  className="button bg-gray-50 border border-gray-200 shadow-sm py-3 px-4 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                >
                  Go Back
                </button>
              </Link>
              {/* <button
                type="submit"
                className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
              >
                <IoIosAddCircleOutline size={20} />Save
              </button> */}
            </div>
          </div>
          <div className="mb-3 relative">
            <SelectCountryEdit
              label="Country"
              autoComplete="off"
              {...register("countryName")}
              value={watch("countryName")}
              error={errors.countryName?.message}
              options={[data?.countryName || ""]}
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
          <div>
            <h4 className="font-bold text-black-400">Sectors</h4>
          </div>
          <div className="flex flex-col items-start" style={{ width: '100%' }}>
            <div className="flex justify-between w-full mb-4">
              <div>
                <h4 className="font-bold text-black-400"></h4>
                <span style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
                  <p style={{ margin: 0, marginRight: '100px' }}></p>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDeleteAllModalOpen(true)}
                className="bg-primary-red disabled:bg-gray-400 flex text-white text-sm py-1.5 hover:opacity-95 items-center gap-2 rounded-xl ml-auto"
                style={{ minHeight: '2.5rem', height: '2.5em', lineHeight: '2.0rem', fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
              >
                <RiDeleteBin6Line size={20} />Delete all sectors
              </button>
            </div>
            <div className="w-full">
              <DataTable isLoading={isLoading} rows={rows} columns={columns} />
            </div>
          </div>
        </form>
      </div>
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title="Edit Values"
      >
        <div>
          <div className="px-7">
            <TextInput
              type="text"
              placeholder="Edit sector"
              autoComplete="off"
              value={editRow?.sector || ""}
              onChange={(e) => setEditRow(prevState => ({ ...prevState!, sector: e.target.value }))}
            />
          </div>
          <div className="px-7">
            <TextInput
              type="text"
              placeholder="Edit Subsectors"
              autoComplete="off"
              value={editRow?.subSector || ""}
              extraClasses="h-[90px]"
              onChange={(e) => setEditRow(prevState => ({ ...prevState!, subSector: e.target.value }))}
            />
          </div>

          <div className="p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
            <button
              className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-2xl"
              onClick={() => {
                setEditRow(null);
                setIsModalOpen(false);
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="bg-primary-green py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-2xl"
            >
              <IoIosAddCircleOutline size={20} /> Save
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        title="Are you sure you want delete this ?"
      >
        <div>
          <p className="px-5 text-center mt-5 text-[#334155]">
            Deleting this would delete all the values you have inputed
          </p>
          <p className="text-center text-[#334155]">
            under this
          </p>
          <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
            <button
              className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-2xl"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteRow(editRow)}
              className="bg-primary-red py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-2xl"
            >
              Yes, delete values
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={deleteAllModalOpen}
        setIsOpen={setDeleteAllModalOpen}
        title="Are you sure you want to delete all sectors"
      >
        <div>
          <p className="px-5 text-center mt-5 text-[#334155]">
            Deleting all sectors would delete all the sectors and sub-
          </p>
          <p className="text-center text-[#334155] mb-3">
            level values you have inputted.
          </p>
          <p className="text-center text-sm text-[#334155] mt-5">Type the phrase “delete all” to delete the sectors.</p>
          <div className="px-7">
            <TextInput
              type="text"
              autoComplete="off"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>

          <div className="p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
            <button
              onClick={() => setDeleteAllModalOpen(false)}
              className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-2xl"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAll}
              className={`py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-2xl ${inputValue === 'delete all' ? 'bg-primary-red' : 'bg-red-300'} ${inputValue !== 'delete all' ? 'cursor-not-allowed' : ''}`}
              disabled={inputValue !== 'delete all'}
            >
              Yes,delete all
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EditSector;
