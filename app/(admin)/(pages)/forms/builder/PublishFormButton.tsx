import React, { useState } from "react";

//
import services from "@/services";

//
import { useQuery, useQueryClient } from "@tanstack/react-query";

// toast
import { toast } from "sonner";

import { lowerCaseNoSpace } from "@/utils/LowerCaseNoSpace/LowerCaseNoSpace";

// components
import Modal from "@/components/Modal/Modal";
import UnpublishForm from "../[formId]/components/UnpublishForm";

function PublishFormButton({
  formID,
  setShowUnpublishModal,
  showUnpublishModal,
}: any) {
  const queryClient = useQueryClient();

  const { data: form } = useQuery({
    queryKey: ["form", parseInt(formID)],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
  });

  console.log("form", form);

  const [loading, setLoading] = useState(false);

  const publishForm = () => {
    toast.loading(`Publishing ${form?.name}`);
    setLoading(true);

    // checking for company assignment
    if (!Boolean(form?.companyId)) {
      toast.dismiss();
      toast.error("Assign company to form before publishing");
      return;
    }

    // assigning to company
    let url = `${window.location.origin}/invite?f=${form?.id}&c=${form?.companyId}`;

    // update form with url then publish
    services
      .updateForm({
        ...form,
        updatedOn: new Date(),
        url: url,
        publishStatus: "UNPUBLISHED",
      })
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ["form", form?.id],
        });

        // PUBLISH FORM
        services
          .publishForm(form?.id)
          .then((res) => {
            toast.dismiss();
            toast.success("Form published!");
            queryClient.invalidateQueries({
              queryKey: ["form", form?.id],
            });
            setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
            toast.dismiss();
            console.log("error publishing form", e);
            // toast.error("Error publishing form");
          });
      })
      .catch((e) => {
        setLoading(false);
        toast.dismiss();
        toast.error("Error occured");
      });
  };

  return (
    <div>
      {form?.publishStatus?.toLowerCase() === "published" ? (
        <button
          disabled={loading}
          onClick={() => setShowUnpublishModal(true)}
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

      {/* UNPUBLISH MODAL */}
      <Modal
        isOpen={showUnpublishModal}
        setIsOpen={setShowUnpublishModal}
        title={`Unpublish this form `}
      >
        <UnpublishForm
          form={form}
          loading={loading}
          setLoading={setLoading}
          id={form?.id}
          setShow={setShowUnpublishModal}
        />
      </Modal>
    </div>
  );
}

export default PublishFormButton;
