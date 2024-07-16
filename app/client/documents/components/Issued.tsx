import useUser from "@/hooks/useUser";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import NoDocuments from "./NoDocuments";
import DocumentCard from "./DocumentCard";
import DocumentSkeleton from "./DocumentSkeleton";

function Issued() {
  // GET ALL FORM DETAILS

  const { user } = useUser();

  // TODO: Get company id from user profile after major changes
  let companyId = 4;

  // completed forms
  const { data: completedForms, isLoading: areCompletedFormsLoading } =
    useQuery({
      queryKey: ["get completed forms by user", user?.id],
      queryFn: services.getCompletedFormsByUserId(user?.id),
      enabled: Boolean(user?.id),
    });

  // console.log("completed forms", completedForms);

  //
  const {
    data: uploaded,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["all user issued docs", user?.id, companyId],
    queryFn: services.getAllIssuedDocs(user?.id, companyId),
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
      {uploaded?.length === 0 && <NoDocuments text="No Issued Documents" />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {uploaded.map((document: any) => {
          return <DocumentCard document={document} key={document?.id} />;
        })}
      </div>
    </div>
  );
}

export default Issued;
