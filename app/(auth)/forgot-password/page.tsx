"use client";

import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import EmailIcon from "@/public/icons/EmailIcon";

//
import services from "@/services";
import Link from "next/link";

//
import React, { useState } from "react";
import toast from "react-hot-toast";

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
        console.log("res", res);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(`Account with email: ${email} not found`);
      });
  };

  return (
    <div className="bg-[#F1F5F9] h-[100vh] w-full flex items-center justify-center">
      {status === "forgot" && (
        <div className="bg-white rounded-lg max-w-md p-10 -mt-[40vh] shadow-md">
          <h1 className="font-semibold text-lg">Forgot password</h1>
          <p className="opacity-50 font-light text-sm mt-2 mb-5">
            Enter the email address for your account so we can send you reset
            instructions.
          </p>
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              runAttempt();
            }}
          >
            <div>
              <label
                className="block mb-2 text-xs font-light text-gray-400"
                htmlFor="input"
              >
                Email address
              </label>
              <input
                value={email}
                required
                type="email"
                className="block focus:outline-[#16A34A] border border-gray-300 px-3 py-2 rounded-lg w-full"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
              />
            </div>

            <Link className=" text-[#16A34A] text-sm" href="/">
              Wait, I remember my password
            </Link>
            <button
              disabled={loading}
              className="w-full disabled:cursor-not-allowed disabled:opacity-80 px-4 py-3 hover:bg-opacity-80 rounded-lg bg-[#16A34A] text-white"
              type="submit"
            >
              {loading ? <LoadingIcon /> : "Send reset instructions"}
            </button>
          </form>
        </div>
      )}

      {status === "sent" && (
        <div className="bg-white rounded-lg max-w-md p-10 -mt-[30vh] shadow-md">
          <EmailIcon />
          <h1 className="font-semibold mt-5 text-lg">
            Magic link sent to {email}
          </h1>
          <p className="opacity-50 font-light text-sm mt-2 mb-5">
            Thank you. If an account exist with your email address, you should
            receive an email address to reset your password.
          </p>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
