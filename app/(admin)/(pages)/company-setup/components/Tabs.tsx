import React from "react";
import { IFilter } from "../@managecompanies/page";
import TabItem from "./TabItem";

type Props = {
  activeFilter: IFilter;
  setActiveFilter: React.Dispatch<React.SetStateAction<IFilter>>;
  filters: IFilter[];
};

const Tabs: React.FC<Props> = ({ filters, activeFilter, setActiveFilter }) => {
  return (
    <div className="bg-[#F1F5F9] text-sm p-1 rounded-lg">
      {filters.map((filter: IFilter, index: number) => {
        return (
          <TabItem
            key={index}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filter={filter}
          />
        );
      })}
    </div>
  );
};

export default Tabs;
