import { TimelineType, TimelineValues } from "@/types";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import React, { useEffect } from "react";

// icons
import { LuCalendar } from "react-icons/lu";
import { BsChevronDown } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";
import DatePickerIcon from "@/public/icons/DatePickerIcon";

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
      label: "Today",
      value: "TODAY",
    },
    {
      label: "All time",
      value: "ALL",
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
      // DEFAULT SHOULD BE ALL
      setSelectedTimeline(timelines[1]);
    }
  }, []);
  return (
    <div className="flex shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] bg-white border border-[#E2E8F0] w-fit rounded-lg">
      <Dropdown>
        <DropdownTrigger>
          <button className="flex justify-between outline-none items-center px-3 py-1 gap-2">
            <LuCalendar size={18} />
            <div className="text-sm">{selectedTimeline?.label}</div>
            <BsChevronDown color="#94A3B8" />
          </button>
        </DropdownTrigger>
        <DropdownMenu
          className="shadow-md bg-white border border-[#F1F5F9] rounded-lg flex flex-col gap-3"
          aria-label="Static Actions"
        >
          {timelines.map((timeline) => (
            <DropdownItem
              key={timeline.label}
              className="items-center w-full p-2 rounded-md text-sm font-medium hover:bg-[#F1F5F9]"
              onClick={() => setSelectedTimeline(timeline)}
            >
              <div className="w-full flex items-center justify-between">
                <p>{timeline.label}</p>
                {selectedTimeline?.label == timeline?.label && (
                  <span className="">
                    <FaCheck size={15} color="black" />
                  </span>
                )}
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      {/* <button className="flex gap-3 items-center px-3 py-1">
        <div>
          <DatePickerIcon />
        </div>
        <div className="text-sm">All Time</div>
        <BsChevronDown color="#94A3B8" />
      </button> */}
    </div>
  );
};

export default DatePicker;
