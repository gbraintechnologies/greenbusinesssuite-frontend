import services from "@/services";
import { useQuery } from "@tanstack/react-query";

//
import React, { useEffect } from "react";

// components
import NoDocuments from "@/components/DocumentComponents/NoDocuments";
import DocumentCard from "@/components/DocumentComponents/DocumentCard";
import DocumentSkeleton from "@//components/DocumentComponents/DocumentSkeleton";

function Uploaded({ user, form }: any) {
  const {
    data: uploaded,
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
      {(uploaded == undefined || uploaded?.length === 0) && (
        <NoDocuments
          text={`${user?.first_name} hasn't uploaded any files for this form`}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {uploaded &&
          uploaded?.map((document: any) => {
            return <DocumentCard document={document} key={document?.id} />;
          })}
      </div>
    </div>
  );
}

export default Uploaded;
