"use client";

import useUser from "@/hooks/useUser";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

//
import NoDocuments from "@/components/DocumentComponents/NoDocuments";
import DocumentCard from "@/components/DocumentComponents/DocumentCard";
import DocumentSkeleton from "@/components/DocumentComponents/DocumentSkeleton";

function Uploaded() {
  // GET ALL FORM DETAILS

  const { user } = useUser();
  const {
    data: uploaded,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["all user uploads", user?.id],
    queryFn: services.getAllUserUploads(user?.id),
    enabled: Boolean(user?.id),
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
      {(uploaded == undefined || uploaded?.length === 0) && <NoDocuments />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {uploaded?.map((document: any) => {
          return <DocumentCard document={document} key={document?.id} />;
        })}
      </div>
    </div>
  );
}

export default Uploaded;
