import React from "react";

const data = [
  {
    id: 1,
    question: "What gender are you?",
    totalNumOfEntries: 1000,
    numOfMales: 670,
    numOfFemales: 330,
    type: "Category",
  },
  {
    id: 2,
    question: "What gender are you?",
    totalNumOfEntries: 1000,
    numOfMales: 670,
    numOfFemales: 330,
    type: "Category",
  },
  {
    id: 3,
    question: "What gender are you?",
    totalNumOfEntries: 1000,
    numOfMales: 670,
    numOfFemales: 330,
    type: "Category",
  },
  {
    id: 4,
    question: "What gender are you?",
    totalNumOfEntries: 1000,
    numOfMales: 670,
    numOfFemales: 330,
    type: "Category",
  },
];
const AnalyticsGrid = () => {
  return (
    <div className="flex items-center h-full flex-wrap">
      {data.map((item, index) => (
        <div
          className={
            "flex w-[50%] min-h-56 px-5 border-[#E2E8F0]" +
            (index % 2 === 0 ? " border-r border-b " : " border-b") +
            ((index === 0 || index === 1) ? " mt-4": " pt-4 ") +   
            ((index === data.length - 1 || index === data.length -2 ) ? " border-b-0" : "")
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

          
        </div>
      ))}
    </div>
  );
};

export default AnalyticsGrid;
