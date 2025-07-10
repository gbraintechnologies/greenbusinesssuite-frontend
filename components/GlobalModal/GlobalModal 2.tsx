"use client";
import { getTenantID } from "@/services/localService";
import { useEffect, useState } from "react";
import { PiSignOutBold } from "react-icons/pi";

const SessionExpiredModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsOpen(true);
    };
    window.addEventListener("sessionExpired", handleSessionExpired);
    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired);
    };
  }, []);

  const logOutAndReset = () => {
    localStorage.clear();
    if (Boolean(getTenantID())) {
      window.location.replace(`/${getTenantID()}`);
    } else {
      window.location.replace("/");
    }
    window.location.reload();
  };

  return isOpen ? (
    <div className="absolute z-[99999999] inset-0 flex items-center justify-center  backdrop-blur-sm bg-black bg-opacity-10">
      <div className="bg-white py-10 mx-5 md:mx-0 max-w-xl border border-gray-200  px-10 md:px-20 rounded-xl shadow-lg text-left">
        <PiSignOutBold size={40} />

        <h2 className="text-2xl font-semibold mt-5">Login to continue.</h2>
        <p className="mt-2 text-gray-600">
          You've been logged out due to prolonged inactivity. Please log back in
          to continue.
        </p>
        <button
          onClick={logOutAndReset}
          className="mt-10 w-full rounded-lg text-white bg-black py-2"
        >
          Log in
        </button>
      </div>
    </div>
  ) : null;
};

export default SessionExpiredModal;
