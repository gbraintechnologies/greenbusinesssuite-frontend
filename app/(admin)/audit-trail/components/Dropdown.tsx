import React from "react";

import Select from "react-select";

//
import "../index.css"

function Dropdown({ options, selected, setSelected, bgColor,width, isSearchable=false }: any) {
  return (
    <Select
      className= {`border-0 flex-1 ${bgColor} ${width}`}
      options={options}
      value={selected}
      isSearchable={isSearchable}
      onChange={(selected: any) => setSelected(selected)}
    />
  );
}

export default Dropdown;
