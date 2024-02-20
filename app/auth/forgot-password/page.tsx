"use client";

import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  return (
    <div className="bg-[#F1F5F9] h-[100vh] w-full flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-lg p-10 -mt-[40vh]">
        <h1 className="font-semibold text-lg">Forgot password</h1>
        <p className="opacity-50 font-light text-sm mt-2 mb-5">
          Enter the email address for your account so we can send you reset
          instructions.
        </p>
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
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
              className="block focus:outline-[#16A34A] border border-gray-300 px-3 py-2 rounded-lg w-full"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
            />
          </div>
          <button
            className="w-full px-4 py-3 hover:bg-opacity-80 rounded-lg bg-[#16A34A] text-white"
            type="submit"
          >
            Send reset instructions
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
