import React, { useState } from "react";

//
import services from "@/services";

//
import { useQuery, useQueryClient } from "@tanstack/react-query";

// toast
import toast from "react-hot-toast";
import useForm from "@/hooks/useForm";
import { lowerCaseNoSpace } from "@/utils/LowerCaseNoSpace/LowerCaseNoSpace";

// components
import Modal from "@/components/Modal/Modal";
import UnpublishForm from "../[formId]/components/UnpublishForm";

function PublishFormButton({
  formID,
  companies,
  setShowUnpublishModal,
  showUnpublishModal,
}: any) {
  const queryClient = useQueryClient();

  const { selectForm } = useForm();

  const { data: form, refetch } = useQuery({
    queryKey: ["form", formID],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
  });

  const [loading, setLoading] = useState(false);

  const publishForm = () => {
    toast.loading(`Publishing ${form.name}`);
    setLoading(true);

    // checking for company assignment
    if (!Boolean(form?.companyName)) {
      toast.error("Assign company to form before publishing");
      return;
    }

    let fullCompanyName = companies?.find(
      (company: any) =>
        lowerCaseNoSpace(company?.company_name) == form?.companyName
    )?.company_name;

    // assigning all to "Amazon" company
    let url = `${window.location.origin}/invite?f=${
      form?.id
    }&c=${lowerCaseNoSpace(fullCompanyName)}`;

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
