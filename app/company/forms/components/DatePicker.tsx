import React from "react";
import { BsChevronDown } from "react-icons/bs";

const DatePicker = () => {
  return (
    <div className="flex shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] bg-white border border-[#E2E8F0] w-fit rounded-lg">
      <button className="flex justify-between items-center px-3 py-2 border-r border-[#E2E8F0] gap-2">
        <div>Today</div>
        <BsChevronDown color="#94A3B8" />

      </button>
      <button className="flex gap-3 items-center px-3 py-2">
        <div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z"
              stroke="#1E293B"
              stroke-width="1.5"
            />
            <path
              d="M7 4V2.5"
              stroke="#1E293B"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M17 4V2.5"
              stroke="#1E293B"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M2.5 9H21.5"
              stroke="#1E293B"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div>All Time</div>
        <BsChevronDown color="#94A3B8" />
      </button>
    </div>
  );
};

export default DatePicker;
