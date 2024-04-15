import React from "react";

function Form({ form }: any) {
  let { name, deadline, formSections, layout } = form;
  return (
    <div className="py-10">
      <h3 className="text-2xl font-semibold mx-auto text-center mb-4">
        {name}
      </h3>

      {formSections
        ?.filter((item: any) => !item.isDeleted)
        .map((section: any) => {
          let { description, name, instruction, formFields } = section;
          return (
            <div className="form-section ">
              <h4>{name}</h4>
              <p>{description}</p>

              {/* form fields */}
              {formFields.map((field: any) => {
                let { name, description, label, placeHolder } = field;
                return (
                  <div>
                    <label>{label}</label>
                    <div className="border mb-10 border-gray-300 p-3 rounded-lg">
                      {placeHolder}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

      <button className="btn-outline"> Save Your Response</button>
    </div>
  );
}

export default Form;
