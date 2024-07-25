"use client";

import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import EmailIcon from "@/public/icons/EmailIcon";

//
import services from "@/services";
import Link from "next/link";

//
import React, { useState } from "react";
import { toast } from "sonner";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("forgot");

  const runAttempt = () => {
    //
    setLoading(true);
    services
      .attemptPasswordReset(email)
      .then((res) => {
        setLoading(false);
        setStatus("sent");
      })
      .catch((e) => {
        setLoading(false);
        toast.error(`Account with email: ${email} not found`);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {status === "forgot" && (
        <div className="w-96 m-auto rounded-md bg-white h-auto shadow-sm px-5 py-2">
          <h1 className="font-semibold text-base text-slate-900 text-left pt-4">
            Forgot password
          </h1>
          <p className="text-[#475569] text-sm mb-2">
            Enter the email address for your account so we can send you reset
            instructions.
          </p>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              runAttempt();
            }}
          >
            <div className="input-holder">
              <label htmlFor="input">Email address</label>
              <input
                value={email}
                required
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
              />
            </div>

            <Link className=" text-[#16A34A] text-sm" href="/client/auth">
              Wait, I remember my password
            </Link>
            <button
              disabled={loading}
              className=" w-full mb-2 bg-[#16A34A] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg py-2 text-sm"
              type="submit"
            >
              {loading ? <LoadingIcon /> : "Send reset instructions"}
            </button>
          </form>
        </div>
      )}

      {status === "sent" && (
        <div className="w-96 m-auto rounded-md bg-white h-auto shadow-sm px-5 py-2">
          <EmailIcon />
          <h1 className="font-semibold mt-5 text-lg">
            Magic link sent to {email}
          </h1>
          <p className="text-[#475569] text-sm mb-5">
            Thank you. If an account exist with your email address, you should
            receive an email address to reset your password.
          </p>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
