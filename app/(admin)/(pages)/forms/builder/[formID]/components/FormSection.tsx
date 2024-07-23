"use state";

import React, { useEffect, useState } from "react";

// icons
import { CiCircleInfo } from "react-icons/ci";

// components
import FormField from "./FormField";

import FormElementSelector from "./FormElementSelector";
import useForm from "@/hooks/useForm";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

function FormSection({ section, refetch }: any) {
  const { form } = useForm();

  const { data: formStatusCount } = useQuery({
    queryKey: ["Get forms status count"],
    queryFn: services.getFormStatusCountById(Number(form?.id)),
    enabled: Boolean(form?.id),
  });

  //
  let [localSection, setLocalSection] = useState(section);

  // update local copy if changes are made
  useEffect(() => {
    setLocalSection(section);
  }, [section]);

  const runUpdates = () => {
    // dont update if the name or description is blank
    if (
      localSection?.name?.length !== 0 ||
      localSection?.description?.length !== 0
    ) {
      updateSection(localSection);
    }
  };

  const { removeSection, updateSection } = useForm();

  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = () => {
    removeSection(section);
  };

  return (
    <div
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      className="form-section"
    >
      <h5 className="font-bold text-lg">
        {" "}
        <input
          value={localSection?.name}
          placeholder="Section title"
          className="outline-none focus:outline-none w-full input-custom"
          onBlur={runUpdates}
          onChange={(e) => {
            setLocalSection((prev: any) => ({
              ...prev,
              name: e.target.value,
            }));
          }}
        />
      </h5>
      <p className="font-extralight text-sm mb-5">
        {" "}
        <input
          value={localSection?.description}
          placeholder="Section description"
          className="outline-none focus:outline-none w-full input-custom"
          onBlur={runUpdates}
          onChange={(e) => {
            setLocalSection((prev: any) => ({
              ...prev,
              description: e.target.value,
            }));
          }}
        />
      </p>

      {/* FORM FIELDS */}
      <div className="grid grid-cols-2 gap-5">
        {localSection?.formFields
          ?.filter((item: any) => !item.isDeleted)
          .map((field: any) => {
            return <FormField section={section} field={field} />;
          })}
      </div>

      <div
        className={`${
          localSection.formFields.length === 0
            ? "bg-[#F8FAFC] p-3 my-4 min-h-48  rounded-2xl "
            : " text-center mx-auto mt-5 w-full"
        } flex flex-col items-center justify-center`}
      >
        {localSection.formFields.length == 0 && (
          <div className="mb-10 mx-auto text-center">
            <h4 className="font-bold mb-1">
              Click the button to add new elements
            </h4>
            <p className="text-sm">
              Optimize each section by including only closely related items.
            </p>
          </div>
        )}

        {/* ONLY ALLOW FORMS WITHOUT RESPONSES TO BE EDITED */}
        {formStatusCount && formStatusCount?.totalCount > 0 ? (
          <div className="bg-red-50 p-3 rounded-lg text-lg flex flex-row gap-2">
            <CiCircleInfo size={20} />{" "}
            <p className="text-xs font-light italic">
              No new fields can be added to this form once it has started
              accepting responses.{" "}
            </p>
          </div>
        ) : (
          <FormElementSelector section={section} />
        )}
      </div>

      {/* DELETE ICON */}
      {showDelete && (
        <button
          onClick={handleDelete}
          onMouseEnter={() => setShowDelete(true)}
          className="bg-white hover:bg-red-50 shadow-xl p-3 rounded-lg absolute top-10 -right-5"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.5001 6H3.5"
              stroke="#DC2626"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"
              stroke="#DC2626"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M9.5 11L10 16"
              stroke="#DC2626"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M14.5 11L14 16"
              stroke="#DC2626"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
              stroke="#DC2626"
              stroke-width="1.5"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default FormSection;
