"use client";
import React, { useState } from "react";
import SearchIcon from "@/public/icons/SearchIcon";
import Nav from "./components/Nav";
import CardDescription from "./components/CustomCard";

function CategorySetup() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full pb-20">
      <Nav />
      <div className="flex items-center px-5 justify-between my-4">
        <div>
          <h3 className="font-semibold text-lg">Categories</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex gap-2 items-center">
            <SearchIcon />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-sm focus:outline-none bg-white custom-input input-custom"
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-3 gap-[22px]">
        <CardDescription
          name="Micro-lending"
          description="This category is for companies that provide micro lending services."
        />
        <CardDescription
          name="Business Consultancy"
          description="This category is for companies that provide Business Consultancy such as business registration."
        />
        <CardDescription
          name="Agri/agrobusiness Programs"
          description="This category is for companies that provide Agri/agrobusiness Programs services."
        />
        <CardDescription
          name="Business Association"
          description="This category is for companies that provide Business Association services."
        />
      </div>
    </div>
  );
}

export default CategorySetup;
