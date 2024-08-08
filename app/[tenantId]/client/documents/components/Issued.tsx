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

  const [issued, setIssued] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchIssued = async (uniqueCompanyIds: any) => {
    setLoading(true);
    let temp: any = [];
    for (let i = 0; i < uniqueCompanyIds.length; i++) {
      try {
        await services
          .getAllIssuedDocsRaw(user?.id, uniqueCompanyIds[i])
          .then((res) => {
            temp.push(...res.data);
          });
      } catch (e) {
        //
      }
    }

    setIssued(temp);
    setLoading(false);
  };

  // // TODO: Get company id from user profile after major changes

  // // completed forms
  // const { data: completedForms, isLoading: areCompletedFormsLoading } =
  //   useQuery({
  //     queryKey: ["get completed forms by user", user?.id],
  //     queryFn: services.getCompletedFormsByUserId(user?.id),
  //     enabled: Boolean(user?.id),
  //   });

  // // TODO: TEMPORAL WAY OF FETCHING TO GET ALL ISSUED FROM ALL COMPANIES - AFTER MULTITENANCY CHANGE
  // useEffect(() => {
  //   //
  //   if (completedForms?.length > 0) {
  //     setIssued([]);

  //     const uniqueCompanyIds = [
  //       // @ts-ignore
  //       ...new Set(completedForms.map((item: any) => item.companyId)),
  //     ];

  //     fetchIssued(uniqueCompanyIds);
  //   }
  // }, [completedForms, areCompletedFormsLoading]);

  // // TODO: Get companies from user form responses
  // let companyId = 7;

  //
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
      {(issued == undefined || issued?.length === 0) && (
        <NoDocuments text="No Issued Documents" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {issuedDocsForClient &&
          issued?.map((document: any) => {
            return (
              <DocumentCard document={document} key={document?.fileName} />
            );
          })}
      </div>
    </div>
  );
}

export default Issued;
