import React from "react";
import "./index.css";

const Switch = ({ onSwitchChange }: {onSwitchChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) => {
  return (
    <label className="switch-label">
      <input
        type="checkbox"
        className="switch-input"
        onChange={(e) => onSwitchChange(e)}
        // defaultChecked={darkMode}
      />
      <span className="switch-span"></span>
    </label>
  );
};

export default Switch;