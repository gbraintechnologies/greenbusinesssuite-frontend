import DatePickerIcon from "@/public/icons/DatePickerIcon";
import { TimelineType, TimelineValues } from "@/types";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import React, { useEffect } from "react";
import { BsChevronDown } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";

type Props = {
  selectedTimeline: { label: TimelineValues; value: TimelineType } | undefined;
  setSelectedTimeline: React.Dispatch<
    React.SetStateAction<
      { label: TimelineValues; value: TimelineType } | undefined
    >
  >;
};
const DatePicker = ({ selectedTimeline, setSelectedTimeline }: Props) => {
  const timelines: {
    label: TimelineValues;
    value: TimelineType;
  }[] = [
    
    {
      label: "All time",
      value: "ALL",
    },
    {
      label: "Today",
      value: "TODAY",
    },
    {
      label: "This week",
      value: "THIS_WEEK",
    },
    {
      label: "This month",
      value: "THIS_MONTH",
    },
    {
      label: "This year",
      value: "THIS_YEAR",
    },
    
  ];

  useEffect(() => {
    if (setSelectedTimeline) {
      setSelectedTimeline(timelines[0]);
    }
  }, []);
  return (
    <div className="flex shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] bg-white border border-[#E2E8F0] w-fit rounded-lg">
      <Dropdown>
        <DropdownTrigger>
          <button className="flex justify-between outline-none items-center px-3 py-1 border-r border-[#E2E8F0] gap-2">
            <div className="text-sm">{selectedTimeline?.label}</div>
            <BsChevronDown color="#94A3B8" />
          </button>
        </DropdownTrigger>
        <DropdownMenu
          className="shadow-md bg-white border border-[#F1F5F9]  -mt-4 rounded-lg flex flex-col gap-3"
          aria-label="Static Actions"
        >
          {timelines.map((timeline) => (
            <DropdownItem
              key="view"
              className="items-center w-full p-2 rounded-md text-sm font-medium hover:bg-[#F1F5F9]"
              onClick={() => setSelectedTimeline(timeline)}
            >
              <div className="w-full flex items-center justify-between">
                <p>{timeline.label}</p>
                {selectedTimeline?.label == timeline?.label && (
                  <span className="">
                    <FaCheck className="h-5 w-5" color="black" />
                  </span>
                )}
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <button className="flex gap-3 items-center px-3 py-1">
        <div>
          <DatePickerIcon />
        </div>
        <div className="text-sm">All Time</div>
        <BsChevronDown color="#94A3B8" />
      </button>
    </div>
  );
};

export default DatePicker;
