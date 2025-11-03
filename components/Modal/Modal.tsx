import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { IoCloseCircleOutline } from "react-icons/io5";

// types
import { IModal } from "@/types";

export default function Modal({
  isOpen,
  setIsOpen,
  title,
  children,
  showTitle = true,
  hideClose = false,
  size = "small",
}: IModal) {
  //
  //
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative   z-[100]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed  inset-0 overflow-y-auto">
          <div className="min-h-full z-[999999] items-center justify-center text-center md:pt-4  pt-20 flex pb-0 px-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`${
                  size === "big" ? "max-w-7xl min-h-[50vh]" : "max-w-xl"
                } w-full border dark:border-accent-dark  transform overflow-hidden rounded-md bg-white  text-primary-dark pt-5 z-[999999] text-left align-bottom md:align-middle shadow-xl transition-all`}
              >
                {showTitle && (
                  <div className=" flex flex-row justify-between px-5 py-2 pb-4">
                    <Dialog.Title
                      as="h2"
                      className="text-xl font-semibold text-primary-dark leading-6"
                    >
                      {showTitle && title}
                    </Dialog.Title>

                    {!hideClose && (
                      <IoCloseCircleOutline
                        size={26}
                        className="cursor-pointer z-[9999]"
                        onClick={() => closeModal()}
                      />
                    )}
                  </div>
                )}
                <div className="">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// lg:max-w-6xl - large modal tweak
