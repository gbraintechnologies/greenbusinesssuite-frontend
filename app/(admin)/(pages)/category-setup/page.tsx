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
    queryFn: services.getAllSpecificCategories,
    enabled: !searchTerm, // Only fetch when no search term is provided
  });

  // Query to fetch searched categories
  const { data: searchedCategories, isLoading: isLoadingSearch } = useQuery({
    queryKey: ["searchCategory", searchTerm],
    queryFn: () => services.searchSpecificCategoryByName(searchTerm),
    enabled: !!searchTerm, // Only fetch when there is a search term
  });

  // Determine which data to display (all or searched categories)
  const categoriesToDisplay = searchTerm ? searchedCategories : allCategories;

  return (
    <div className="w-full pb-20">
      <Nav />
      <div className="my-4 flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <h3 className="text-lg font-semibold sm:text-xl">Categories</h3>

        <div className="flex w-full items-center gap-3 sm:mt-0 sm:w-auto">
          <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm sm:w-auto">
            <SearchIcon />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="custom-input input-custom w-full min-w-0 bg-transparent text-sm outline-none focus:outline-none sm:w-56 md:w-64"
              placeholder="Search by category name ..."
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        {isLoadingAllCategories || isLoadingSearch ? (
          <div className="flex min-h-[40vh] w-full items-center justify-center text-center">
            <div className="flex flex-col items-center justify-center gap-3">
              <LoadingIcon />
              <p>Searching for categories</p>
            </div>
          </div>
        ) : categoriesToDisplay?.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-[22px] sm:p-6 lg:grid-cols-3">
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
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 px-4 sm:gap-10">
            <PiEmpty size={60} />
            <p className="max-w-xs text-center text-base font-light sm:text-lg">
              No categories found matching{" "}
              <span className="font-semibold underline underline-offset-4">
                {searchTerm || "your search"}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategorySetup;
