import React, { useState } from "react";

//
import services from "@/services";

//
import { useQueryClient } from "@tanstack/react-query";

// toast
import toast from "react-hot-toast";
import useForm from "@/hooks/useForm";

function PublishFormButton({ form }: any) {
  const queryClient = useQueryClient();

  const { selectForm } = useForm();

  const [loading, setLoading] = useState(false);

  const publishForm = () => {
    toast.loading(`Publishing ${form.name}`);
    setLoading(true);
    // TODO: CHECK FOR COMPANY ASSIGNMENT

    // assigning all to "Amazon" company
    let url = `${window.location.origin}/invite?f=${form?.id}&c=Amazon`;

    // update form with url then publish
    services
      .updateForm({
        ...form,
        updatedOn: new Date(),
        url: url,
        publishStatus: "PUBLISHED",
      })
      .then((res) => {
        selectForm(res.data);
        queryClient.invalidateQueries({
          queryKey: ["form", form?.id],
        });

        // PUBLISH FORM
        services
          .publishForm(form?.id)
          .then((res) => {
            selectForm(res.data);
            toast.dismiss();
            toast.success("Form published!");
            setLoading(false);
          })
          .catch((e) => {
            toast.dismiss();
            console.log("error publishing form", e);
            // toast.error("Error publishing form");
          });
      })
      .catch((e) => {
        toast.dismiss();
        toast.error("Error occured");
      });
  };

  const unpublishForm = () => {
    setLoading(true);
    //
    toast.loading(`Unpublishing ${form.name}`);
    services
      .unpublishForm(form?.id)
      .then((res) => {
        toast.dismiss();

        // get updated form
        services
          .getFormByIdRaw(form.id)
          .then((res) => {
            selectForm(res.data);
            setLoading(false);
            queryClient.invalidateQueries({
              queryKey: ["form", form?.id],
            });
          })
          .catch((e) => {
            console.log("error getting updated form");
          });

        console.log("res", res);
        toast.success("Form unpublished!");
      })
      .catch((e) => {
        toast.dismiss();

        toast.error("Error publishing form");
      });
  };

  return (
    <div>
      {form?.publishStatus?.toLowerCase() === "published" ? (
        <button
          disabled={loading}
          onClick={unpublishForm}
          className="bg-primary-red disabled:opacity-80 text-white text-sm py-2 px-3 rounded-lg"
        >
          Unpublish
        </button>
      ) : (
        <button
          disabled={loading}
          onClick={publishForm}
          className="bg-primary-green disabled:opacity-80 text-white text-sm py-2 px-3 rounded-lg"
        >
          Publish
        </button>
      )}
    </div>
  );
}

export default PublishFormButton;
