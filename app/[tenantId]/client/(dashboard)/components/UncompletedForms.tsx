import React from "react";

import FormCard from "./UserFormCard";

// components
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

// icons
import EmptyListIcon from "@/public/icons/EmptyListIcon";

function UnCompletedForms({
  forms,
  isFormsLoading,
}: {
  forms: any;
  isFormsLoading: boolean;
}) {
  return (
    <div>
      <div className="mt-4">
        {isFormsLoading ? (
          <div className="h-[20rem] flex items-center justify-center">
            <div>
              <LoadingIcon />
              <p className="mt-2 text-xs text-gray-500">Fetching all forms</p>
            </div>
          </div>
        ) : (
          // ALL FORMS
          <>
            {forms?.length === 0 ? (
              <div className="flex h-[40vh]  flex-col gap-5 items-center justify-center">
                <EmptyListIcon />
                <p>No incomplete Forms</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-5 mt-5">
                {forms &&
                  forms?.map((form: any) => {
                    return (
                      <FormCard type="uncompleted" key={form.id} form={form} />
                    );
                  })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UnCompletedForms;
