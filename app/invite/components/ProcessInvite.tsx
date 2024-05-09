"use client";

import React, { useEffect, useState } from "react";

// hooks
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// logo
import MeshSuiteLogo from "@/public/icons/MeshSuiteLogo";
// icons
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// navigation
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

function ProcessInvite() {
  // hooks
  const { user } = useUser();
  const { auth } = useAuth();

  // params
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("f");
  const companyName = searchParams.get("c");

  const [loading, setLoading] = useState(true);

  // SAVE FORM ID AND COMPANY NAME IN SESSION STORAGE
  useEffect(() => {
    sessionStorage.setItem(
      "form-to-assign",
      JSON.stringify({ formId: formId, companyName: companyName })
    );
  }, [formId, companyName]);

  // PROMPT TO LOGIN / CREATE ACCOUNT TO FILL FORM IF NOT AUTHENTICATED
  if (!Boolean(auth) && !Boolean(user)) {
    return (
      <div className="h-[100vh] w-full flex items-center justify-center bg-[#F1F5F9]">
        <div className="flex -mt-[30vh] items-center text-center justify-center flex-col gap-2">
          <MeshSuiteLogo />

          <h3 className="mt-10 font-bold text-2xl text-primary-dark">
            Create an account / log in
          </h3>

          <p className="max-w-sm text-lg text-primary-dark">
            To access this form you need to login or create your account
          </p>

          <button
            onClick={() =>
              router.push(
                `/client/auth?redirect=invitiation&f=${formId}&c=${companyName}`
              )
            }
            className="bg-[#16A34A] mt-10  disabled:cursor-not-allowed text-white rounded-lg py-3 px-4"
            type="submit"
          >
            Go to authentication
          </button>
        </div>
      </div>
    );
  }

  // GET AND FORM IF AUTHENTICATED

  const { data, isLoading } = useQuery({
    queryKey: ["form", formId],
    queryFn: services.getFormById(formId),
    enabled: Boolean(formId) && Boolean(auth),
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    //
    if (data) {
      // CHECK PUBLISH STATUS: PUBLISH | UNPUBLISHED
      if (data?.publishStatus !== "PUBLISHED") {
        setLoading(false);
        setMessage("Sorry! This form is no longer accessible");
        return;
      }
      // CHECK IF DEADLINE OR DATE IS OVER
      if (data?.deadline !== null) {
        if (new Date() > new Date(data?.deadline)) {
          setLoading(false);
          setMessage("Sorry! This form is no longer accepting new responses");
        }
        return;
      }

      // ASSIGN TO USER UPON LOGIN THEN CLEAR SESSION STORAGE
      services
        .acceptInvite(formId, user?.id, companyName)
        .then((res) => {
          console.log("res", res);
          setLoading(false);
          setMessage(
            "Successfully accepted invitation. Please proceed to your dashboard to fill the form"
          );
        })
        .catch((e: any) => {
          console.log("error accepting form", e);
        });
    }
  }, [data]);

  return (
    <div>
      {loading ? (
        <div className="h-[100vh] w-full flex items-center justify-center bg-[#F1F5F9]">
          <div className="flex -mt-[30vh] items-center text-center justify-center flex-col gap-2">
            <MeshSuiteLogo />

            <h3 className="mt-10 font-bold text-2xl text-primary-dark">
              Processing form invite
            </h3>

            <p className="max-w-sm text-lg text-primary-dark">
              Hang on! We're processing your invite to this form...
            </p>

            <AiOutlineLoading3Quarters
              size={24}
              className="animate-spin mt-10"
            />
          </div>
        </div>
      ) : (
        // DISPLAY MESSAGE
        <div className="h-[100vh] w-full flex items-center justify-center bg-[#F1F5F9]">
          <div className="flex -mt-[30vh] items-center text-center justify-center flex-col gap-2">
            <MeshSuiteLogo />

            <h3 className="mt-10 font-bold text-2xl text-primary-dark">
              {data?.name} form
            </h3>

            <p className="max-w-sm text-lg text-primary-dark">{message}</p>

            <button
              onClick={() => router.push("/client")}
              className="bg-[#16A34A] mt-10  disabled:cursor-not-allowed text-white rounded-lg py-3 px-4"
              type="submit"
            >
              Continue to dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProcessInvite;
