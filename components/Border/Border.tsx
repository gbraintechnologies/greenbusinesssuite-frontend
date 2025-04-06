import React from "react";

function Border({
  hasTopBottomMargin = true,
}: {
  hasTopBottomMargin?: boolean;
}) {
  return (
    <div
      className={`${
        hasTopBottomMargin ? "my-5" : "my-2"
      } w-full  px-5 border-[0.2px] border-t-[#CFCFCF]`}
    ></div>
  );
}

export default Border;
