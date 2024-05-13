import React from "react";

// service
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

import FormCard from "./UserFormCard";

// components
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

// icons
import EmptyListIcon from "@/public/icons/EmptyListIcon";

function CompletedForms() {
  // TODO: UPDATE AFTER INTEGRATION
  let formID = 37;
  const { data: forms, isLoading: isFormsLoading } = useQuery({
    queryKey: ["form", formID],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
  });

  console.log("forms", forms);

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
            {forms?.data?.length === 0 ? (
              <div className="flex flex-col gap-5 items-center justify-center">
                <EmptyListIcon />
                <p>No Completed Forms</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-5 mt-5">
                {forms &&
                  // forms?.data
                  // TODO: UPDATE AFTER INTEGRATION
                  [forms]
                    ?.filter((form: any) => form.isTemplate !== true)
                    ?.map((form: any) => {
                      return <FormCard key={form.id} form={form} />;
                    })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CompletedForms;
