"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaRegEdit } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import CardDescription from "../components/CustomCard";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import services from "@/services";
import { deleteCategoryByID } from "@/services/features/categoryService";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

interface Category {
  categoryName: string;
  categoryDescription: string;
}

function CategoryDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useEffect(() => {
    setCategoryId(searchParams.get("categoryId"));
  }, [searchParams]);

  // Fetch category details
  const { data, error, isLoading } = useQuery<Category, Error>({
    queryKey: ["category", categoryId],
    queryFn: () => services.getCategoryByID(Number(categoryId)),
    enabled: Boolean(categoryId),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  // Delete category mutation
  const { mutate: deleteCategory, status } = useMutation({
    mutationFn: async () => {
      if (!categoryId) throw new Error("Invalid category ID");
      const response = await deleteCategoryByID(Number(categoryId));
      return response.data;
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      router.push("/category-setup");
    },
    onError: () => {
      toast.error("Failed to delete category. Please try again.");
    },
  });

  const { data: allCategories, isLoading: isLoadingAllCategories } = useQuery({
    queryKey: ["all_categories"],
    queryFn: services.getAllCategories,
  });

  const isDeleting = status === "pending";

  // Early returns for edge cases
  if (!categoryId) return <div>No category ID provided</div>;
  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center min-h-[50vh]">
        <LoadingIcon />
      </div>
    );
  if (error) return <div>Error loading category data</div>;
  if (!data) return <div>No category found</div>;

  return (
    <div className="w-full pb-20">
      <div className="flex items-center px-5 justify-between my-4">
        <Link
          href="/category-setup"
          className="bg-white border border-gray-200 flex items-center justify-center text-black text-sm px-2 hover:bg-gray-100 py-1 hover:opacity-95  gap-2 rounded-xl w-24"
        >
          <IoArrowBackSharp /> Back
          <div className="border-opacity-50 border-white h-7"></div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/category-setup/edit-category?categoryId=${categoryId}`}
            className="bg-white border border-gray-200 flex text-black text-sm px-4 hover:bg-gray-100 hover:opacity-95 items-center gap-2 rounded-xl"
          >
            <FaRegEdit /> Edit
            <div className="border-opacity-50 border-white h-10"></div>
          </Link>
          <button
            onClick={() => !isDeleting && deleteCategory()}
            disabled={isDeleting}
            className="bg-primary-red flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
          >
            {isDeleting ? (
              "Deleting..."
            ) : (
              <>
                <TiDeleteOutline /> Delete Category
              </>
            )}
            <div className="border-opacity-50 border-white h-10"></div>
          </button>
        </div>
      </div>

      <div className="px-5 mt-5">
        <h3 className="font-semibold text-xl mb-4">
          {" "}
          Category - {data.categoryName}
        </h3>

        <div className="mt-5">
          <label className="block mb-1 font-medium text-gray-700">
            Category Name
          </label>
          <p className="text-gray-900 text-sm">{data.categoryName}</p>
        </div>
        <div className="mt-5">
          <label className="block mb-1 font-medium text-gray-700">
            Category Description
          </label>
          <p className="text-gray-900 text-sm">{data.categoryDescription}</p>
        </div>
      </div>
      <div className="px-5 mt-7">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-black-400">
              Category-Specific Modules
            </h4>
            <p className="text-black-400 text-sm">
              Modules tailor-made for specific categories
            </p>
          </div>
          <Link
            href={`/category-setup/${categoryId}/create-module`}
            className="bg-primary-green flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
          >
            <IoIosAddCircleOutline /> Create new module
            <div className="border-opacity-50 border-white h-10"></div>
          </Link>
        </div>
        <div className="p-6 grid grid-cols-3 gap-[22px]">
          {isLoadingAllCategories ? (
            <p>Loading...</p>
          ) : allCategories?.length > 0 ? (
            allCategories.map((item: any) => (
              <CardDescription
                key={item.id}
                name={item.categoryName}
                description={[item.categoryDescription]}
              />
            ))
          ) : (
            <p>No categories found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryDetails;
