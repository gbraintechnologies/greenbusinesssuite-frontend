"use client";
import React, { useEffect, useState } from "react";

const data = [
  {
    id: 1,
    question: "What gender are you?",
    totalNumOfEntries: 1000,
    type: "Category",
    categories: [
      { label: "Males", value: 670 },
      { label: "Females", value: 330 },
    ],
  },
  {
    id: 2,
    question: "What gender are you?",
    totalNumOfEntries: 1000,
    type: "Category",
    categories: [
      { label: "Males", value: 670 },
      { label: "Females", value: 330 },
    ],
  },
  {
    id: 3,
    question: "What gender are you?",
    totalNumOfEntries: 1000,
    type: "Category",
    categories: [
      { label: "Males", value: 670 },
      { label: "Females", value: 330 },
    ],
  },
  {
    id: 4,
    question: "What gender are you?",
    totalNumOfEntries: 1000,
    type: "Category",
    categories: [
      { label: "Males", value: 670 },
      { label: "Females", value: 330 },
    ],
  },
];
const AnalyticsGrid = () => {
  const categoryColors = ["#8471F2", "#67E2AE", "#49C4E5"];

  const getCategoryColor = (index: number) => {
    const categoryColor = index % categoryColors.length;
    return categoryColors[categoryColor];
  };

  // const [colorList, setColorList] = useState<string[]>([]);

  // useEffect(()=> {
  //   const colors = data.map((item, index) => {
  //     if (item.type === "Category") {
  //       return item.categories.map((category, index) => getCategoryColor(index));
  //     }
  //   });
  //   setColorList(colors);

  // } , [])

  return (
    <div className="flex items-center h-full flex-wrap">
      {data.map((item, index) => (
        <div
          className={
            " w-[50%] min-h-72 px-5 border-[#E2E8F0]" +
            (index % 2 === 0 ? " border-r border-b " : " border-b") +
            (index === 0 || index === 1 ? " mt-4" : " pt-4 ") +
            (index === data.length - 1 || index === data.length - 2
              ? " border-b-0"
              : "")
          }
        >
          {/* Question And Number Of entries */}
          <div className="flex flex-col">
            <div className="text-base font-medium text-[#0F172A]">
              {item.question}
            </div>
            <div className="font-semibold text-sm text-[#475569]">
              {item.totalNumOfEntries}{" "}
              <span className="font-normal">entries</span>
            </div>
          </div>

          {item.type === "Category" && (
            <div className="w-full flex justify-between mt-4">
              {item.categories.map((category, index: number) => (
                <div className="flex items-center gap-5" key={index}>
                  <div
                    className={
                      "block h-4 w-2 rounded-lg " +
                      (index === 0 ? "bg-[#3B82F6]" : "bg-[#16C8C7]")
                    }
                  ></div>
                  <div className="flex flex-col ">
                    <div className="text-[12px] text-[#475569] font-normal">
                      {category.label}
                    </div>
                    <div className="text-sm text-[#0F172A] font-medium ">
                      {category.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnalyticsGrid;
