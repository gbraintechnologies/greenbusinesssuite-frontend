"use client";
import React, { useEffect, useState } from "react";
import SearchIcon from "@/public/icons/SearchIcon";
import Nav from "./components/Nav";
import CardDescription from "./components/CustomCard";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { PiEmpty } from "react-icons/pi";

function CategorySetup() {
  const [searchTerm, setSearchTerm] = useState("");

  // Query to fetch all categories
  const { data: allCategories, isLoading: isLoadingAllCategories } = useQuery({
    queryKey: ["all_categories"],
    queryFn: services.getAllCategories,
    enabled: !searchTerm, // Only fetch when no search term is provided
  });

  // Query to fetch searched categories
  const { data: searchedCategories, isLoading: isLoadingSearch } = useQuery({
    queryKey: ["searchCategory", searchTerm],
    queryFn: () => services.searchCtegoryBycategoryName(searchTerm),
    enabled: !!searchTerm, // Only fetch when there is a search term
  });

  // Determine which data to display (all or searched categories)
  const categoriesToDisplay = searchTerm ? searchedCategories : allCategories;

  return (
    <div className="w-full pb-20">
      <Nav />
      <div className="flex items-center px-5 justify-between my-4">
        <h3 className="font-semibold text-xl">Categories</h3>

        <div className="flex items-center gap-3 mt-2">
          <div className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex gap-2 items-center">
            <SearchIcon />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-sm focus:outline-none bg-white custom-input input-custom w-[18vw]"
              placeholder="Search by category name ..."
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        {isLoadingAllCategories || isLoadingSearch ? (
          <div className="flex items-center justify-center text-center w-full  min-h-[40vh]">
            <div className="flex flex-col items-center gap-3 justify-center">
              <LoadingIcon />
              <p>Searching for categories</p>
            </div>
          </div>
        ) : categoriesToDisplay?.length > 0 ? (
          <div className="p-6 grid grid-cols-3 gap-[22px]">
            {categoriesToDisplay.map((item: any) => (
              <Link
                key={item.id}
                href={`/category-setup/category-details?categoryId=${item.id}`}
              >
                <CardDescription
                  name={item.categoryName}
                  description={item.categoryDescription}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center min-h-[40vh] flex-col justify-center gap-10">
            <PiEmpty size={60} />
            <p className="font-light text-lg max-w-xs text-center">
              No categories found matching{" "}
              <span className="font-semibold underline underline-offset-4">
                {searchTerm}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategorySetup;
