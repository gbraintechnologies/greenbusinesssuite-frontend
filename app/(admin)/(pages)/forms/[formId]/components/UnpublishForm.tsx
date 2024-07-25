"use client";

import services from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

// icons
import { IoCopyOutline } from "react-icons/io5";

function UnpublishForm({ setShow, loading, setLoading, form }: any) {
  //
  const [name, setName] = useState("");

  const queryClient = useQueryClient();

  const unpublishFormAction = () => {
    setLoading(true);
    //
    toast.loading(`Unpublishing ${form.name}`);
    services
      .unpublishForm(form?.id)
      .then((res) => {
        toast.dismiss();
        queryClient.invalidateQueries({
          queryKey: ["form", form?.id],
        });
        setLoading(false);
        setShow(false);
        // get updated form
        // TODO: OLD IMPLEMENTATION when this was  done at builder top nav
        // services
        //   .getFormByIdRaw(form.id)
        //   .then((res) => {
        //     setLoading(false);
        //     queryClient.invalidateQueries({
        //       queryKey: ["form", form?.id],
        //     });
        //   })
        //   .catch((e) => {
        //     setLoading(false);
        //     console.log("error getting updated form");
        //   });

        toast.success("Form unpublished!");
      })
      .catch((e) => {
        setLoading(false);
        toast.dismiss();
        setShow(false);
        toast.error("Error unpublishing form");
      });
  };

  return (
    <div>
      <div className="mb-5 mx-5">
        <p className="font-light mb-5">
          Unpublishing this form will make it inaccessible to any new clients
          who wish to access it.
          <br />
          <br />
          Enter the name of this form to unpublish it
        </p>

        <div className="bg-gray-100 mt-2 mb-5 flex items-center justify-between px-3 py-2 rounded-lg">
          <p>Copy form name</p>{" "}
          <button
            className=""
            onClick={() => {
              navigator.clipboard.writeText(form?.name).then(() => {
                toast.success("Form name copied");
              });
            }}
          >
            <IoCopyOutline size={20} />
          </button>
        </div>
        <label className="text-gray-400 block text-sm mb-2">
          Enter the name of the form to unpublish the form
        </label>
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
          disabled={name.length < 4 || loading}
          className="bg-primary-red disabled:cursor-not-allowed disabled:bg-opacity-70 py-3 shadow-md flex text-white text-sm px-6 hover:opacity-95 items-center gap-2 rounded-xl"
          onClick={() => {
            if (name === form?.name) {
              unpublishFormAction();
            } else {
              toast.error("Names do not match");
            }
          }}
        >
          {loading ? "Please wait" : "Unpublish this form"}
        </button>
      </div>
    </div>
  );
}

export default UnpublishForm;
