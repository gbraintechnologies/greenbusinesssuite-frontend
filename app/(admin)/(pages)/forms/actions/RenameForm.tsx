import React, { useState } from "react";

//
import { useQueryClient } from "@tanstack/react-query";

//
import FormPreviewIcon from "@/public/icons/FormPreviewIcon";
import { toast } from "sonner";

//
import services from "@/services";

function RenameForm({ setShow, form }: any) {
  const queryClient = useQueryClient();

  const [name, setName] = useState(form?.name);
  const [loading, setLoading] = useState(false);

  //

  const rename = () => {
    setLoading(true);

    services
      .renameForm(form.id, name)
      .then((res) => {
        setLoading(false);
        console.log("renaming form", res);
        toast.dismiss();
        toast.success("Form renamed!");
        queryClient.invalidateQueries({
          queryKey: ["all forms"],
        });
        setShow(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.dismiss();
        toast.error("Error renaming form. Please try again");
        console.log("error ", e);
      });
  };

  return (
    <div>
      <div className="flex mx-40 my-5 bg-gradient-to-r from-indigo-200 to-pink-400 items-center justify-center  h-[12rem] rounded-lg">
        <FormPreviewIcon />
      </div>

      <div className="my-5 mx-5">
        <label className="text-gray-400 block text-sm mb-3">Rename form</label>
        <input
          className="block focus:outline-[#16A34A] border border-gray-300 px-3 py-2 rounded-lg w-full"
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
        <button
          onClick={() => setShow(false)}
          className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          className="bg-primary-green disabled:bg-gray-500 disabled:cursor-not-allowed py-3 shadow-md flex text-white text-sm px-6 hover:opacity-95 items-center gap-2 rounded-xl"
          onClick={rename}
        >
          {loading ? "Please wait.." : "Confirm"}
        </button>
      </div>
    </div>
  );
}

export default RenameForm;
