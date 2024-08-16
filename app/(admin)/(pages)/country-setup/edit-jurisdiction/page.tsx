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
import {
  editParentSchemeChildEntriesByID,
  deleteParentAddressAndChildByID,
  deleteJurisdictionByID,
  createChildEntriesID,
} from "@/services/features/jurisdictionsService";
import SelectCountryEdit from "../components/selectCountryEdit";
import { RiDeleteBin6Line, RiArrowGoBackLine } from "react-icons/ri";
import { BsDot } from "react-icons/bs";
import { toast } from "sonner";
import { Button } from "@nextui-org/button";
import { LuPlusCircle } from "react-icons/lu";

const schema = yup.object().shape({
  id: yup.number().required(),
  name: yup.string().required(),
  childEntries: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().required(),
        name: yup.string().required(),
        parentAddressSchemeEntriesId: yup.number().required(),
      })
    )
    .required(),
});

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

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["all parentSchemeEntries", Id],
    queryFn: services.getJurisdictionEntriesById(Number(Id)),
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
      name: "",
      childEntries: [
        {
          id: 0,
          name: "",
          parentAddressSchemeEntriesId: 0,
        },
      ],
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("name", data.name);
      const formattedRows: Row[] = data.parentAddressScheme.entries.map(
        (entry: any, index: number) => ({
          id: entry.id,
          regions: entry.name,
          districts: entry.childEntries
            .map((childEntry: any) => childEntry.name)
            .join(", "),
        })
      );

      setRows(formattedRows);
    }
  }, [data, setValue]);

  const columns = [
    {
      field: "regions",
      headerName: data?.parentAddressScheme.name,
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 1,
      getActions: (params: any) => [
        <div className="flex py-3 gap-4 my-3 items-center" key={params.row.id}>
          <div className="h-10 flex items-center justify-center"></div>
          <div>
            <p className="font-medium"></p>
            {params.row.regions}
          </div>
        </div>,
      ],
    },
    {
      field: "sub level",
      headerName: "Sub Level",
      flex: 4,
      headerAlign: "left",
      align: "middle",
      type: "actions",
      getActions: (params: any) => [
        <div
          key={params.row.id}
          className="flex flex-col gap-2 my-2"
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
        <div className="flex items-center justify-end" key={params.row.id}>
          <button
            type="button"
            className="rounded-full "
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
    const rowIndex = rows.findIndex((row) => row.id === editRow.id);

    if (rowIndex === -1) {
      console.error("Row not found in rows array.");
      return;
    }
    const updatedRows = [...rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      regions: editRow.regions,
      districts: editRow.districts,
    };
    setRows(updatedRows);
    handleParentChildrenUpdate(editRow);
    setIsModalOpen(false);
  };

  const handleDeleteRow = async (row: Row | null) => {
    try {
      if (!row || !row.id) {
        console.error("No row selected for deletion or row ID is invalid.");
        return;
      }

      await deleteParentAddressAndChildByID(row.id);
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

      await deleteJurisdictionByID(Id);
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

    // UPDATE 1: FINDING ENTRIES USING ID NOT NAME
    // prevents undefinied error if name of region is changed
    const entry = data?.parentAddressScheme.entries.find(
      (entry: any) => entry.id === row.id
    );

    return {
      id: row.id,
      name: row.regions,
      childEntries: row.districts.split(", ").map((district: any, idx: any) => {
        if (entry) {
          // UPDATE 2: USING POSITION IN ARRAY TO FIND CHILDREN NOT NAMES
          const childEntry = entry.childEntries[idx];

          // HANLDE CASE OF EDITING EXISTING CHILDREN : ALREADY HAVE AN ID
          if (childEntry?.id) {
            return {
              id: childEntry.id,
              name: district.trim(),
              parentAddressSchemeEntriesId: row.id,
            };
          } else {
            // HANLDE CASE OF ADDING NEW CHILDREN : NO ID
            return {
              name: district.trim(),
              parentAddressSchemeEntriesId: row.id,
            };
          }
        }
      }),
    };
  };

  const handleParentChildrenUpdate = async (data: any) => {
    let loadingToast = toast.loading("Please wait...");
    //
    try {
      const payload = mapRowsToPayload(data);

      await editParentSchemeChildEntriesByID(payload.id, payload);

      toast.dismiss(loadingToast);
      toast.success(payload?.name + " updated");

      await refetch();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error updating. Please try again");
    }
  };

  const handleAddButton = () => {
   
  }

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
                {...register("name")}
                value={watch("name")}
                error={errors.name?.message}
                options={[data?.name || ""]}
                readOnly
                PrependIcon={
                  data?.name ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={Countrie(data.name)?.flags.png}
                        alt={Countrie(data.name)?.name.common}
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
                <h4 className="font-bold text-black-400">
                  {data?.parentAddressScheme.name}
                </h4>
                <span
                  style={{
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <BsDot size={30} />
                  <p style={{ margin: 0, marginRight: "100px" }}>
                    {data?.parentAddressScheme.inputType}
                  </p>
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-white border border-gray-200 py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center rounded-xl">
                  <LuPlusCircle />
                  Add new  {data?.parentAddressScheme.name}
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
            under this {data?.parentAddressScheme?.name}.
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
              value=""
            />
          </div>
          <div className="px-7">
            <TextInput
              type="text"
              placeholder="Add Districts"
              autoComplete="off"
              value=""
              extraClasses="h-[90px]"
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
    </div>
  );
}

export default EditJurisdiction;
