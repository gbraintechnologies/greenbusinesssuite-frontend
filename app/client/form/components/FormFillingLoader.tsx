import React from "react";

import { IoIosArrowForward } from "react-icons/io";

function FormFillingLoader() {
  return (
    <div className="relative h-screen flex-col bg-[#F8FAFC] flex md:flex-row gap-5 p-2">
      <div className="hidden md:block w-[21rem] fixed bg-[#E2E8F0]  rounded-lg p-5 h-[91vh] ">
        <p className="font-light text-gray-600 text-sm">FORM STEPS</p>

        <div className="flex flex-col gap-4 mt-5">
          <button className="bg-gray-300 animate-pulse w-full px-3 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center w-[90%] gap-2">
              <div className="w-7  h-7 text-xs rounded-full flex items-center justify-center font-light bg-gray-700 animate-pulse"></div>
              <p className="text-base  w-full h-10 bg-gray-400 rounded-lg animate-pulse" />
            </div>
            <IoIosArrowForward size={20} />
          </button>
          <button className="bg-gray-300 animate-pulse w-full px-3 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center w-[90%] gap-2">
              <div className="w-7  h-7 text-xs rounded-full flex items-center justify-center font-light bg-gray-700 animate-pulse"></div>
              <p className="text-base  w-full h-10 bg-gray-400 rounded-lg animate-pulse" />
            </div>
            <IoIosArrowForward size={20} />
          </button>
          <button className="bg-gray-300 animate-pulse w-full px-3 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center w-[90%] gap-2">
              <div className="w-7  h-7 text-xs rounded-full flex items-center justify-center font-light bg-gray-700 animate-pulse"></div>
              <p className="text-base  w-full h-10 bg-gray-400 rounded-lg animate-pulse" />
            </div>
            <IoIosArrowForward size={20} />
          </button>
          <button className="bg-gray-300 animate-pulse w-full px-3 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center w-[90%] gap-2">
              <div className="w-7  h-7 text-xs rounded-full flex items-center justify-center font-light bg-gray-700 animate-pulse"></div>
              <p className="text-base  w-full h-10 bg-gray-400 rounded-lg animate-pulse" />
            </div>
            <IoIosArrowForward size={20} />
          </button>
          <button className="bg-gray-300 animate-pulse w-full px-3 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center w-[90%] gap-2">
              <div className="w-7  h-7 text-xs rounded-full flex items-center justify-center font-light bg-gray-700 animate-pulse"></div>
              <p className="text-base  w-full h-10 bg-gray-400 rounded-lg animate-pulse" />
            </div>
            <IoIosArrowForward size={20} />
          </button>
          <button className="bg-gray-300 animate-pulse w-full px-3 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center w-[90%] gap-2">
              <div className="w-7  h-7 text-xs rounded-full flex items-center justify-center font-light bg-gray-700 animate-pulse"></div>
              <p className="text-base  w-full h-10 bg-gray-400 rounded-lg animate-pulse" />
            </div>
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>
      <div className="ml-[22rem] w-full mt-5 mb-56 flex flex-col gap-3">
        <div>
          <div className="h-10 mx-auto w-[70%] mt-10  bg-gray-200 animate-pulse rounded-xl"></div>

          <div className="h-[20rem] mx-auto w-[70%] mt-2  bg-gray-200 animate-pulse rounded-xl"></div>
        </div>
        <div>
          <div className="h-10 mx-auto w-[70%] mt-10  bg-gray-200 animate-pulse rounded-xl"></div>

          <div className="h-[20rem] mx-auto w-[70%] mt-2  bg-gray-200 animate-pulse rounded-xl"></div>
        </div>
        <div>
          <div className="h-10 mx-auto w-[70%] mt-10  bg-gray-200 animate-pulse rounded-xl"></div>

          <div className="h-[20rem] mx-auto w-[70%] mt-2  bg-gray-200 animate-pulse rounded-xl"></div>
        </div>
        <div>
          <div className="h-10 mx-auto w-[70%] mt-10  bg-gray-200 animate-pulse rounded-xl"></div>

          <div className="h-[20rem] mx-auto w-[70%] mt-2  bg-gray-200 animate-pulse rounded-xl"></div>
        </div>{" "}
      </div>
    </div>
  );
}

export default FormFillingLoader;
