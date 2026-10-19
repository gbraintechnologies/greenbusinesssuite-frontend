import services from "@/services";
import React from "react";

//
import { useQueryClient } from "@tanstack/react-query";

//
import { toast } from "sonner";

function DeleteForm({ setShow, id }: any) {
  const queryClient = useQueryClient();

  const runDelete = () => {
    toast.info("Deleting..");
    services
      .deleteForm(id)
      .then((res) => {
        toast.dismiss();
        setShow(false);
        console.log("deleting", res);
        toast.success("Form deleted", {
          duration: 8000,
          action: {
            label: "Undo",
            onClick: () => {
              services
                .undeleteForm(id)
                .then(() => {
                  toast.success("Form restored");
                  queryClient.invalidateQueries({ queryKey: ["all forms"] });
                })
                .catch(() => toast.error("Could not restore form"));
            },
          },
        });
        queryClient.invalidateQueries({
          queryKey: ["all forms"],
        });
      })
      .catch((e: Error) => {
        toast.dismiss();
        setShow(false);
        // @ts-ignore
        toast.error(e?.response?.data);
        console.log("errror deleting", e);
      });
  };
  return (
    <div>
      {" "}
      <div>
        <p className="px-5 mt-5 text-[#334155]">
          Deleting this form would remove it from your form list. You can undo
          this right after deleting.
        </p>

        <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
          <button
            onClick={() => setShow(false)}
            className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
          >
            Cancel
          </button>
          <button
            className="bg-primary-red py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
            onClick={() => {
              runDelete();
            }}
          >
            Yes, delete form
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteForm;
