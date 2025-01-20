"use client";
import Barchart from "@/components/BarChart/BarChart";
import Donutchart from "@/components/DonutChart/DonutChart";
import Single from "@/components/Single/Single";
import React from "react";

import { LuChartLine } from "react-icons/lu";

// display types


const AnalyticsGrid = ({ genderStats, sectorStats, businessTypeStats }: any) => {


    const preparedGenderStats = (genderStats: any) => {
        return {
          data: [
            { name: "Male", value: 2 },
            { name: "Female", value: 3 },
          ],
          fieldName: "Gender Distribution",
        };
      };
  // analytics
  return (
    <div className="grid grid-cols-4">
      <DataVisualization item={preparedGenderStats(genderStats)} displayType="pie-chart"/>
      <DataVisualization item={sectorStats} displayType="bar-chart"/>
        <DataVisualization item={businessTypeStats} displayType="pie-chart"/>
    </div>
  );
};

export default AnalyticsGrid;

const DataVisualization = ({ item, displayType }: any) => {
  switch (displayType) {
    case "pie-chart":
      return <Donutchart item={item} />;

    case "bar-chart":
      return <Barchart item={item} />;

    // DEFAULT CASE WHEN
    default:
      return <Single item={item} />;
  }
};


