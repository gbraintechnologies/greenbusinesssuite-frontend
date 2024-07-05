import { DonutChart } from "@tremor/react";
import React from "react";

const baseColors = [
  '#16C8C7', // teal
  '#3B82F6', // blue
  '#FFCE56', // yellow
  '#9966FF', // purple
  '#FF9F40', // orange
  '#9CA3AF', // gray
  '#F472B6', // pink
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#22D3EE', // cyan
  '#A3E635', // lime
  '#C084FC', // purple
];



type Props = {
  item?: any;
};

const Donutchart = ({ item }: Props) => {
  const [dataWithColors, setDataWithColors] = React.useState<any>([]);

  React.useEffect(() => {
    let colorIndex = 0;

    const newDataWithColors = item?.data?.map((item: any) => {
      const color = baseColors[colorIndex] ;
      colorIndex++;
      return {
        ...item,
        color,
      };
      
    });
    setDataWithColors(newDataWithColors);
  }, [item]);


  return (
    <div className="col-span-2 py-7 border border-gray-100 px-5">
      <h1 className="font-medium text-lg text-slate-900 mb-2">
        {item?.fieldName}
      </h1>
      <Legend item={dataWithColors} />
      <DonutChart
        data={dataWithColors}
        variant="donut"
        showLabel={false}
        colors={dataWithColors?.map((d: any) => d.color)}
        onValueChange={(v) => console.log(v)}
      />
    </div>
  );
};

const Legend = ({ item }: Props) => {
  return (
    <div className="w-full flex flex-wrap justify-between my-4">
      {item?.map((category: any, index: number) => (
        <div className="flex items-center gap-3" key={index}>
          <div
            className={`block h-4 w-2 rounded-lg `}
            style={{ backgroundColor: category.color }}
          ></div>
          <div className="flex flex-col ">
            <div className="text-[12px] text-[#475569] font-normal">
              {category.name}
            </div>
            <div className="text-sm text-[#0F172A] font-medium ">
              {category.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Donutchart;
