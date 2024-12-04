import React from "react";
import "./index.css";

const Switch = ({ onSwitchChange, defaultChecked }: {onSwitchChange: (e: React.ChangeEvent<HTMLInputElement>) => void, defaultChecked?: boolean}) => {
  return (
    <label className="switch-label">
      <input
        type="checkbox"
        className="switch-input"
        onChange={(e) => onSwitchChange(e)}
        defaultChecked={defaultChecked}
      />
      <span className="switch-span"></span>
    </label>
  );
};

export default Switch;