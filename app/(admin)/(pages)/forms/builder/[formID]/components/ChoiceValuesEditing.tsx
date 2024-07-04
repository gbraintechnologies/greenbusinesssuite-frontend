import React from "react";

function ChoiceValuesEditing({ choiceValues, localField }: any) {
  const inputStyle =
    "border border-gray-200 focus:outline-primary-green rounded-lg p-2";

  const labelStyle = "font-light";

  // TODO: DYNAMIC VALUES AND EDITITING FOR CHOICE VALUES

  return (
    <div>
      <h4 className="labelStyle">Choice Values</h4>

      <div className="mt-2 flex flex-col gap-4">
        {localField?.choiceValues?.map((value: any) => {
          return (
            <input
              value={value}
              className={inputStyle}
              // onChange={(e) =>
              //   setLocalField((prev: any) => ({
              //     ...prev,
              //     placeHolder: e.target.value,
              //   }))
              // }
              // onBlur={() => updateActiveField(activeField.section, localField)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ChoiceValuesEditing;
