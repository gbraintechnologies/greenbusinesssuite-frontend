import React from "react";
import { TbPointFilled } from "react-icons/tb";

type Props = {
  moduleName: string;
  companyAdminPortal?: string;
  clientPortal?: string;
  index: string
};
const ModuleCard = ({
  moduleName,
  companyAdminPortal,
  clientPortal,
  index
}: Props) => {
  return (
    <label
      className="rounded-lg bg-[#F8FAFC] py-3 px-6 min-h-36 w-auto cursor-pointer"
      htmlFor={`moduleCard${index}`}
    >
      <div className="flex items-center gap-3">
        <div>
          <input
            type="checkbox"
            className="form-check-input checked:!bg-[#16A34A] !w-4 !h-4"
            id={`moduleCard${index}`}
          />
        </div>
        <p className="text-slate-900 font-medium">{moduleName}</p>
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
