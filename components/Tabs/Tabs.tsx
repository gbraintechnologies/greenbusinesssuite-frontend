import React, { useEffect } from "react";
import TabItem from "./TabItem";
import { IFilter } from "@/types";
import { useQueryState } from "nuqs";

type Props = {
  activeFilter: IFilter;
  setActiveFilter: any;
  tabQueryKey?: string;
  enableQueryState?: boolean;
  filters: IFilter[];
};

const Tabs: React.FC<Props> = ({
  filters,
  activeFilter,
  setActiveFilter,
  tabQueryKey = "tab",
  enableQueryState = true,
}) => {
  const [activeFilterId, setActiveFilterId] = enableQueryState
    ? useQueryState(tabQueryKey, {
        parse: Number,
        serialize: String,
        defaultValue: filters[0]?.id ?? 0,
      })
    : React.useState(filters[0].id);

  useEffect(() => {
    setActiveFilter(
      filters.find((filter) => filter.id === activeFilterId) || filters[0]
    );
  }, [activeFilterId]);

  useEffect(() => {
    console.log("active filter id changed ", activeFilter);
  }, [activeFilter]);

  return (
    <div className="bg-[#F1F5F9] text-sm p-1 rounded-lg flex w-fit">
      {filters.map((filter: IFilter, index: number) => {
        return (
          <TabItem
            key={index}
            activeFilter={activeFilter}
            setActiveFilterId={setActiveFilterId}
            setActiveFilter={setActiveFilter}
            filter={filter}
          />
        );
      })}
    </div>
  );
};

export default Tabs;
