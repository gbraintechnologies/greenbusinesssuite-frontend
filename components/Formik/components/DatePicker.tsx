"use client";

import React from "react";

import { DatePicker as NextUIDatePicker } from "@heroui/react";

//
import { Field } from "formik";

// form helpers
import { RequiredMarker, ShowError } from "../formHelpers";
import { toast } from "sonner";

function DatePicker(props: any) {
  const { label, name, isRequired, isDisabled, style, ...rest } = props;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const dd = String(today.getDate()).padStart(2, "0");

  const todayStr = `${yyyy}-${mm}-${dd}`;

  // Get 120 years ago
  const past = new Date();
  past.setFullYear(today.getFullYear() - 120);
  const yyyyPast = past.getFullYear();
  const mmPast = String(past.getMonth() + 1).padStart(2, "0");
  const ddPast = String(past.getDate()).padStart(2, "0");

  const pastStr = `${yyyyPast}-${mmPast}-${ddPast}`;

  return (
    <div className="holderStyle">
      <label htmlFor={name} className="labelStyle">
        {label} {isRequired && <RequiredMarker />}
      </label>
      <Field name={name}>
        {({ form, field }: { form: any; field: any }) => {
          const { setFieldValue } = form;
          const { value } = field;

          return (
            <input
              id={name}
              name={name}
              min={pastStr}
              max={todayStr}
              value={value}
              style={style}
              onChange={(e) => {
                // const selectedDate = new Date(e.target.value);
                // if (
                //   selectedDate > new Date() ||
                //   selectedDate <
                //     new Date(
                //       new Date().setFullYear(new Date().getFullYear() - 120)
                //     )
                // ) {
                //   toast.error("Invalid date. Please enter a valid date");
                //   e.target.value = ""; // or reset to a valid date
                //   return;
                // }
                setFieldValue(name, e.target.value);
              }}
              className="border  h-[41.5px] px-4 uppercase rounded-lg border-gray-300 inputStyle"
              type="date"
              disabled={isDisabled}
              {...rest}
            />
            // <NextUIDatePicker
            //   value={value}
            //   className="border rounded-lg bg-white bg-opacity-0"
            //   onChange={(val: any) => setFieldValue(name, val)}
            //   showMonthAndYearPickers
            //   // maxValue={today(getLocalTimeZone())}
            //   // variant="bordered"
            // />
          );
        }}
      </Field>
      <ShowError name={name} />
    </div>
  );
}

export default DatePicker;
