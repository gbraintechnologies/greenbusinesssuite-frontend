'use client'
import React, { ChangeEvent, useState } from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import EditIcon from "@/public/icons/EditIcon";
import "../index.css"
import Countries, { Countrie } from "../components/Countries";
import SelectInput from "../components/SelectInput";
import TextInput from "../components/TextInput";
import UploadAreaInput from '../components/UploadAreaInput';
import Modal from '../components/Modal';
import Image from "next/image";
import { AiOutlineDelete } from 'react-icons/ai';
import { IoCloseCircleOutline } from "react-icons/io5";
import FormatByte from "../components/FormatByte";
import RadioInput from '../components/RadioInput';
import ExcelIcon from "@/public/icons/ExcelIcon";
import Link from 'next/link';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { GoDotFill } from "react-icons/go";
import { FaArrowsToDot } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { createJurisdictions, createAddressScheme, createAddressLevel } from "@/services/features/jurisdictionsService";


const schema = yup.object({
    jurisdictions_id: yup
        .number(),
    jurisdiction_name: yup
        .string(),
    jurisdiction_symbol: yup
        .string(),
    name_of_currency: yup
        .string(),
    currency_code: yup
        .string()
});


interface Level {
    label: string;
    code: string;
    level_order: number;
    value_type: string;
    address_scheme_id: number;
    options_values: string[];
}

function NewIndividual() {

    type typeOfSchema = yup.InferType<typeof schema>;
    const [loading, setLoading] = useState(false);
    const [showTextInput, setShowTextInput] = useState(false);
    const [showregionModal, setShowRegionModal] = useState(false);
    const [showtownModal, setShowTownModal] = useState(false);
    const [showcityModal, setShowCityModal] = useState(false);
    const [showstreetModal, setShowStreetModal] = useState(false);
    const [IDImage, setIDImage] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [fileName, setFileName] = useState<any>({ 'name': '', 'size': '' })
    const [parentlevels, setParentLevels] = useState<Level[]>([]);
    const [parentlevel, setParentLevel] = useState({
        "label": "",
        "code": "",
        "level_order": 0,
        "value_type": "",
        "address_scheme_id": 0,
        "options_values": []
    });
    const [childlevels, setChildLevels] = useState<Level[]>([]);
    const [childlevel, setChildLevel] = useState({
        "label": "",
        "code": "",
        "level_order": 0,
        "value_type": "",
        "address_scheme_id": 0,
        "options_values": []
    });
    const [showParentInput, setShowParentInput] = useState<boolean>(false);
    const [showChildInput, setShowChildInput] = useState<boolean>(false);
    const { register, handleSubmit, formState: { isSubmitting, errors, dirtyFields }, getValues } = useForm<typeOfSchema>({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            jurisdictions_id: 0,
            jurisdiction_name: "",
            jurisdiction_symbol: "",
            name_of_currency: "",
            currency_code: ""
        },
    });

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
        setShowParentInput((prevState) => status);
    };

    const handleAddParentLevel = () => {
        setParentLevels(prevLevels => [...prevLevels, { ...parentlevel }]);

        setParentLevel({
            label: "",
            code: "",
            level_order: 0,
            value_type: "",
            address_scheme_id: 0,
            options_values: []
        });

        setShowParentInput(false);
    };

    const handleAddChildLevel = () => {
        setChildLevels(prevLevels => [...prevLevels, { ...childlevel }]);

        setChildLevel({
            label: "",
            code: "",
            level_order: 0,
            value_type: "",
            address_scheme_id: 0,
            options_values: []
        });

        setShowChildInput(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setParentLevel(prevState => ({ ...prevState, [name]: value }));
    };

    const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setChildLevel(prevState => ({ ...prevState, [name]: value }));
    };

    const onSubmit = async (data: typeOfSchema) => {
        try {
            // Create jurisdiction
            const jurisdictionResponse = await createJurisdictions({
                jurisdiction_name: data.jurisdiction_name,
                jurisdiction_symbol: data.jurisdiction_symbol,
                name_of_currency: data.name_of_currency,
                currency_code: data.currency_code,
            });
            //  alert(JSON.stringify(jurisdictionResponse))
            const jurisdictionId = jurisdictionResponse.data.id;

            // Create address scheme
            const addressSchemePayload = {
                jurisdiction_id: jurisdictionId,
            };
            const addressSchemeResponse = await createAddressScheme(addressSchemePayload);
            // alert(JSON.stringify(addressSchemeResponse))
            const addressSchemeId = addressSchemeResponse.data.jurisdiction_id;

            // Use the created address scheme's id in the addressLevelPayload
            parentlevels.map(async (level) => {
                level.address_scheme_id = addressSchemeId;

                await createAddressLevel(level);

            });


        } catch (error: any) {
            console.error('Error occurred:', error);
            alert(error.message);
        }
    };

    return (
        <div className='w-full p-5'>
            <div className="w-full">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full text-primary-dark flex justify-between">
                        <div>
                            <h3 className="font-semibold text-xl">Country / Jurisdiction Setup</h3>
                            <p className="text-black-400 text-sm">configure all jurisdiction for the company</p>
                        </div>
                        <div className="flex gap-3 items-center">
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
                                disabled={isSubmitting || !dirtyFields.jurisdiction_name}
                                onClick={handleSubmit(onSubmit)}
                                className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                            >
                                <IoIosAddCircleOutline size={20} />Save
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="mb-3 relative">
                            <SelectInput
                                listdata={Countries()}
                                label="Country"
                                autoComplete="off"
                                {...register("jurisdiction_name")}
                                error={errors.jurisdiction_name?.message}
                                PrependIcon={
                                    <span className="absolute left-0 top-2 bottom-0 flex items-center pl-2">
                                        <img
                                            src={Countrie(getValues("jurisdiction_name") ?? '')?.flags.png}
                                            alt={Countrie(getValues("jurisdiction_name") ?? '')?.name.common}
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
                        <p className="text-black-400 text-sm">Setup all Parent and Child sub-levels for the Country</p>
                    </div>
                    <div>
                        <label className="inline-block mr-2 text-xs font-bold text-black-200" htmlFor="input">
                            <FaArrowsToDot className="inline-block " /> Parent Sub-levels
                        </label>
                        {parentlevels.map((parentlevel, index) => (
                            <div className="flex items-center mb-4" key={index}>
                                <input
                                    type="checkbox"
                                    id={`sub-level-${index}`}
                                    name="parent sub-level"
                                    value={parentlevel.label}
                                    className="mr-2 styled-checkbox"
                                />
                                <label htmlFor={`sub-level-${index}`} className="border-b mb-1 pb-1" style={{ width: "30%" }}>
                                    {parentlevel.label}
                                </label>
                                <button className="rounded-full">
                                    <EditIcon />
                                </button>
                            </div>
                        ))}
                        {showParentInput && (
                            <div className="combined-input-container flex items-center mb-3" style={{ width: "30%" }}>
                                <TextInput
                                    name="label"
                                    type="text"
                                    autoComplete="off"
                                    className="rounded xl"
                                    style={{ width: "93%" }}
                                    value={parentlevel.label}
                                    onChange={handleChange}
                                />
                                &nbsp;&nbsp;
                                <button
                                    type="button"
                                    onClick={handleAddParentLevel}
                                    className="bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100"
                                >
                                    Add
                                </button>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowParentInput(true)}
                            className="bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100"
                            style={{ width: "33%" }}
                        >
                            <IoIosAddCircleOutline />
                            Add Parent Sub-level
                        </button>
                    </div>


                    <div>
                        <label className="inline-block mr-2 text-xs font-bold text-black-400" htmlFor="input">
                            <GoDotFill className="inline-block " /> Child Sub-levels
                        </label>
                        {childlevels.map((childlevel, index) => (
                            <div className="flex items-center mb-4" key={index}>
                                <input
                                    type="checkbox"
                                    id={`sub-level-${index}`}
                                    name="child sub-level"
                                    value={childlevel.label}
                                    className="mr-2 styled-checkbox"
                                />
                                <label htmlFor={`sub-level-${index}`} className="border-b mb-1 pb-1" style={{ width: "30%" }}>
                                    {childlevel.label}
                                </label>
                                <button className="rounded-full">
                                    <EditIcon />
                                </button>
                            </div>
                        ))}
                        {showChildInput && (
                            <div className="combined-input-container flex items-center mb-3" style={{ width: "30%" }}>
                                <TextInput
                                    name="label"
                                    type="text"
                                    autoComplete="off"
                                    className="rounded xl"
                                    style={{ width: "93%" }}
                                    value={childlevel.label}
                                    onChange={handleChanges}
                                />
                                &nbsp;&nbsp;
                                <button
                                    type="button"
                                    onClick={handleAddChildLevel}
                                    className="bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100"
                                >
                                    Add
                                </button>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowChildInput(true)}
                            className="bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100"
                            style={{ width: "33%" }}
                        >
                            <IoIosAddCircleOutline />
                            Add Child Sub-level
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

export default NewIndividual;