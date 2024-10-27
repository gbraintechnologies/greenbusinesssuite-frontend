import services from "@/services";
import React from "react";

//
import { useQuery, useQueryClient } from "@tanstack/react-query";

//
import { toast } from "sonner";

function DeleteForm({ setShow, id }: any) {
  const queryClient = useQueryClient();

  const { data: formStatusCount, isLoading } = useQuery({
    queryKey: ["Get forms status count"],
    queryFn: services.getFormStatusCountById(Number(id)),
    enabled: Boolean(id),
  });

  const runDelete = () => {
    setShow(false);

    if (formStatusCount && formStatusCount?.totalCount > 0) {
      toast.dismiss();
      toast.error("Deletion reqeust denied", {
        description: "This form has responses and cannot be deleted.",
      });
      return;
    }

    // NO RESPONSES SO DELETE
    services
      .hardDeleteForm(id)
      .then((res) => {
        toast.dismiss();
        setShow(false);
        toast.success("Form deleted");
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
          Deleting this form would completely remove it from your form list and
          cannot be recovered
        </p>

        <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
          <button
            onClick={() => setShow(false)}
            className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            className="bg-primary-red py-3 disabled:opacity-90 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
            onClick={() => {
              runDelete();
            }}
          >
            {isLoading ? "Hold on..." : " Yes, delete form"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteForm;
