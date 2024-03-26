'use client'
import React, { useState } from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import EditIcon from "@/public/icons/EditIcon";
import "../new-individual/index.css";
import Countries, { Countrie } from "./Countries";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import { GrFormNextLink } from "react-icons/gr";
import UploadAreaInput from './UploadAreaInput';
import Modal from './Modal';
import Image from "next/image";
import { AiOutlineDelete } from 'react-icons/ai';
import { IoCloseCircleOutline } from "react-icons/io5";
import FormatByte from "./FormatByte";
import RadioInput from './RadioInput';
import ExcelIcon from "@/public/icons/ExcelIcon";
import Link from 'next/link';

function JurisdictionSetupForm({ setPage }: any) {

    const [loading, setLoading] = useState(false);
    const [nationality, setNationality] = useState("");
    const [showTextInput, setShowTextInput] = useState(false);
    const [textshow, setTextshow] = useState(false);
    const [showregionModal, setShowRegionModal] = useState(false);
    const [showtownModal, setShowTownModal] = useState(false);
    const [showcityModal, setShowCityModal] = useState(false);
    const [showstreetModal, setShowStreetModal] = useState(false);
    const [IDImage, setIDImage] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [fileName, setFileName] = useState<any>({ 'name': '', 'size': '' })

    const handleDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const acceptedExtensions = [".csv", ".xls", ".xlsx"];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

        setFileName({ name: file.name, size: file.size })

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

    const toggleTextInput = (status: boolean) => {
        setShowTextInput((prevState) => status);
    };

    const ShowInput = () => {
        setTextshow((prevState) => !prevState);
    };


    return (
        <div>
            <div className="mt-10 w-full">
                <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="w-full text-primary-dark flex justify-between">
                        <div>
                            <h3 className="font-semibold text-xl">Country / Jurisdiction Setup</h3>
                            <p className="text-black-400 text-sm">configure all jurisdiction for the company</p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <Link href="/jurisdiction-setup/">
                                <button
                                    type="button"
                                    className="button bg-gray-50 border border-gray-200 shadow-sm py-3 px-4 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                                >
                                    Cancel
                                </button>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setPage("currency")}
                                className="button bg-primary-green disabled:bg-gray-400 py-3 px-4 flex text-white text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                            >
                                Next<GrFormNextLink size={24} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="mb-3 relative">
                            <SelectInput
                                listdata={Countries()}
                                label="Country"
                                onChange={(e) => setNationality(e.target.value)}
                                autoComplete="off"
                                PrependIcon={
                                    <span className="absolute left-0 top-2 bottom-0 flex items-center pl-2">
                                        <img
                                            src={Countrie(nationality)?.flags.png}
                                            alt={Countrie(nationality)?.name.common}
                                            style={{ height: "auto", width: "30px" }}
                                        />
                                    </span>
                                }
                                style={{ width: "30%", height: "30%" }}
                            />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-black-400">Addressing Scheme</h4>
                        <p className="text-black-400 text-sm">Setup administrator of this company</p>
                    </div>
                    <div>
                        <label className="block mb-2 text-xs font-bold text-black-400" htmlFor="input">
                            Sub-levels
                        </label>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="regions"
                                    name="sub-level"
                                    value="Regions"
                                    className="mr-2 styled-checkbox"
                                />
                                <label htmlFor="regions" className="border-b mb-1 pb-1" style={{ width: "30%" }}>
                                    Regions
                                </label>
                                <button
                                    onClick={() => setShowRegionModal(true)}
                                    className="rounded-full"
                                >
                                    <EditIcon />
                                </button>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="cities"
                                    name="sub-level"
                                    value="Cities"
                                    className="mr-2 styled-checkbox"
                                />
                                <label htmlFor="cities" className="border-b mb-1 pb-1" style={{ width: "30%" }}>
                                    Cities
                                </label>
                                <button
                                    onClick={() => setShowCityModal(true)}
                                    className="rounded-full"
                                >
                                    <EditIcon />
                                </button>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="towns"
                                    name="sub-level"
                                    value="Towns"
                                    className="mr-2 styled-checkbox"
                                />
                                <label htmlFor="towns" className="border-b mb-1 pb-1" style={{ width: "30%" }}>
                                    Towns
                                </label>
                                <button
                                    onClick={() => setShowTownModal(true)}
                                    className="rounded-full"
                                >
                                    <EditIcon />
                                </button>
                            </div>
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    id="streets"
                                    name="sub-level"
                                    value="Streets"
                                    className="mr-2 styled-checkbox"
                                />
                                <label htmlFor="streets" className="border-b mb-1 pb-1" style={{ width: "30%" }}>
                                    Streets
                                </label>
                                <button
                                    onClick={() => setShowStreetModal(true)}
                                    className="rounded-full"
                                >
                                    <EditIcon />
                                </button>
                            </div>
                        </div>
                        {textshow && (
                            <div className="mb-3 relative">
                                <TextInput
                                    type="text"
                                    placeholder=""
                                    autoComplete="off"
                                    className="rounded xl"
                                    style={{ width: "33%" }}
                                />
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={ShowInput}
                            className="bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100"
                            style={{ width: "33%" }}
                        >
                            <IoIosAddCircleOutline />
                            Add Sub-level
                        </button>
                    </div>
                </form>
            </div>

            <Modal
                isOpen={showregionModal}
                setIsOpen={setShowRegionModal}
                title="Regions"
            >
                <div className="p-3 flex-col items-center">
                    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                        {showTextInput && (
                            <div className=" relative">
                                <TextInput
                                    label='Number of Regions'
                                    type="text"
                                    placeholder="16"
                                    autoComplete="off"
                                    className="rounded xl"
                                    readOnly
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs text-black-400">
                                Sub-level Type
                            </label>
                            <div className="">
                                <RadioInput
                                    name="slType"
                                    label='Drop down list'
                                    type="radio"
                                    placeholder=""
                                    autoComplete="off"
                                    className="rounded xl"
                                    value={0}
                                    onClick={() => toggleTextInput(true)}
                                    style={{ width: "20px" }}
                                />
                            </div>
                            <div className="">
                                <RadioInput
                                    name="slType"
                                    label='Input Field(Free-form)'
                                    type="radio"
                                    placeholder=""
                                    autoComplete="off"
                                    className="rounded xl"
                                    value={1}
                                    onClick={() => toggleTextInput(false)}
                                    style={{ width: "20px" }}
                                />
                            </div>
                            {showTextInput && (
                                <div className=" relative">
                                    <TextInput
                                        label='Regions'
                                        type="text"
                                        placeholder="Central Region,Ashanti Region,Greater Accra,Western Region,Oti Region"
                                        autoComplete="off"
                                        className="rounded xl"
                                    />
                                </div>
                            )}
                        </div>
                        {showTextInput && (
                            <div className="w-full h-[300px]">
                                {IDImage ? (
                                    <div className="border relative border-dashed border-grey-500 max-w-[400px] min-h-[50px] rounded-2xl cursor-pointer hover:border-grey-800 flex flex-col justify-center p-4">
                                        <Image
                                            src={URL.createObjectURL(IDImage)}
                                            alt="profile"
                                            width={280}
                                            height={224}
                                            className="rounded-md h-full w-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <button
                                                className="bg-red-200 hover:bg-red-500 rounded-full p-1"
                                                onClick={() => setIDImage(null)}
                                            >
                                                <AiOutlineDelete className="h-5 w-5 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <UploadAreaInput
                                        onDrop={handleDrop}
                                        label="Drag and drop or choose a file to upload"
                                    />
                                )}
                                {uploadProgress > 0 && (
                                    <div className="px-5 py-5 pb-5 mt-1 border border-dashed border-grey-500 max-w-[540px] min-h-[70px] rounded-2xl cursor-pointer hover:border-grey-800 flex flex-col justify-center p-4 bg-gray-100">
                                        <div className="relative">
                                            <div className="flex flex-row">
                                                <ExcelIcon />
                                                <div>
                                                    <div className="font-semibold">&nbsp;&nbsp;{fileName?.name}</div>
                                                    <div>{FormatByte(fileName?.size)}</div>
                                                </div>
                                            </div>
                                            <div className="w-auto h-3 bg-white rounded-full relative">
                                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                                            </div>
                                            <div className="absolute top-0 right-0 mb-20">
                                                <button
                                                    className="rounded-full"
                                                    onClick={() => setUploadProgress(0)}
                                                >
                                                    <IoCloseCircleOutline className="h-5 w-10" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex justify-between w-full">
                            <div className="flex justify-between w-full mt-10">
                                <div className="flex justify-between w-full mt-10 relative">
                                    <button
                                        onClick={() => setShowRegionModal(false)}
                                        className="text-gray-700 px-4 py-2 rounded-2xl hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-primary-green text-white px-4 py-2 rounded-2xl"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
            <Modal
                isOpen={showtownModal}
                setIsOpen={setShowTownModal}
                title="Towns"
            >
                <div className="p-3 flex-col items-center">
                    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-xs text-black-400">
                                Sub-level Type
                            </label>
                            <div className="">
                                <RadioInput
                                    name="slType"
                                    label='Input Field(Free-form)'
                                    type="radio"
                                    placeholder=""
                                    autoComplete="off"
                                    className="rounded xl"
                                    style={{ width: "20px" }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="flex justify-between w-full">
                                <div className="flex justify-between w-full mt-10 relative">
                                    <button
                                        onClick={() => setShowTownModal(false)}
                                        className="text-gray-700 px-4 py-2 rounded-2xl hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-primary-green text-white px-4 py-2 rounded-2xl"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
            <Modal
                isOpen={showcityModal}
                setIsOpen={setShowCityModal}
                title="Cities"
            >
                <div className="p-3 flex-col items-center">
                    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-xs text-black-400">
                                Sub-level Type
                            </label>
                            <div className="">
                                <RadioInput
                                    name="slType"
                                    label='Input Field(Free-form)'
                                    type="radio"
                                    placeholder=""
                                    autoComplete="off"
                                    className="rounded xl"
                                    style={{ width: "20px" }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="flex justify-between w-full">
                                <div className="flex justify-between w-full mt-10 relative">
                                    <button
                                        onClick={() => setShowCityModal(false)}
                                        className="text-gray-700 px-4 py-2 rounded-2xl hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-primary-green text-white px-4 py-2 rounded-2xl"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
            <Modal
                isOpen={showstreetModal}
                setIsOpen={setShowStreetModal}
                title="Streets"
            >
                <div className="p-3 flex-col items-center">
                    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-xs text-black-400">
                                Sub-level Type
                            </label>
                            <div className="">
                                <RadioInput
                                    name="slType"
                                    label='Input Field(Free-form)'
                                    type="radio"
                                    placeholder=""
                                    autoComplete="off"
                                    className="rounded xl"
                                    style={{ width: "20px" }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="flex justify-between w-full">
                                <div className="flex justify-between w-full mt-10 relative">
                                    <button
                                        onClick={() => setShowStreetModal(false)}
                                        className="text-gray-700 px-4 py-2 rounded-2xl hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-primary-green text-white px-4 py-2 rounded-2xl"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    )
}

export default JurisdictionSetupForm;