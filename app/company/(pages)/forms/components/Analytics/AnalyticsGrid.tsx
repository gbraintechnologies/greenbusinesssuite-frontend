"use client";
import React from "react";

import { BarChart } from "@tremor/react";
import { LuLineChart } from "react-icons/lu";
import Barchart from "./BarChart/BarChart";

const dataFormatter = (number: number) =>
  Intl.NumberFormat("us").format(number).toString();

// const data = [
//   {
//     id: 1,
//     question: "What gender are you?",
//     totalNumOfEntries: 1000,
//     type: "Category",
//     categories: [
//       { label: "Males", value: 670 },
//       { label: "Females", value: 330 },
//     ],
//   },
//   {
//     id: 2,
//     question: "What gender are you?",
//     totalNumOfEntries: 1000,
//     type: "Category",
//     categories: [
//       { label: "Males", value: 670 },
//       { label: "Females", value: 330 },
//     ],
//   },
//   {
//     id: 3,
//     question: "What gender are you?",
//     totalNumOfEntries: 1000,
//     type: "Category",
//     categories: [
//       { label: "Males", value: 670 },
//       { label: "Females", value: 330 },
//     ],
//   },
//   {
//     id: 4,
//     question: "What gender are you?",
//     totalNumOfEntries: 1000,
//     type: "Category",
//     categories: [
//       { label: "Males", value: 670 },
//       { label: "Females", value: 330 },
//     ],
//   },
// ];

const AnalyticsGrid = ({ analytics }: any) => {
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

  if (analytics?.length === 0) {
    return (
      <div className="flex items-center justify-center h-[20rem] w-full">
        <div className="flex flex-col gap-3 items-center justify-center">
          <LuLineChart className="text-gray-500" size={50} />
          <p className="text-gray-500 text-sm font-light">
            [ No analytics enabled for form fields ]
          </p>
        </div>
      </div>
    );
  }

  // analytics
  return (
    <div className="grid grid-cols-3 gap-5 mt-5 px-5">
      {analytics.map((item: any) => {
        return <DataVisualization key={item.fieldName} item={item} />;
      })}
    </div>
    // <div className="flex items-center h-full flex-wrap">
    //   {data.map((item, index) => (
    //     <div
    //       className={
    //         " w-[50%] min-h-72 px-5 border-[#E2E8F0]" +
    //         (index % 2 === 0 ? " border-r border-b " : " border-b") +
    //         (index === 0 || index === 1 ? " mt-4" : " pt-4 ") +
    //         (index === data.length - 1 || index === data.length - 2
    //           ? " border-b-0"
    //           : "")
    //       }
    //     >
    //       {/* Question And Number Of entries */}
    //       <div className="flex flex-col">
    //         <div className="text-base font-medium text-[#0F172A]">
    //           {item.question}
    //         </div>
    //         <div className="font-semibold text-sm text-[#475569]">
    //           {item.totalNumOfEntries}{" "}
    //           <span className="font-normal">entries</span>
    //         </div>
    //       </div>

    //       {item.type === "Category" && (
    //         <div className="w-full flex justify-between mt-4">
    //           {item.categories.map((category, index: number) => (
    //             <div className="flex items-center gap-5" key={index}>
    //               <div
    //                 className={
    //                   "block h-4 w-2 rounded-lg " +
    //                   (index === 0 ? "bg-[#3B82F6]" : "bg-[#16C8C7]")
    //                 }
    //               ></div>
    //               <div className="flex flex-col ">
    //                 <div className="text-[12px] text-[#475569] font-normal">
    //                   {category.label}
    //                 </div>
    //                 <div className="text-sm text-[#0F172A] font-medium ">
    //                   {category.value}
    //                 </div>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       )}
    //     </div>
    //   ))}
    // </div>
  );
};

export default AnalyticsGrid;

const DataVisualization = ({ item }: any) => {
  switch (item?.displayType) {
    case "pie-chart":
      return <div className="col-span-1 m-3">PIECHART IMPLEMENTATION HERE</div>;

    case "bar-chart":
      return (
        <Barchart item={item} />
      );

    // DEFAULT CASE WHEN
    default:
      return (
        <div className="col-span-1 m-3 border border-gray-100 rounded-xl p-6">
          <div>
            {item?.data?.map((single: any) => {
              return (
                <div className="">
                  <p>
                    {item?.function} of {item?.name}
                  </p>
                  <h3 className="text-7xl my-2 font-bold">{single?.value}</h3>

                  <p>{single?.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      );
  }
};
