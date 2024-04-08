import useForm from "@/hooks/useForm";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";

// icon
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlinePhone } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { BsCardText } from "react-icons/bs";
import { AiOutlineNumber } from "react-icons/ai";

export default function FormElementSelector({ section }: any) {
  //
  const { addFormField } = useForm();
  // types
  // text
  // integer
  // string
  // email
  // phone

  let template = {
    name: "",
    description: "",
    label: "",
    placeHolder: "",
    instruction: "",
    isDeleted: false,
    choiceValues: [],
    isMandatory: true,
    horizontalAlign: false,
    validPattern: null,
    createdOn: new Date(),
    updatedOn: new Date(),
    deletedOn: null,
  };

  const elements = [
    {
      icon: <MdOutlineMailOutline size={18} />,
      name: "Email",
      func: () => {
        addFormField(section, { ...template, fieldDataType: "email" });
      },
    },
    {
      icon: <MdOutlinePhone size={18} />,
      name: "Phone Number",
      func: () => {
        addFormField(section, { ...template, fieldDataType: "phone" });
      },
    },
    {
      icon: <BsCardText size={18} />,
      name: "Short text",
      func: () => {
        addFormField(section, { ...template, fieldDataType: "short-text" });
      },
    },
    {
      icon: <TiDocumentText size={18} />,
      name: "Long text",
      func: () => {
        addFormField(section, { ...template, fieldDataType: "long-text" });
      },
    },
    {
      icon: <AiOutlineNumber size={18} />,
      name: "Number",
      func: () => {
        addFormField(section, { ...template, fieldDataType: "number" });
      },
    },
  ];
  return (
    <div className="w-60 z-[100] mx-auto text-center">
      <Menu as="div" className="relative inline-block text-center">
        <div>
          <Menu.Button className="bg-white border text-sm shadow-sm hover:bg-black hover:text-white border-gray-200 px-3 py-2 rounded-lg flex items-center justify-center gap-2">
            Add form element
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
          <Menu.Items className="absolute z-[100] -right-[30%] mt-2 w-60 origin-top divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 ">
              {elements.map((item: any) => {
                return (
                  <Menu.Item>
                    <button
                      onClick={item.func}
                      className="group flex gap-2 w-full hover:bg-gray-100 items-center rounded-md px-2 py-3 text-sm"
                    >
                      {item.icon} {item.name}
                    </button>
                  </Menu.Item>
                );
              })}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
