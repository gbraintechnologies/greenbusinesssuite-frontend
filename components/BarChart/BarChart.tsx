import { BarChart } from "@tremor/react";
import React from "react";

type Props = {
  item: any;
  categories?: any;
};

const Barchart = ({ item, categories }: Props) => {
  return (
    <div className="w-full border border-gray-100 px-5 py-2">
      <h1 className="font-medium text-lg text-slate-900 mb-2">
        {item?.fieldName}
      </h1>
      <BarChart
        data={item?.data}
        index="name"
        categories={categories ?? ["value"]}
        colors={["violet"]}
        yAxisWidth={48}
      />
    </div>
  );
};

export default Barchart;
