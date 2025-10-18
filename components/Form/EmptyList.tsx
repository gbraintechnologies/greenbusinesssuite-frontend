import EmptyListIcon from "@/public/icons/EmptyListIcon";
import React from "react";

function EmptyList({ text }: { text?: string }) {
  return (
    <div className="mx-auto max-w-3xl items-center justify-center flex flex-col gap-2">
      <EmptyListIcon />

      <h2 className="header-2">No Forms</h2>
      <p className="font-light text-sm -mt-5  text-center">
        {text ? text : "You currently do not have any forms"}
      </p>

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
