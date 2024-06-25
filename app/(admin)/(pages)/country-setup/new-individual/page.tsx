'use client'
import React, { useState } from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import "../index.css"
import Countries, { Countrie } from "../components/Countries";
import SelectInput from "../components/SelectInput";
import TextInput from "../components/TextInput";
import UploadAreaInput from '../components/UploadAreaInput';
import Image from "next/image";
import { AiOutlineDelete } from 'react-icons/ai';
import { IoCloseCircleOutline } from "react-icons/io5";
import FormatByte from "../components/FormatByte";
import ExcelIcon from "@/public/icons/ExcelIcon";
import Link from 'next/link';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";


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


function NewIndividual() {

    type typeOfSchema = yup.InferType<typeof schema>;
    const [selectedOption, setSelectedOption] = useState('Free Input');
    const [IDImage, setIDImage] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [fileName, setFileName] = useState<any>({ 'name': '', 'size': '' })
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
    const [dropdownItems, setDropdownItems] = useState('');
    const [labels, setLabels] = useState<string[]>([]);

    const handleContinue = () => {
        const items = dropdownItems.split(',').map(item => item.trim()).filter(item => item);
        setLabels(items);
    };

    const handleOptionClick = (option: any) => {
        setSelectedOption(option);
    };


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

    const onSubmit = async (data: typeOfSchema) => {

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
                    </div>
                    <div>
                        <div className="mb-2 relative">
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

                    <div className="mb-1 relative">
                        <TextInput
                            type="text"
                            autoComplete="off"
                            label="Level name"
                            placeholder='Enter name of category'
                            className="rounded xl"
                            style={{ width: "30%", height: "30%" }}
                        />
                    </div>
                    <div>
                        <p className="text-black-400 text-sm">Child Sub-level Type</p>
                    </div>
                    <div>
                        <div className="flex space-x-4">
                            <div
                                onClick={() => handleOptionClick('Free Input')}
                                className={`flex border border-dashed py-3 rounded-[11px] h-[90px] w-[230px] cursor-pointer relative ${selectedOption === 'Free Input' ? 'border-green-500' : ''}`}
                                style={{ backgroundColor: selectedOption === 'Free Input' ? '#E5FFEF' : '' }}
                            >
                                <div className="mr-3"></div>
                                <div className="flex flex-col justify-between">
                                    <div className="flex justify-between items-center relative">
                                        <p className="text-sm font-bold text-gray-900">
                                            Free Input
                                        </p>
                                        <input
                                            type="radio"
                                            id="free-input"
                                            className="custom-radio"
                                            checked={selectedOption === 'Free Input'}
                                            readOnly
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">Free for the first two weeks</p>
                                </div>
                            </div>

                            <div
                                onClick={() => handleOptionClick('Dropdown')}
                                className={`flex border border-dashed py-3 rounded-[11px] h-[90px] w-[230px] cursor-pointer relative ${selectedOption === 'Dropdown' ? 'border-green-500 hover:bg-teal-50' : 'hover:bg-teal-50'}`}
                                style={{ backgroundColor: selectedOption === 'Dropdown' ? '#E5FFEF' : '' }}
                            >
                                <div className="mr-3"></div>
                                <div className="flex flex-col justify-between">
                                    <div className="flex justify-between items-center relative">
                                        <p className="text-sm font-bold text-gray-900">
                                            Dropdown
                                        </p>
                                        <input
                                            type="radio"
                                            id="dropdown"
                                            className="custom-radio"
                                            checked={selectedOption === 'Dropdown'}
                                            readOnly
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">Free for the first two weeks</p>
                                </div>
                            </div>
                        </div>

                        {selectedOption === 'Free Input' && (
                            <div className="mt-6">
                                <div>
                                    <h4 className="font-bold text-black-400">Is this a sub-level?</h4>
                                    <p className="text-black-400 text-sm mb-4">A sub level allows you to add the configuration under another level</p>
                                </div>
                                <div className="flex mb-3" style={{ width: "30%" }}>
                                    <button
                                        type="submit"
                                        className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl mr-2"
                                    >
                                        <IoIosAddCircleOutline size={20} />Save Changes
                                    </button>
                                    <Link href="/country-setup">
                                        <button
                                            type="button"
                                            className="button bg-gray-50 border border-gray-200 shadow-sm py-3 px-4 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                                        >
                                            Cancel
                                        </button>
                                    </Link>
                                </div>
                                <div style={{ width: '30%', borderBottom: '1px solid lightgray' }}></div>
                            </div>
                        )}

                        {selectedOption === 'Dropdown' && (
                            <div className="mt-6">
                                <div>
                                    <div className="mb-1 relative">
                                        <TextInput
                                            type="text"
                                            autoComplete="off"
                                            label="Dropdown Items"
                                            placeholder='Enter a list of comma separated values'
                                            className="rounded xl"
                                            style={{ width: "30%", height: "30%" }}
                                            value={dropdownItems}
                                            onChange={(e) => setDropdownItems(e.target.value)}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', width: '30%', margin: '10px 0' }}>
                                        <div style={{ flex: 1, borderBottom: '1px solid lightgray' }}></div>
                                        <span style={{ margin: '0 10px', fontSize: '16px', color: 'black' }}>or</span>
                                        <div style={{ flex: 1, borderBottom: '1px solid lightgray' }}></div>
                                    </div>
                                    <div className="h-[300px]" style={{ width: "30%" }}>
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
                                </div>
                                <div className="flex justify-end mt-4" style={{ width: "30%" }}>
                                    <Link href="/country-setup">
                                        <button
                                            type="button"
                                            className="button bg-gray-50 border border-gray-200 shadow-sm py-3 px-4 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl mr-3"
                                        >
                                            Cancel
                                        </button>
                                    </Link>
                                    <Link href={`/country-setup/region-input?labels=${encodeURIComponent(dropdownItems)}`}>
                                        <button
                                            type="button"
                                            onClick={handleContinue}
                                            className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                                        >
                                            Continue
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </form>

            </div>
        </div>
    )
}

export default NewIndividual;