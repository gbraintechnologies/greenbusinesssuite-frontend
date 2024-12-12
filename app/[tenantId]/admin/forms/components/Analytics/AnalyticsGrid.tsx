"use client";
import React from "react";

import { LuChartLine } from "react-icons/lu";

// display types
import Barchart from "./BarChart/BarChart";
import Single from "./Single/Single";
import Donutchart from "./DonutChart/DonutChart";

const AnalyticsGrid = ({ analytics }: any) => {
  if (analytics?.length === 0) {
    return (
      <div className="flex items-center justify-center h-[20rem] w-full">
        <div className="flex flex-col gap-3 items-center justify-center">
          <LuChartLine className="text-gray-500" size={50} />
          <p className="text-gray-500 text-sm font-light">
            [ No analytics enabled for form fields ]
          </p>
        </div>
      </div>
    );
  }

  // analytics
  return (
    <div className="grid grid-cols-4">
      {analytics.map((item: any) => {
        return <DataVisualization key={item.fieldName} item={item} />;
      })}
    </div>
  );
};

export default AnalyticsGrid;

const DataVisualization = ({ item }: any) => {
  switch (item?.displayType) {
    case "pie-chart":
      return <Donutchart item={item} />;

    case "bar-chart":
      return <Barchart item={item} />;

    // DEFAULT CASE WHEN
    default:
      return <Single item={item} />;
  }
};
