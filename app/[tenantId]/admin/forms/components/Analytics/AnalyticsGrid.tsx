"use client";
import React from "react";

import { LuChartLine } from "react-icons/lu";

// display types
import Barchart from "../../../../../../components/BarChart/BarChart";
import Single from "../../../../../../components/Single/Single";
import Donutchart from "../../../../../../components/DonutChart/DonutChart";

const AnalyticsGrid = ({
  analytics,
  emptyTitle = "No analytics enabled for form fields",
  emptyMessage,
}: any) => {
  if (!Array.isArray(analytics) || analytics.length === 0) {
    return (
      <div className="flex items-center justify-center h-[20rem] w-full px-6">
        <div className="flex max-w-lg flex-col items-center justify-center gap-3 text-center">
          <LuChartLine className="text-gray-500" size={50} />
          <p className="text-sm font-medium text-gray-700">{emptyTitle}</p>
          {emptyMessage && (
            <p className="text-sm font-light text-gray-500">{emptyMessage}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4">
      {analytics.map((item: any, index: number) => {
        return (
          <DataVisualization
            key={item.fieldName ?? item.function ?? index}
            item={item}
          />
        );
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
      return (
        <div className="col-span-2">
          <Barchart item={item} categories={["value"]} />
        </div>
      );

    // DEFAULT CASE WHEN
    default:
      return <Single item={item} />;
  }
};
