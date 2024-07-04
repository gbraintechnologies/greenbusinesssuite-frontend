import useForm from "@/hooks/useForm";
import React from "react";

// icons
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosAdd } from "react-icons/io";

function ChoiceValuesEditing({ localField, setLocalField }: any) {
  //
  const { activeField, updateActiveField } = useForm();

  const inputStyle =
    "border border-gray-200  rounded-lg p-2 focus:outline-none flex-1";

  // const labelStyle = "font-light";

  return (
    <div>
      <h4 className="labelStyle">Options</h4>

      <div className="mt-2 w-full flex flex-col gap-4 ">
        {localField?.choiceValues?.map((value: any) => {
          return (
            <div className="flex justify-between items-center w-full gap-2">
              <input
                value={value}
                className={inputStyle}
                onChange={(e) => {
                  // find item and replace in arary
                  let allValues = localField?.choiceValues;

                  let temp = [];
                  for (let i = 0; i < allValues.length; i++) {
                    if (allValues[i] === value) {
                      temp.push(e.target.value);
                    } else {
                      temp.push(allValues[i]);
                    }
                  }
                  // replace full array
                  setLocalField((prev: any) => ({
                    ...prev,
                    choiceValues: temp,
                  }));
                }}
                onBlur={() =>
                  updateActiveField(activeField.section, localField)
                }
              />
              <AiOutlineDelete
                size={20}
                onClick={() => {
                  setLocalField((prev: any) => ({
                    ...prev,
                    choiceValues: localField?.choiceValues.filter(
                      (item: any) => item != value
                    ),
                  }));
                }}
                className="text-red-800 cursor-pointer"
              />
            </div>
          );
        })}
        <button
          onClick={() => {
            setLocalField((prev: any) => ({
              ...prev,
              choiceValues: [
                ...localField?.choiceValues,
                `Option ${localField?.choiceValues?.length + 1}`,
              ],
            }));
          }}
          className="flex items-center text-gray-600 border border-dashed p-2 text-sm w-[90%] justify-center rounded-lg"
        >
          {" "}
          <IoIosAdd size={20} />
          Add option
        </button>{" "}
      </div>
    </div>
  );
}

export default ChoiceValuesEditing;
