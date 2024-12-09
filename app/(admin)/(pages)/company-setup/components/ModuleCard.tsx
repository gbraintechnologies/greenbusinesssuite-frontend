import React, { ChangeEvent } from "react";
import { TbPointFilled } from "react-icons/tb";

type Props = {
  moduleData: any;
  companyAdminPortal?: string;
  clientPortal?: string;
  defaultChecked?: boolean;
  disableCheckboxes?: boolean;
  index: string;
  onCheckboxChange?: (moduleData: any, isChecked: boolean) => void;
};
const ModuleCard = ({
  moduleData,
  companyAdminPortal,
  clientPortal,
  defaultChecked = false,
  disableCheckboxes = false,
  index,
  onCheckboxChange,
}: Props) => {
  // State to control checkbox
  const [isChecked, setIsChecked] = React.useState(defaultChecked);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked); // Update state

    if (onCheckboxChange) {
      onCheckboxChange(moduleData, newChecked);
    }
  };

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

  //   if (onCheckboxChange) {
  //     onCheckboxChange(moduleData, e.target.checked);
  //   }
  //   console.log('e target checked', e.target.checked)
  // };
  return (
    <label
      className="rounded-lg bg-[#F8FAFC] border border-gray-200 py-3 px-6 min-h-36 w-auto cursor-pointer"
      htmlFor={`moduleCard${index}`}
    >
      <div className="flex !items-center gap-3">
        <input
          type="checkbox"
          className="form-check-input checked:!bg-[#16A34A] disabled:!bg-[#94A3B8] border !border-[#16A34A] !w-4 !h-4 focus:!outline-none focus:!shadow-none focus:!ring-0 focus:!border-none visited:!outline-none"
          id={`moduleCard${index}`}
          onChange={handleChange}
          // defaultValue={defaultChecked}
          // checked={defaultChecked}
          disabled={disableCheckboxes}
          checked={isChecked}
          // disabled={disableCheckboxes}
        />
        <p className="text-slate-900 font-medium">{moduleData?.moduleName}</p>
      </div>
      <div className="mt-1">
        {companyAdminPortal && (
          <div className="text-sm text-[#475569] flex items-start gap-4">
            <div className="pt-1">
              <TbPointFilled color="#475569" size={12} className="" />
            </div>
            <p>Company Admin: {companyAdminPortal} </p>
          </div>
        )}
        {clientPortal && (
          <div className="text-sm text-[#475569] flex items-start gap-4">
            <div className="pt-1">
              <TbPointFilled color="#475569" size={12} className="" />
            </div>
            <p>Client Portal: {clientPortal}</p>
          </div>
        )}
      </div>
    </label>
  );
};

export default ModuleCard;
