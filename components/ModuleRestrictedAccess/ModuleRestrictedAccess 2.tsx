import React from "react";
import { MdDoNotDisturbAlt } from "react-icons/md";

function ModuleRestrictedAccess({ name }: { name?: string }) {
  return (
    <div className="w-full min-h-[50vh] flex items-center justify-center">
      <div className="flex items-center flex-col gap-4">
        <MdDoNotDisturbAlt size={60} />

        <h2 className="font-semibold text-3xl">Restricted Access</h2>
        <p className="max-w-sm text-center text-gray-600">
          Your company does not have access to the{" "}
          <span className="font-semibold text-black">{name} module. </span>{" "}
          Contact the Logiciel Administrator
        </p>
      </div>
    </div>
  );
}

export default ModuleRestrictedAccess;
