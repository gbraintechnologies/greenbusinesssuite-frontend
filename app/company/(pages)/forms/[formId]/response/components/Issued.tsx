import services from "@/services";
import { useQuery } from "@tanstack/react-query";

//
import React, { useEffect } from "react";

// components
import NoDocuments from "@/components/DocumentComponents/NoDocuments";
import DocumentCard from "@/components/DocumentComponents/DocumentCard";
import DocumentSkeleton from "@//components/DocumentComponents/DocumentSkeleton";

// nextui

import { Button } from "@nextui-org/button";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import UploadFileToIssue from "./UploadFileToIssue";

function Issued({ user, form }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    data: issuedFiles,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["all user issued docs by formId", user?.id, form?.id],
    queryFn: services.getUserUploadedDocsByFormId(user?.id, form?.id),
    enabled: Boolean(user?.id) && Boolean(form?.id),
  });

  useEffect(() => {
    refetch();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-10">
        <DocumentSkeleton />
        <DocumentSkeleton />
        <DocumentSkeleton />
        <DocumentSkeleton />
      </div>
    );
  }

  return (
    <div>
      {(issuedFiles == undefined || issuedFiles?.length === 0) && (
        <NoDocuments
          text={`No files have been issued to ${user?.first_name} for this form`}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
        {issuedFiles &&
          issuedFiles?.map((document: any) => {
            return <DocumentCard document={document} key={document?.id} />;
          })}
      </div>

      {/* Issue a new file */}

      <Button
        className="bg-black rounded-lg text-sm text-white"
        onPress={onOpen}
      >
        Issue new file (s)
      </Button>
      <Modal
        size="xl"
        backdrop="opaque"
        className="bg-white rounded-lg p-5"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop: "bg-black bg-opacity-20 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Issue File(s) to client
              </ModalHeader>
              <ModalBody>
                <UploadFileToIssue
                  refetch={refetch}
                  onClose={onClose}
                  formId={form?.id}
                  userId={user?.id}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Issued;
