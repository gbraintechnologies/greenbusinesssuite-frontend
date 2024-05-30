'use client'
import React, { ChangeEvent, useState } from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
//import "../index.css"
import Countries, { Countrie } from "../components/Countries";
import SelectInput from "../components/SelectInput";
import Image from "next/image";
import { AiOutlineDelete } from 'react-icons/ai';
import { IoCloseCircleOutline } from "react-icons/io5";
import FormatByte from "../components/FormatByte";
import ExcelIcon from "@/public/icons/ExcelIcon";
import Link from 'next/link';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { GoDotFill } from "react-icons/go";
import { useForm } from "react-hook-form";
import TextInput from '../components/TextInput';
import UploadAreaInput from '../components/UploadAreaInput';


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

function AddSector() {

  type typeOfSchema = yup.InferType<typeof schema>;
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
              <h3 className="font-semibold text-xl">Sector Setup</h3>
              <p className="text-black-400 text-sm">configure all sector for a jurisdiction</p>
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
                disabled={isSubmitting || !dirtyFields.jurisdiction_name}
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
            <label className="inline-block mr-2 text-xs font-bold text-black-300">
              Parent Sector Name
            </label>
            <div className="mb-5 relative">
              <TextInput
                type="text"
                autoComplete="off"
                className="rounded xl"
                style={{ width: "30%", height: "30%" }}
              />
            </div>
            <label className="inline-block mr-2 text-xs font-bold text-black-400" htmlFor="input">
              <GoDotFill className="inline-block " />Sub-sectors
            </label>



            <button
              type="button"
              className="bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100"
              style={{ width: "30%" }}
            >
              <IoIosAddCircleOutline />
              Add Sub-Sector
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', width: '30%', margin: '20px 0' }}>
            <div style={{ flex: 1, borderBottom: '1px solid lightgray' }}></div>
            <span style={{ margin: '0 10px', fontSize: '16px', color: 'black' }}>or</span>
            <div style={{ flex: 1, borderBottom: '1px solid lightgray' }}></div>
          </div>


          <div className="h-[300px]"  style={{ width: "30%"}}>
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
        </form>
      </div>
    </div>
  )
}

export default AddSector;