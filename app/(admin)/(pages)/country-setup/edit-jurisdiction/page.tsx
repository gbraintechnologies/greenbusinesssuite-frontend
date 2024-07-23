'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { IoIosAddCircleOutline } from 'react-icons/io';
import Link from 'next/link';
import services from "@/services";
import TextInput from "../components/TextInput";
import Modal from "@/components/Modal/Modal";
import { useQuery } from "@tanstack/react-query";
import { Countrie } from "../components/Countries";
import DataTable from "@/components/DataTable/DataTable";
import DeleteIcon from "@/public/icons/DeleteIcon";
import EditIconSetup from "@/public/icons/EditIconSetup";
import { useRouter } from "next/navigation";
import { editParentSchemeChildEntriesByID, deleteParentAddressAndChildByID, deleteJurisdictionByID } from "@/services/features/jurisdictionsService";
import SelectCountryEdit from '../components/selectCountryEdit';
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsDot } from "react-icons/bs";
import toast from 'react-hot-toast';


const schema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    childEntries: yup.array().of(
        yup.object().shape({
            id: yup.number().required(),
            name: yup.string().required(),
            parentAddressSchemeEntriesId: yup.number().required(),
        })
    ).required(),
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
    const Id = searchParams.get('id');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
    const [editRow, setEditRow] = useState<Row | null>(null);
    const [inputValue, setInputValue] = useState('');


    const { data, isLoading, refetch } = useQuery({
        queryKey: ["all parentSchemeEntries", Id],
        queryFn: services.getJurisdictionEntriesById(Number(Id)),
        enabled: !!Id,
    });

    const { register, handleSubmit, setValue, getValues, formState: { errors }, watch } = useForm<typeOfSchema>({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            id: 0,
            name: '',
            childEntries: [
                {
                    id: 0,
                    name: '',
                    parentAddressSchemeEntriesId: 0,
                },
            ],
        }
    });

    useEffect(() => {
      // alert(JSON.stringify(data))
        if (data) {
            setValue("id", data.id);
            setValue("name", data.name);
            const formattedRows: Row[] = data.parentAddressScheme.entries.map((entry: any, index: number) => ({
                id: entry.id,
                regions: entry.name,
                districts: entry.childEntries.map((childEntry: any) => childEntry.name).join(", ")
            }));

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
                        <p className="font-medium"></p>{params.row.regions}
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
                <div key={params.row.id} className="flex flex-col gap-2 my-2" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
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
                    <button type="button" className="rounded-full " style={{ right: '-10px' }} onClick={() => handleEditClick(params.row)}>
                        <EditIconSetup />
                    </button>
                    <button type="button" className="rounded-full" style={{ right: '-10px' }} onClick={() => { setEditRow(params.row); setDeleteModalOpen(true); }}>
                        <DeleteIcon />
                    </button>
                </div>
            ],
        },
    ];

    const handleSaveEdit = () => {
        if (!editRow) return;
        const rowIndex = rows.findIndex(row => row.id === editRow.id);

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
        console.log(updatedRows)
        setRows(updatedRows);
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
    }

    const mapRowsToPayload = () => {
        const row = rows[0];
    
        // Find the corresponding entry in the initial data
        const entry = data?.parentAddressScheme.entries.find((entry: any) => entry.name === row.regions);
    
        return {
            id: row.id,
            name: row.regions,
            childEntries: row.districts.split(", ").map((district) => {
                const trimmedDistrict = district.trim();
                console.log('trimmed district',trimmedDistrict)
    
                // Find the corresponding child entry in the initial data
                let childEntryId = 0;
                if (entry) {
                    console.log("entry",entry)
                    const childEntry = entry.childEntries.find((child: any) => child.name === trimmedDistrict);
                    console.log("childEntry",childEntry)
                    if (childEntry) {
                        childEntryId = childEntry.id;
                    }
                }
    
                return {
                    id: childEntryId,
                    name: trimmedDistrict,
                    parentAddressSchemeEntriesId: row.id,
                };
            }),
        };
    };
    
    
    
        const onSubmitHandler = async (formData: typeOfSchema) => {
            try {
                const payload = mapRowsToPayload();
    
               // alert(JSON.stringify(payload))
    
                await editParentSchemeChildEntriesByID(payload.id, payload);
    
                toast.success("Edited Successfully", {
                    position: "top-center",
                    duration: 3000,
                    style: {
                        color: "green",
                    },
                });
                 router.push("/country-setup");
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        };
    


    return (
        <div className="w-full p-5">
            <div className="w-full">
                <form className="flex flex-col gap-6" onSubmit={(e) => {
                    e.preventDefault();
                    onSubmitHandler(getValues())
                }} style={{ display: "inline-flex", width: "100%" }}>
                    <div className="w-full text-primary-dark flex justify-between">
                        <div>
                            <h3 className="font-semibold text-xl">Country / Jurisdiction Setup</h3>
                            <p className="text-black-400 text-sm">configure all jurisdiction for the company</p>
                        </div>
                        <div className="flex gap-3 items-center justify-end">
                            <Link href="/country-setup">
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
                                <IoIosAddCircleOutline size={20} />Save
                            </button>
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
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                                src={Countrie(data.name)?.flags.png}
                                                alt={Countrie(data.name)?.name.common}
                                                style={{ height: 'auto', width: '30px', marginRight: '10px' }}
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
                        <p className="text-black-400 text-sm">Setup all Parent and Child sub-levels for the Country</p>
                    </div>
                    <div className="flex flex-col items-start" style={{ width: '100%' }}>
                        <div className="flex justify-between w-full mb-4">
                            <div>
                                <h4 className="font-bold text-black-400">{data?.parentAddressScheme.name}</h4>
                                <span style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
                                    <BsDot size={30} />
                                    <p style={{ margin: 0, marginRight: '100px' }}>{data?.parentAddressScheme.inputType}</p>
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDeleteAllModalOpen(true)}
                                className="bg-primary-red disabled:bg-gray-400 flex text-white text-sm py-1.5 hover:opacity-95 items-center gap-2 rounded-xl ml-auto"
                                style={{ minHeight: '2.5rem', height: '2.5em', lineHeight: '2.0rem', fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                            >
                                <RiDeleteBin6Line size={20} />Delete all {data?.parentAddressScheme.name}
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
                            placeholder="Edit Regions"
                            autoComplete="off"
                            value={editRow?.regions || ""}
                            onChange={(e) => setEditRow(prevState => ({ ...prevState!, regions: e.target.value }))}
                        />
                    </div>
                    <div className="px-7">
                        <TextInput
                            type="text"
                            placeholder="Edit Districts"
                            autoComplete="off"
                            value={editRow?.districts || ""}
                            extraClasses="h-[90px]"
                            onChange={(e) => setEditRow(prevState => ({ ...prevState!, districts: e.target.value }))}
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
                        under this {data?.parentAddressScheme.name}.
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
                title="Are you sure you want to delete all values"
            >
                <div>
                    <p className="px-5 text-center mt-5 text-[#334155]">
                        Deleting all {data?.parentAddressScheme.name} would delete all the {data?.parentAddressScheme.name} and sub-
                    </p>
                    <p className="text-center text-[#334155] mb-3">
                        level values you have inputted.
                    </p>
                    <p className="text-center text-sm text-[#334155] mt-5">Type the phrase “delete all” to delete the {data?.parentAddressScheme.name}.</p>
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
    )
}

export default EditJurisdiction;
