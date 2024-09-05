"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { IoIosAddCircleOutline } from "react-icons/io";
import Link from "next/link";
import services from "@/services";
import TextInput from "../components/TextInput";
import Modal from "@/components/Modal/Modal";
import { useQuery } from "@tanstack/react-query";
import { Countrie } from "../components/Countries";
import DataTable from "@/components/DataTable/DataTable";
import DeleteIcon from "@/public/icons/DeleteIcon";
import EditIconSetup from "@/public/icons/EditIconSetup";
import { useRouter } from "next/navigation";
import SelectCountryEdit from "../components/selectCountryEdit";
import { RiDeleteBin6Line, RiArrowGoBackLine } from "react-icons/ri";
import { BsDot } from "react-icons/bs";
import { toast } from "sonner";
import { Button } from "@nextui-org/button";
import { LuPlusCircle } from "react-icons/lu";
import { deletecountryWithAssoc, deleteparentLevel, updateCountry } from "@/services/features/jurisdictionsService";
import toJoin from "@/utils/UnderScoreJoin/underScoreJoin";

const schema = yup.object({
  id: yup.number().required(),
  countryName: yup.string().required(),
  countryId: yup.number().required(),
  inputType: yup.string().required(),
  addressingScheme: yup.object({
    id: yup.number().required(),
    parentLevelName: yup.string().required(),
    childLevelName: yup.string().required(),
    parentLevels: yup.array().of(
      yup.object({
        id: yup.number().required(),
        parentName: yup.string().required(),
        childLevels: yup.array().of(yup.string()).required(),
      })
    ).required(),
  }).required(),
});

type ParentLevel = {
  id: number;
  parentName: string;
  childLevels: string[];
};

type AddressingScheme = {
  id: number;
  parentLevelName: string;
  childLevelName: string;
  parentLevels: ParentLevel[];
};

type CountryData = {
  id: number;
  countryName: string;
  countryId: number;
  inputType: string;
  addressingScheme: AddressingScheme;
};

type Row = {
  id: number;
  regions: string;
  districts: string;
};

function EditJurisdiction() {
  type typeOfSchema = yup.InferType<typeof schema>;
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const searchParams = useSearchParams();
  const Id = searchParams.get("id");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [region, setRegion] = useState("");
  const [districts, setDistricts] = useState("")

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["all countries", Id],
    queryFn: services.getJurisdictionById(Number(Id)),
    enabled: !!Id,
  });
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm<typeOfSchema>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: 0,
      countryName: "",
      countryId: 0,
      inputType: "DROP_DOWN",
      addressingScheme: {
        id: 0,
        parentLevelName: "",
        childLevelName: "",
        parentLevels: [
          {
            id: 0,
            parentName: "",
            childLevels: [],
          }
        ]
      }
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("countryName", data.countryName);

      const formattedRows: Row[] = data.addressingScheme.parentLevels.map(
        (parentLevel: any) => ({
          id: parentLevel.id,
          regions: parentLevel.parentName,
          districts: parentLevel.childLevels.join(", "),
        })
      );

      setRows(formattedRows);
    }
  }, [data, setValue]);



  const columns = [
    {
      field: "regions",
      headerName: data?.addressingScheme.parentLevelName,
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 1,
      getActions: (params: any) => [
        <div className="flex py-3 gap-4 my-3 items-center" key={params.row.id}>
          <div className="h-10 flex items-center justify-center overflow-y-auto max-h-20"></div>
          <div className="overflow-y-auto max-h-20">
            <p className="font-medium">{params.row.regions}</p>
          </div>
        </div>,
      ],
    },
    {
      field: "districts",
      headerName: data?.addressingScheme.childLevelName,
      flex: 4,
      headerAlign: "left",
      align: "middle",
      type: "actions",
      getActions: (params: any) => [
        <div
          key={params.row.id}
          className="flex flex-col gap-2 my-2 overflow-y-auto max-h-20"
          style={{ whiteSpace: "normal", wordBreak: "break-word" }}
        >
          <p className="font-medium text-sm">{params.row.districts}</p>
        </div>,
      ],
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div className="flex items-center justify-end overflow-y-auto max-h-20" key={params.row.id}>
          <button
            type="button"
            className="rounded-full"
            style={{ right: "-10px" }}
            onClick={() => handleEditClick(params.row)}
          >
            <EditIconSetup />
          </button>
          <button
            type="button"
            className="rounded-full"
            style={{ right: "-10px" }}
            onClick={() => {
              setEditRow(params.row);
              setDeleteModalOpen(true);
            }}
          >
            <DeleteIcon />
          </button>
        </div>,
      ],
    },
  ];


  const handleSaveEdit = () => {
    if (!editRow) return;

    // Find the index of the parent level to be updated
    const rowIndex = rows.findIndex((row) => row.id === editRow.id);
    if (rowIndex === -1) {
      console.error("Row not found in rows array.");
      return;
    }

    // Update the rows array with new values
    const updatedRows = [...rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      regions: editRow.regions, // Update parentName
      districts: editRow.districts, // Update childLevels
    };

    setRows(updatedRows);

    // Update the parent and child entries
    handleParentChildrenUpdate(updatedRows[rowIndex]);

    setIsModalOpen(false);
  };


  const handleDeleteRow = async (row: Row | null) => {
    try {
      if (!row || !row.id) {
        console.error("No row selected for deletion or row ID is invalid.");
        return;
      }

      await deleteparentLevel(row.id);
      setDeleteModalOpen(false);
      await refetch();
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      if (!Id) {
        console.error("No ID provided for deletion.");
        return;
      }

      await deletecountryWithAssoc(Id);
      setDeleteAllModalOpen(false);
      router.push("/country-setup");
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
  };

  const mapRowsToPayload = (updatedRow: any) => {
    const row = updatedRow ? updatedRow : rows[0];
    const existingParentLevels = data?.addressingScheme?.parentLevels || [];

    return {
      id: data.id, // Use the existing country ID
      countryName: data.countryName,
      countryId: data.countryId,
      inputType: data.inputType,
      addressingScheme: {
        id: data.addressingScheme.id,
        parentLevelName: data.addressingScheme.parentLevelName,
        childLevelName: data.addressingScheme.childLevelName,
        parentLevels: existingParentLevels.map((level: ParentLevel) =>
          level.id === row.id
            ? {
              ...level,
              parentName: row.regions, // Update parentName
              childLevels: row.districts.split(',').map((d: string) => d.trim()) // Update childLevels
            }
            : level
        ),
      },
    };
  };

  const handleParentChildrenUpdate = async (data: any) => {
    let loadingToast = toast.loading("Please wait...");

    try {
      const payload = mapRowsToPayload(data);

      const response = await updateCountry(payload);

      if (response.status === 200 || response.status === 201) {
        toast.dismiss(loadingToast);
        toast.success(`${data.regions} updated`);

        await refetch();
      } else {
        toast.dismiss(loadingToast);
        toast.error(`Failed to update: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error updating. Please try again");
    }
  };




  const handleAddButton = async () => {
    let loadingToast = toast.loading("Please wait...");

    const existingParentLevels: ParentLevel[] = data?.addressingScheme?.parentLevels || [];

    const newParentLevelId = existingParentLevels.length
      ? Math.max(...existingParentLevels.map((p: ParentLevel) => p.id)) + 1
      : 1;

    const payload = {
      id: data.id, // Use the existing country ID
      countryName: data.countryName,
      countryId: data.countryId,
      inputType: data.inputType,
      addressingScheme: {
        id: data.addressingScheme.id,
        parentLevelName: data.addressingScheme.parentLevelName,
        childLevelName: data.addressingScheme.childLevelName,
        parentLevels: [
          ...existingParentLevels,
          {
            id: newParentLevelId,
            parentName: region,
            childLevels: districts.split(',').map(d => d.trim()) // Convert districts to array
          }
        ]
      }
    };

    try {
      const response = await updateCountry(payload);

      if (response.status === 200 || response.status === 201) {
        toast.dismiss(loadingToast);
        toast.success("New Region added");

        await refetch();

        setIsAddModalOpen(false);
        setRegion("");
        setDistricts("");
      } else {
        toast.dismiss(loadingToast);
        toast.error(`Failed to create child entries: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("An error occurred");
    }
  };


  return (
    <div className="w-full p-5">
      <div className="w-full">
        <form
          className="flex flex-col gap-6"
          style={{ display: "inline-flex", width: "100%" }}
        >
          <div className="w-full text-primary-dark flex justify-between">
            <div>
              <h3 className="font-semibold text-xl">
                Country / Jurisdiction Setup
              </h3>
              <p className="text-black-400 text-sm">
                Configure all jurisdiction for the company
              </p>
            </div>
            <div className="flex gap-3 items-center justify-end">
              <Link href="/country-setup">
                <button
                  type="button"
                  className="button bg-gray-50 border border-gray-200 shadow-sm py-3 px-4 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                >
                  <RiArrowGoBackLine />Go back
                </button>
              </Link>
              {/* <button
                type="submit"
                className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
              >
                <IoIosAddCircleOutline size={20} />
                Save
              </button> */}
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
                options={[data?.countryName || ""]}
                readOnly
                PrependIcon={
                  data?.countryName ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={Countrie(data.countryName)?.flags.png}
                        alt={Countrie(data.countryName)?.name.common}
                        style={{
                          height: "auto",
                          width: "30px",
                          marginRight: "10px",
                        }}
                      />
                    </div>
                  ) : null
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
          <div className="flex flex-col items-start" style={{ width: "100%" }}>
            <div className="flex justify-between w-full mb-4">
              <div>
                <span
                  style={{
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <BsDot size={30} />
                  <p style={{ margin: 0, marginRight: "100px" }}>
                    <strong>{data?.addressingScheme.parentLevelName}</strong>
                    &nbsp; &nbsp;|&nbsp;&nbsp;
                    <strong>{data?.addressingScheme.childLevelName}</strong>
                    <p>{toJoin(data?.inputType)}</p>
                  </p>
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-white border border-gray-200 py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center rounded-xl">
                  <LuPlusCircle />
                  Add new {data?.addressingScheme.parentLevelName}
                </Button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteAllModalOpen(true)}
                    className="bg-primary-red disabled:bg-gray-400 flex text-white text-sm py-1.5 hover:opacity-95 items-center gap-2 rounded-xl ml-auto"
                    style={{
                      minHeight: "2.5rem",
                      height: "2.5em",
                      lineHeight: "2.0rem",
                      fontSize: "0.875rem",
                      padding: "0.25rem 0.5rem",
                    }}
                  >
                    <RiDeleteBin6Line size={20} />
                    Delete Setup &nbsp;&nbsp;
                  </button>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                margin: "10px 0",
              }}
            >
              <div  style={{ flex: 1, borderBottom: "1px solid lightgray",marginBottom:"20px",marginTop:"15px" }}  >
              </div>
            </div>
            <div className="w-full">
              <DataTable isLoading={isLoading} rows={rows} columns={columns} />
            </div>
          </div>
        </form>
      </div>
      {/* EDIT SINGLE JURISDICTION */}
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title="Edit Values"
      >
        <div>
          <div className="px-7">
            <TextInput
              type="text"
              placeholder="Edit Regions"
              autoComplete="off"
              value={editRow?.regions || ""}
              onChange={(e) =>
                setEditRow((prevState) => ({
                  ...prevState!,
                  regions: e.target.value,
                }))
              }
            />
          </div>
          <div className="px-7">
            <TextInput
              type="text"
              placeholder="Edit Districts"
              autoComplete="off"
              value={editRow?.districts || ""}
              extraClasses="h-[90px]"
              onChange={(e) =>
                setEditRow((prevState) => ({
                  ...prevState!,
                  districts: e.target.value,
                }))
              }
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
      {/* DELETE CONFIRMATION */}
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
            under this {data?.addressingScheme.parentLevelName}.
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

      {/* DELETE ALL VALUES MODAL */}
      <Modal
        isOpen={deleteAllModalOpen}
        setIsOpen={setDeleteAllModalOpen}
        title="Are you sure you want to delete all values"
      >
        <div>
          <p className="px-5 text-center mt-5 text-[#334155]">
            Deleting the setup will delete all set regions and
          </p>
          <p className="text-center text-[#334155] mb-3">
            sub-level values you have inputted.This action cannot be undone.
          </p>
          <p className="text-center text-sm text-[#334155] mt-5">
            Type the phrase “delete all” to delete the{" "}
            setup.
          </p>
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
              className={`py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-2xl ${inputValue === "delete all" ? "bg-primary-red" : "bg-red-300"
                } ${inputValue !== "delete all" ? "cursor-not-allowed" : ""}`}
              disabled={inputValue !== "delete all"}
            >
              Yes,delete all
            </button>
          </div>
        </div>
      </Modal>
      {/* ADD NEW VALUES MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        title="Add Values"
      >
        <div>
          <div className="px-7">
            <TextInput
              type="text"
              placeholder="Add Region"
              autoComplete="off"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>
          <div className="px-7">
            <TextInput
              type="text"
              placeholder="Add Districts"
              autoComplete="off"
              value={districts}
              extraClasses="h-[90px]"
              onChange={(e) => setDistricts(e.target.value)}
            />
          </div>

          <div className="p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
            <button
              className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-2xl"
              onClick={() => {
                setIsAddModalOpen(false);
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddButton}
              className="bg-primary-green py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-2xl"
            >
              <IoIosAddCircleOutline size={20} /> Save
            </button>
          </div>
        </div>
      </Modal>
    </div >
  );
}

export default EditJurisdiction;
