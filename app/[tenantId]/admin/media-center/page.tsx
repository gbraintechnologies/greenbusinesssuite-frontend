"use client";

import React, { useEffect, useState } from "react";
import Nav from "./component/Nav";
import SearchIcon from "@/public/icons/SearchIcon";
import BlogCard from "./component/BlogCard";
import VideoCard from "./component/VideoCard";
import AdCard from "./component/AdCard";
import DatePicker from "@/components/DatePicker/DatePicker";
import { TimelineType, TimelineValues } from "@/types";
import Tabs from "@/components/Tabs/Tabs";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import { searchMedia } from "@/services/features/mediaService";
import Loader from "@/components/Loader/Loader";

interface MediaItem {
  id: number;
  mediaType: string;
  thumbnail: string;
  altText: string;
  heading: string;
  url: string;
  isActive: boolean;
  createdOn: string;
  updatedOn: string;
}

interface MediaData {
  content: MediaItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

function MediaCenter({ params }: any) {
  const tenantId = params.tenantId;
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [selectedTimeline, setSelectedTimeline] = useState<
    | {
        label: TimelineValues;
        value: TimelineType;
      }
    | undefined
  >();

  const filters: {
    id: number;
    name: string;
    value: "BLOGS" | "VIDEOS" | "ADS";
  }[] = [
    { id: 1, name: "Blogs", value: "BLOGS" },
    { id: 2, name: "Videos", value: "VIDEOS" },
    { id: 3, name: "Ads", value: "ADS" },
  ];

  const [activeFilter, setActiveFilter] = useState<{
    id: number;
    name: string;
    value: "BLOGS" | "VIDEOS" | "ADS";
  }>(filters[0]);

  const { data, isLoading, refetch } = useQuery<MediaData>({
    queryKey: [
      "SpecificMediaType",
      activeFilter.value,
      page,
      size,
      selectedTimeline?.value,
      searchTerm,
    ],
    queryFn: async () => {
      const rawData = searchTerm
        ? await searchMedia(searchTerm, activeFilter.value) // Fetch filtered data
        : await services.filterMediaByTimeline(
            activeFilter.value,
            selectedTimeline?.value ?? "ALL",
            page,
            size
          )();

      // Client-side fallback for case-insensitive/partial match
      if (searchTerm) {
        const filteredData = rawData.content.filter((item: MediaItem) =>
          item.heading.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return { ...rawData, content: filteredData }; // Return filtered data
      }

      return rawData;
    },
    enabled: true,
  });

  useEffect(() => {
    refetch();
  }, [page, size, activeFilter.value, selectedTimeline, searchTerm, refetch]);

  const handleFilterChange = (filter: any) => {
    setActiveFilter({
      ...filter,
      value: filter.value.toUpperCase(),
    });
  };

  return (
    <div className="px-5 pb-10 mt-10">
      <Nav tenantId={tenantId} />
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center justify-between my-4">
          <Tabs
            filters={filters}
            setActiveFilter={handleFilterChange}
            activeFilter={activeFilter}
          />
        </div>
        <div className="flex gap-2 items-center">
          <div className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex gap-2 items-center">
            <SearchIcon />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-sm focus:outline-none bg-white custom-input input-custom"
              placeholder="Search"
            />
          </div>
          <DatePicker
            selectedTimeline={selectedTimeline}
            setSelectedTimeline={setSelectedTimeline}
          />
        </div>
      </div>

      <div className="min-h-[40vh]">
        <h3 className="font-semibold mb-8 text-lg">{activeFilter?.name}</h3>
        {isLoading && (
          <div className="border border-gray-100 rounded-xl min-h-[30vh] flex items-center justify-center">
            <Loader text={`Loading ${activeFilter.name}`} />
          </div>
        )}
        {activeFilter.value === "BLOGS" && (
          <>
            {data?.content?.length === 0 ? (
              <p className="text-gray-500 text-center col-span-4">No Blogs</p>
            ) : (
              <div className="grid grid-cols-4 gap-5">
                {data?.content?.map((item: MediaItem) => (
                  <BlogCard
                    key={item.id}
                    blog={item}
                    tenantId={tenantId}
                    refetchData={refetch}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeFilter.value === "VIDEOS" && (
          <>
            {data?.content?.length === 0 ? (
              <p className="text-gray-500 text-center col-span-4">No Videos</p>
            ) : (
              <div className="grid grid-cols-4 gap-5">
                {data?.content?.map((item: MediaItem) => (
                  <VideoCard
                    key={item.id}
                    video={item}
                    tenantId={tenantId}
                    refetchData={refetch}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeFilter.value === "ADS" && (
          <>
            {data?.content?.length === 0 ? (
              <p className="text-gray-500 text-center col-span-4">No Ads</p>
            ) : (
              <div className="grid grid-cols-4 gap-5">
                {data?.content?.map((item: MediaItem) => (
                  <AdCard
                    key={item.id}
                    ad={item}
                    tenantId={tenantId}
                    refetchData={refetch}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex items-center mt-10 justify-between">
        <ItemsPerPageSelector limit={size} setLimit={setSize} />
        <Pagination
          limit={size}
          variant="no-text"
          page={page}
          currentData={data?.content ?? []}
          setPage={setPage}
        />
      </div>
    </div>
  );
}

export default MediaCenter;
