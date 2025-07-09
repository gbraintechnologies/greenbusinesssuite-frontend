import React from "react";

function AddressValues({ values, loading }: any) {
  console.log("values", values);

  const inputStyle =
    "border border-gray-200  rounded-lg p-2 focus:outline-none flex-1";

  return (
    <div>
      <h4 className="labelStyle font-medium text-base">
        Options for User Selection
      </h4>

      {!values && !loading && (
        <div className="mt-4 border border-gray-600 p-3">
          <p>No values available for user to select</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-5">
          <div className="bg-gray-300 rounded-lg h-10 animate-pulse w-full" />
          <div className="bg-gray-300 rounded-lg h-10 animate-pulse w-full" />
          <div className="bg-gray-300 rounded-lg h-10 animate-pulse w-full" />
          <div className="bg-gray-300 rounded-lg h-10 animate-pulse w-full" />
        </div>
      )}

      <div className="mt-2 w-full flex flex-col gap-4 ">
        {values?.map((value: any) => {
          return (
            <div className="flex justify-between items-center w-full gap-2">
              <input disabled value={value?.name} className={inputStyle} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AddressValues;
