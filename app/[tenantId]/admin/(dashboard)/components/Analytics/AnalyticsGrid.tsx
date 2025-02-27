"use client";
import Barchart from "@/components/BarChart/BarChart";
import BarList from "@/components/BarList/BarList";
import Donutchart from "@/components/DonutChart/DonutChart";
import Single from "@/components/Single/Single";
import React from "react";

// display types

const AnalyticsGrid = ({ genderStats, sectorStats, businessStats }: any) => {
  const prepareGenderStats = (genderStats: any) => {
    return {
      data: Object.entries(genderStats).map(([key, value]) => ({
        name: key,
        value: value,
      })),
      fieldName: "Gender Distribution",
    };
  };

  const prepareBusinessTypeStats = (businessTypeStats: any) => {
    return Object.entries(businessTypeStats).map(([key, value]) => ({
      name: key.replace(/_/g, " "),
      value: value,
    }));
  };

  const prepareSectorStats = (sectorStats: any) => {
    return {
      data: Object.entries(sectorStats).map(([key, value]) => ({
        name: key.replace(/_/g, " "),
        value: value,
      })),
      fieldName: "Businesses By Sector",
    };
  };

  // analytics
  return (
    <div className="grid grid-cols-4">
      <DataVisualization
        item={prepareGenderStats(genderStats)}
        displayType="pie-chart"
      />
      <DataVisualization
        item={prepareBusinessTypeStats(businessStats)}
        displayType="bar-list"
      />
      <DataVisualization
        item={prepareSectorStats(sectorStats)}
        displayType="bar-chart"
      />
    </div>
  );
};

export default AnalyticsGrid;

const DataVisualization = ({ item, displayType }: any) => {
  switch (displayType) {
    case "pie-chart":
      return <Donutchart item={item} />;

    case "bar-list":
      return (
        <div className="py-7 px-5 col-span-2">
          <h1 className="font-medium text-lg text-slate-900 mb-2">
            Type of business
          </h1>
          <BarList item={item} />
        </div>
      );
    case "bar-chart":
      return (
        <div className="col-span-4">
          <Barchart item={item} categories={["value"]} />
        </div>
      );

    // DEFAULT CASE WHEN
    default:
      return <Single item={item} />;
  }
};
