import React from "react";

import Select from "react-select";

//
import "./index.css";

function Dropdown({ options, selected, setSelected, bgColor, disabled=false }: any) {
  return (
    <Select
      className= {`border-0 flex-1 ${bgColor}`}
      isSearchable={true}
      options={options}
      value={selected}
      onChange={(selected: any) => setSelected(selected)}
      isDisabled={disabled}
    />
  );
}

export default Dropdown;
