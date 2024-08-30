import React from "react";
import { IFilter } from "../@managecompanies/page";

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
      } px-5 py-1`}
    >
      {filter.name}
    </button>
  );
};

export default TabItem;
