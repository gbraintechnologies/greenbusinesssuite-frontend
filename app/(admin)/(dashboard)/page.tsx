"use client";

import useAdmin from "@/hooks/useAdmin";
import React, { useEffect } from "react";

//
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function Dashboard() {
  const router = useRouter();

  const { admin } = useAdmin();

  useEffect(() => {
    if (admin === null || !Boolean(admin?.access_token)) {
      toast.dismiss();
      toast("Please login to continue");
      router.push("/login");
    }
  }, [admin]);

  return <div></div>;
}

export default Dashboard;
