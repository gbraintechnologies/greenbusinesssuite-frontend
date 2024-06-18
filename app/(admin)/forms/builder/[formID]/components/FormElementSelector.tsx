import useForm from "@/hooks/useForm";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";

// components
import Loader from "@/components/BeatLoader/Loader";

// default form elements
import { defaultFormElements } from "@/components/FormElements/FormElements";

export default function FormElementSelector({ section }: any) {
  const { addFormField, loadingField } = useForm();

  // add functions to form elements
  const elements = [];
  for (let i = 0; i < defaultFormElements.length; i++) {
    elements.push({
      icon: defaultFormElements[i]?.icon,
      name: defaultFormElements[i]?.name,
      func: () => {
        addFormField(section, {
          ...defaultFormElements[i]?.properties,
        });
      },
    });
  }

  return (
    <div className="w-72 z-[100] mx-auto text-center">
      <Menu as="div" className="relative inline-block text-center">
        <div>
          <Menu.Button
            disabled={loadingField}
            className="bg-white border text-sm shadow-sm hover:bg-black hover:text-white border-gray-200 w-40 px-3 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            {loadingField ? <Loader color="#1d1d1d" /> : "Add form element"}
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
          <Menu.Items className="absolute z-[100] -right-[30%] mt-2 w-72 origin-top divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
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
