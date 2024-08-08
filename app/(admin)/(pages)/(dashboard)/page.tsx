"use client";

import React from "react";

//
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// css
import "./index.css";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";

function Dashboard() {
  // Data
  const { data: companies } = useQuery({
    queryKey: ["all companies"],
    queryFn: services.getAllCompanies(),
  });

  const { data: users } = useQuery({
    queryKey: ["all users"],
    queryFn: services.allUsers(),
  });

  const { data: publishedFormsCount } = useQuery({
    queryKey: ["published forms count"],
    queryFn: services.publishedFormsCount(),
  });

  const { data: unpublishedFormsCount } = useQuery({
    queryKey: ["unpublished forms count"],
    queryFn: services.unpublishedFormsCount(),
  });

  return (
    <div>
      <div className="px-5">
        <h3 className="font-semibold text-xl">Dashboard</h3>

        <div className="stats-holder">
          <div className="stats-section">
            <p>All Companies</p>
            <h4 className="stats-content">{companies?.length}</h4>
          </div>

          {/*  */}
          {/* <div className="border-r border-gray-700 w-2" /> */}
          <div className="stats-section">
            <p>All Users</p>
            <h4 className="stats-content">{users?.length}</h4>
          </div>
          <div className="stats-section">
            <p>Published Forms</p>
            <h4 className="stats-content">{publishedFormsCount}</h4>
          </div>

          <div className="stats-section">
            <p>Unpublished Forms</p>
            <h4 className="stats-content">{unpublishedFormsCount}</h4>
          </div>

          {/*  */}
          {/* <div className="border-r border-gray-700 w-2" /> */}
          {/* <div className="stats-section">
            <p>Number of active users</p>
            <h4 className="stats-content">-</h4>
          </div> */}
        </div>

        {/*  */}
        {/* <div className="stats-holder">
          <div className="stats-section">
            <p>Number of inactive users</p>
            <h4 className="stats-content">-</h4>
          </div>

          <div className="stats-section">
            <p>Number of published forms</p>
            <h4 className="stats-content">{publishedFormsCount}</h4>
          </div>

          <div className="stats-section">
            <p>Number of unpublished forms</p>
            <h4 className="stats-content">{unpublishedFormsCount}</h4>
          </div>
        </div> */}

        {/* TEST TOAST AND REFRESHING TOKEN  */}
        {/* <div className="my-20 flex items-center gap-10">
          <Button
            className="text-white bg-black px-4 py-2 rounded-xl"
            onPress={() => {
              //
              toast.success("Sonner test");
            }}
          >
            Sonner Test
          </Button>

          <Button
            className="text-white bg-primary-dark px-4 py-2 rounded-xl"
            onPress={() => {
              toast.warning("Login to continue", {
                description:
                  "Your session has expired. Please login to continue",
              });
              services.refreshToken();
            }}
          >
            Refresh TOken!
          </Button>
        </div> */}
      </div>
    </div>
  );
}

export default Dashboard;
