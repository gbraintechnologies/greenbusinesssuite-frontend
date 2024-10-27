import EmptyListIcon from "@/public/icons/EmptyListIcon";
import React from "react";

function EmptyList({ text = "You currently do not have any forms" }: any) {
  return (
    <div className="mx-auto max-w-3xl items-center justify-center flex flex-col gap-2">
      <EmptyListIcon />

      <h2 className="font-semibold mt-4 text-xl">No Forms</h2>
      <p className="font-light text-sm  text-center">{text}</p>

      {/* <button className="mt-5 w-40 bg-primary-green px-3 text-sm py-3 rounded-lg text-white">
        {" "}
        Primary action
      </button>

      <button className="mt-1 w-40 bg-white px-3 text-sm py-3  text-primary-green">
        Learn More
      </button> */}
    </div>
  );
}

export default EmptyList;
