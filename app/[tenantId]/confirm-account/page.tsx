"use client";

import React, { useEffect, use } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import SetupLoader from "@/components/SetupLoader/SetupLoader";
import services from "@/services";
import { toast } from "sonner";

function ConfirmAccount(props: any) {
  const params: any = use(props.params);
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const tenantId = params.tenantId;

  const router = useRouter();

  useEffect(() => {
    if (token) {
      services
        .confirmAccount(token)
        .then((res) => {
          toast.dismiss();
          toast.success("Account confirmed", {
            description:
              "Your account has been confirmed. Please login to continue",
          });
          router.push(`/${tenantId}/auth`);
        })
        .catch((e) => {
          console.log("e", e);
          toast.dismiss();
          toast.error("Error confirming account");
          router.push(`/${tenantId}/auth`);
        });
    }
  }, [token]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <SetupLoader />
    </div>
  );
}

export default ConfirmAccount;
