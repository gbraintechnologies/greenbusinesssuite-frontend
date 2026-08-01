import React from "react";
import { FiInbox } from "react-icons/fi";

function EmptyList() {
  return (
    <div className="mx-auto max-w-3xl items-center justify-center flex flex-col gap-2">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
        <FiInbox size={44} className="text-slate-700" />
      </div>

      <h2 className="font-semibold mt-4 text-xl">Your list is empty</h2>
      <p className="font-light text-sm  text-center">
        This should detail the actions you can take on <br /> this screen, as
        well as why it's valuable.
      </p>

      <button className="mt-5 w-40 bg-primary-green px-3 text-sm py-3 rounded-lg text-white">
        {" "}
        Primary action
      </button>

      <button className="mt-1 w-40 bg-white px-3 text-sm py-3  text-primary-green">
        Learn More
      </button>
    </div>
  );
}

export default EmptyList;
