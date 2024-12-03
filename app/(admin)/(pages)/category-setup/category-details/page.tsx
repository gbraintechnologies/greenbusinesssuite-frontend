"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegEdit } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";
import { IoArrowBackSharp } from "react-icons/io5";
import CardDescription from "../components/CustomCard";
import { LuPlusCircle } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";


interface Category {
  categoryName: string;
  categoryDescription: string;
  // Add any other fields you expect from the response
}

function CategoryDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const Id = searchParams.get("categoryId");
  const { data, isLoading, isError, error } = useQuery<Category, Error>({
    queryKey: ["category", Id],
    queryFn: services.getCategoryByID(Number(Id)),
    enabled: !!Id,
  });

  if (!data) {
    return <div>No category found</div>;
  }

  return (
    <div className="w-full pb-20">
      <div className="flex items-center px-5 justify-between my-4">
        <div>
          <h3 className="font-semibold text-lg">Category - {data.categoryName}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Link href="" className="bg-white border border-gray-200 flex text-black text-sm px-4 hover:bg-gray-100 hover:opacity-95 items-center gap-2 rounded-xl">
            <FaRegEdit /> Edit
            <div className="border-opacity-50 border-white h-10"></div>
          </Link>
          <div>
            <Link href=""
              className="bg-primary-red flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
            >
              <TiDeleteOutline /> Delete Category
              <div className="border-opacity-50 border-white h-10"></div>
            </Link>

          </div>
        </div>
      </div>
      <div className="px-5">
        <Link
          href="/category-setup"
          className="bg-white border border-gray-200 flex text-black text-sm px-2 hover:bg-gray-100 py-1 hover:opacity-95 items-center gap-2 rounded-xl w-24"
        >
          <IoArrowBackSharp />&nbsp;Back
          <div className="border-opacity-50 border-white h-10"></div>
        </Link>
      </div>
      <div>
        <div className="px-5 mt-5">
          <h3 className="font-semibold text-xl mb-4">Category Details</h3>
        </div>
        <div className="px-5">
          <label className="block mb-1 font-medium text-gray-700">
            Category Name
          </label>
          <p className="text-gray-900 text-sm">
            {data.categoryName}
          </p>
        </div>
        <div className="px-5 mt-5">
          <label className="block mb-1 font-medium text-gray-700">
            Category Description
          </label>
          <p className="text-gray-900 text-sm">
            {data.categoryDescription}
          </p>
        </div>
      </div>
      <div>
        <div className="px-5 mt-7">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-black-400">Category-Specific Modules</h4>
              <p className="text-black-400 text-sm">
                Modules tailor-made for specific categories
              </p>
            </div>
            <Link
              href={`/category-setup/category-details/module/create?catId=${Id}`}
              className="bg-primary-green flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
            >
              <LuPlusCircle />Create new module
              <div className="border-opacity-50 border-white h-10"></div>
            </Link>
          </div>
        </div>


        <div className="p-6 grid grid-cols-3 gap-[22px]">
          <CardDescription
            name="Lending Home Page Template 1"
            description={[
              "Company Admin: Upload and assign documents to users.",
              "Client Portal: View and download assigned documents.",
            ]}
          />
          <CardDescription
            name="Lending Home Page Template 2"
            description={[
              "Company Admin: Upload and assign documents to users.",
              "Client Portal: View and download assigned documents.",
            ]}
          />
          <CardDescription
            name="Lending Home Page Template 3"
            description={[
              "Company Admin: Upload and assign documents to users.",
              "Client Portal: View and download assigned documents.",
            ]}
          />
          <CardDescription
            name="Lending Home Page Template 4"
            description={[
              "Company Admin: Upload and assign documents to users.",
              "Client Portal: View and download assigned documents.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default CategoryDetails;
