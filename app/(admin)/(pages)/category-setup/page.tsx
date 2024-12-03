"use client";
import React, { useEffect, useState } from "react";
import SearchIcon from "@/public/icons/SearchIcon";
import Nav from "./components/Nav";
import CardDescription from "./components/CustomCard";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

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
        {isLoadingAllCategories || isLoadingSearch ? (
          <p>Loading...</p>
        ) : categoriesToDisplay?.length > 0 ? (
          categoriesToDisplay.map((item: any) => (
            <Link
              key={item.id}
              href={`/category-setup/category-details?categoryId=${item.id}`}
            >
              <CardDescription
                name={item.categoryName}
                description={item.categoryDescription}
              />
            </Link>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </div>
    </div>
  );
}

export default CategorySetup;
