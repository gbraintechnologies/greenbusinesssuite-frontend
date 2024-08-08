"use client";

import useUser from "@/hooks/useUser";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

// components
import NoDocuments from "@/components/DocumentComponents/NoDocuments";
import DocumentCard from "@/components/DocumentComponents/DocumentCard";
import DocumentSkeleton from "@/components/DocumentComponents/DocumentSkeleton";

// hooks
import useAuth from "@/hooks/useAuth";

function Issued() {
  // GET ALL FORM DETAILS

  const { user } = useUser();

  const { auth } = useAuth();

  const {
    data: issuedDocsForClient,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all user issued docs for client", user?.id, auth?.company_id],
    queryFn: services.getAllIssuedDocs(user?.id, auth?.company_id),
    enabled: Boolean(user?.id),
  });

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) {
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
      {(issuedDocsForClient == undefined ||
        issuedDocsForClient?.length === 0) && (
        <NoDocuments text="No Issued Documents" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {issuedDocsForClient &&
          issuedDocsForClient?.map((document: any) => {
            return (
              <DocumentCard document={document} key={document?.fileName} />
            );
          })}
      </div>
    </div>
  );
}

export default Issued;
