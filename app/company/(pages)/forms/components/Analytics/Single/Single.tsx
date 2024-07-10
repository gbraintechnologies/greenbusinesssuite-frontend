import React from "react";

type Props = {
  item: any;
};
const Single = ({ item }: Props) => {
  return (
    <div className="col-span-2 py-7 border border-gray-100 px-5 flex items-center justify-center">
      <div>
        {item?.data?.map((single: any) => {
          return (
            <div className=" flex items-center justify-center gap-5 flex-col">
              <p className="uppercase bg-gray-200 rounded-full p-1 px-5 text-gray-800 text-xs">
                {item?.function}
              </p>
              <h3 className="text-7xl my-2 font-bold">{single?.value}</h3>

              <p className="text-semibold">{single?.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Single;
