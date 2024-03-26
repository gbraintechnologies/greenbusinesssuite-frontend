import { Fragment, useState } from "react";
import Modal from "./Modal";
import { LuPlusCircle } from "react-icons/lu";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { AiOutlineDelete } from "react-icons/ai";
import Image from "next/image";
import UploadAreaInput from "./UploadAreaInput";
import { RiDeleteBin5Line } from "react-icons/ri";
import FormatByte from "./FormatByte";
import ExcelIcon from "@/public/icons/ExcelIcon";

function Nav() {
  const [showCancelModal, setShowCancelModal] = useState(false);
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

      // setIDImage(IDImage);
    } else {
      alert("Please upload a CSV or XLS file.");
    }
  };

  const handleImportButtonClick = () => {
    setShowCancelModal(true);
  };

  const handleImportData = () => {
    setTimeout(() => {
      setIDImage(null);
      setUploadProgress(0);
    }, 5000);

  };

  return (
    <div className="w-full text-[#0F172A] px-5 flex justify-between">
      <div>
        <h3 className="font-semibold text-xl">Jurisdictions</h3>
      </div>

      <Menu as="div" className="z-20 relative inline-block text-left">
        <div>
          <Menu.Button className="bg-primary-green flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl">
            <LuPlusCircle /> Add New{" "}
            <div className="border-r-[0.3px] border-opacity-50 border-white h-10"></div>{" "}
            <IoIosAddCircleOutline />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="z-50 absolute right-0 mt-2 px-1 py-1 w-60 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <Menu.Item>
              <Link href="/jurisdiction-setup/new-individual">
                <div className="flex hover:text-primary-dark hover:bg-gray-50 w-full items-center rounded-md px-3 py-2 mb-1">
                  Add Individual
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={handleImportButtonClick}
                className="flex hover:text-primary-dark hover:bg-gray-50 w-full items-center rounded-md px-3 py-2 mb-1"
              >
                Import via CSV and xls
              </button>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>

      <Modal
        isOpen={showCancelModal}
        setIsOpen={setShowCancelModal}
        title="Import via CSV"
      >
        <div className="p-5 flex flex-col items-center">
          <div className="w-full h-[304px]">
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
                  <div className="flex flex-row mb-2">
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
                      <RiDeleteBin5Line color="red" className="h-5 w-10" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between w-full">
            <div className="flex justify-between w-full mt-10">
              <div className="flex justify-between w-full mt-20 relative">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="text-gray-700 px-4 py-2 rounded-2xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportData}
                  className="bg-primary-green text-white px-4 py-2 rounded-2xl"
                >
                  Import data
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Nav;