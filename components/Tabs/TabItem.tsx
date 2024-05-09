import { IFilter } from "@/types";
import React from "react";

type Props = {
  activeFilter: IFilter;
  setActiveFilter: React.Dispatch<React.SetStateAction<IFilter>>;
  filter: IFilter;
};
const TabItem: React.FC<Props> = ({
  activeFilter,
  setActiveFilter,
  filter,
}) => {
  return (
    <button
      onClick={() => setActiveFilter(filter)}
      className={`${
        activeFilter.id === filter.id
          ? "bg-white rounded-lg text-black"
          : "text-slate-500 font-normal"
      }  w-36 h-10 flex justify-center items-center md:block md:w-fit md:h-auto md:px-5 md:py-1 `}
    >
      {filter.name}
    </button>
  );
};

export default TabItem;
