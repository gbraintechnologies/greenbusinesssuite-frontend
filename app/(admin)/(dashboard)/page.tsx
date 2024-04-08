"use client";

import useAdmin from "@/hooks/useAdmin";
import React, { useEffect } from "react";

// icons
import { IoIosArrowRoundForward } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

//
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

//
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

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

  // Data
  const { data: companies } = useQuery({
    queryKey: ["all companies"],
    queryFn: services.getAllCompanies(),
  });

  const { data: users } = useQuery({
    queryKey: ["all users"],
    queryFn: services.allUsers(),
  });

  return (
    <div>
      <div className="px-5">
        <h3 className="font-semibold text-xl">Dashboard</h3>

        <div className="grid grid-cols-3 gap-5 mt-10">
          <div className="border rounded-lg border-gray-300 p-5">
            <p>Number of Companies</p>
            <h4 className="text-5xl font-bold mt-2">
              {companies ? (
                companies.length
              ) : (
                <AiOutlineLoading3Quarters size={20} className="animate-spin" />
              )}
            </h4>
            <Link href="/company-setup">
              <button className="mt-4 bg-gray-100 hover:bg-gray-200 text-sm p-2 flex gap-2 items-center rounded-lg">
                See all companies <IoIosArrowRoundForward size={20} />
              </button>
            </Link>
          </div>
          <div className="border rounded-lg border-gray-300 p-5">
            <p>Total Users</p>
            <h4 className="text-5xl font-bold mt-2">
              {users ? (
                users.length
              ) : (
                <AiOutlineLoading3Quarters size={20} className="animate-spin" />
              )}
            </h4>
            <Link href="/usermanagement">
              <button className="mt-4 bg-gray-100 hover:bg-gray-200 text-sm p-2 flex gap-2 items-center rounded-lg">
                Manage users <IoIosArrowRoundForward size={20} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
