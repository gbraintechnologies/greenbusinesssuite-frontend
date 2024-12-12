"use client";

import React, { useState } from "react";
import Nav from "../component/Nav";
import SearchIcon from "@/public/icons/SearchIcon";
import BlogCard from "../component/BlogCard";
import DatePicker from "@/components/DatePicker/DatePicker";
import { TimelineType, TimelineValues } from "@/types";
import Tabs from "@/components/Tabs/Tabs";
import VideoCard from "../component/VideoCard";
import AdCard from "../component/AdCard";

function MediaCenter({ params }: any) {
  const tenantId = params.tenantId;
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedTimeline, setSelectedTimeline] = useState<
    { label: TimelineValues; value: TimelineType } | undefined
  >();

  const [filters, setFilters] = useState([
    { id: 1, name: "Blogs", value: "Blogs" },
    { id: 2, name: "Videos", value: "Videos" },
    { id: 3, name: "Ads", value: "Ads" },
  ]);

  const [activeFilter, setActiveFilter] = useState({
    id: 1,
    name: "Blogs",
    value: "Blogs",
  });
  const [activeRoleFilter, setActiveRoleFilter] = useState([]);

  const blogData = [
    {
      id: 1,
      title: "First Blog",
      updatedOn: "August 17,2024",
      url: "https://example.com/blog1",
      description: "This is the first blog description.",
      createdCount: 2,
      imageUrl: "https://via.placeholder.com/600x400?text=First+Blog",
    },
    {
      id: 2,
      title: "Second Blog",
      updatedOn: "August 17,2024",
      url: "https://example.com/blog2",
      description: "This is the second blog description.",
      createdCount: 4,
      imageUrl: "https://via.placeholder.com/600x400?text=Second+Blog",
    },
    {
      id: 3,
      title: "Third Blog",
      updatedOn: "August 17,2024",
      url: "https://example.com/blog3",
      description: "This is the third blog description.",
      createdCount: 1,
      imageUrl: "https://via.placeholder.com/600x400?text=Third+Blog",
    },
    {
      id: 4,
      title: "Fourth Blog",
      updatedOn: "August 17,2024",
      url: "https://example.com/blog4",
      description: "This is the fourth blog description.",
      createdCount: 3,
      imageUrl: "https://via.placeholder.com/600x400?text=Fourth+Blog",
    },
  ];

  const videoData = [
    {
      id: 1,
      title: "Introduction to React",
      updatedOn: "2024-12-01",
      url: "https://www.example.com/video1",
      description: "A comprehensive guide to React for beginners.",
      createdCount: 1023,
      thumbnailUrl: "https://www.example.com/thumbnails/react-thumbnail.jpg",
    },
    {
      id: 2,
      title: "Advanced JavaScript Techniques",
      updatedOn: "2024-12-05",
      url: "https://www.example.com/video2",
      description: "Deep dive into advanced JavaScript concepts.",
      createdCount: 324,
      thumbnailUrl: "https://www.example.com/thumbnails/js-thumbnail.jpg",
    },
    {
      id: 3,
      title: "Building Full Stack Applications",
      updatedOn: "2024-12-10",
      url: "https://www.example.com/video3",
      description: "Learn how to build full-stack applications with Node.js and React.",
      createdCount: 431,
      thumbnailUrl: "https://www.example.com/thumbnails/fullstack-thumbnail.jpg",
    },
  ];

  const adData = [
    {
      id: 1,
      title: "Holiday Sale - 50% Off",
      updatedOn: "2024-12-05",
      url: "https://www.example.com/ad1",
      description: "Huge discounts on our products. Limited time offer!",
      createdCount: 874,
      thumbnailUrl: "https://www.example.com/thumbnails/holiday-sale.jpg",
    },
    {
      id: 2,
      title: "New Year Giveaway",
      updatedOn: "2024-12-08",
      url: "https://www.example.com/ad2",
      description: "Enter our giveaway for a chance to win amazing prizes!",
      createdCount: 215,
      thumbnailUrl: "https://www.example.com/thumbnails/giveaway-ad.jpg",
    },
    {
      id: 3,
      title: "Best Fitness Equipment",
      updatedOn: "2024-12-10",
      url: "https://www.example.com/ad3",
      description: "Get in shape with the best fitness gear at unbeatable prices.",
      createdCount: 102,
      thumbnailUrl: "https://www.example.com/thumbnails/fitness-ad.jpg",
    },
  ];

  const handleFilterChange = (filter: any) => {
    setActiveFilter(filter);
  };

  return (
    <div className="px-5 pb-10 mt-10">
      <Nav tenantId={tenantId} />
      <div className="flex items-center justify-between">
        <div className="flex items-center px-5 justify-between my-4">
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

      {/* Conditional Rendering Based on Active Filter */}
      {activeFilter.value === "Blogs" && (
        <>
          <h3 className="font-semibold mb-8 mt-10 text-lg">Blogs</h3>
          <div className="grid grid-cols-4 gap-5">
            {blogData.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </>
      )}

      {activeFilter.value === "Videos" && (
        <>
          <h3 className="font-semibold mb-8 mt-10 text-lg">Videos</h3>
          <div className="grid grid-cols-4 gap-5">
            {videoData.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </>
      )}

      {activeFilter.value === "Ads" && (
        <>
          <h3 className="font-semibold mb-8 mt-10 text-lg">Ads</h3>
          <div className="grid grid-cols-4 gap-5">
            {adData.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MediaCenter;
