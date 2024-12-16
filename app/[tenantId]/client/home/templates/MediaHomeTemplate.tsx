"use client";
import React from "react";
import MediaCard from "../_components/MediaCard";
import ProfileCard from "../_components/ProfileCard";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import Loader from "@/components/Loader/Loader";
import NoItems from "@/components/NoItems/NoItems";
import { LiaVideoSlashSolid } from "react-icons/lia";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";

function MediaHomeTemplate() {
  // page states for blogs
  const [blogsPage, setBlogsPage] = React.useState(0);

  // limit states for blogs
  const [blogsLimit, setBlogsLimit] = React.useState(4);

  // page states for videos
  const [videosPage, setVideosPage] = React.useState(0);

  // limit states for videos
  const [videosLimit, setVideosLimit] = React.useState(4);

  // page states for ads
  const [adsPage, setAdsPage] = React.useState(0);

  // limit states for ads
  const [adsLimit, setAdsLimit] = React.useState(4);

  const { data: blogs, isLoading: blogsLoading } = useQuery({
    queryKey: ["blogs", blogsPage, blogsLimit],
    queryFn: services.getMediaByType("BLOGS", blogsPage, blogsLimit),
    select: (data) => data.content,
  });

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ["videos", videosPage, videosLimit],
    queryFn: services.getMediaByType("VIDEOS", videosPage, videosLimit),
    select: (data) => data.content,
  });

  const { data: ads, isLoading: adsLoading } = useQuery({
    queryKey: ["ads", adsPage, adsLimit],
    queryFn: services.getMediaByType("ADS", adsPage, adsLimit),
    select: (data) => data.content,
  });

  return (
    <div className="pb-20 grid grid-cols-4 gap-7">
      <div className="col-start-1 col-span-3 ">
        <div className="">
          <div className="w-full">
            <h1 className="text-[#475569] font-semibold text-xl">Blog</h1>
            {blogsLoading ? (
              <Loader text="Loading blogs" />
            ) : blogs?.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 w-full mt-3">
                {blogs?.map((_: any, index: number) => (
                  <React.Fragment key={index}>
                    <MediaCard type={"BLOGS"} media={_} />
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <NoItems
                headerText="No Blogs"
                subtext="There are no blogs matching the specific filter. Try adjusting the filters to find videos."
              />
            )}
            <div className="w-full flex justify-between mt-4">
              <ItemsPerPageSelector
                limit={blogsLimit}
                setLimit={setBlogsLimit}
              />
              <Pagination
                page={blogsPage}
                setPage={setBlogsPage}
                limit={blogsLimit}
                currentData={blogs}
              />
            </div>
          </div>
          <div className="mt-8 mb-4">
            <div className="flex justify-between items-center">
              <h1 className="text-[#475569] font-semibold text-xl">Videos</h1>
            </div>
            {videosLoading ? (
              <Loader text="Loading videos" />
            ) : videos?.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 w-full mt-3">
                {videos?.map((_: any, index: number) => (
                  <React.Fragment key={index}>
                    <MediaCard type={"VIDEOS"} media={_} />
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <NoItems
                headerText="No Videos"
                subtext="There are no videos matching the specific filter. Try adjusting the filters to find videos."
                icon={<LiaVideoSlashSolid size={30} />}
              />
            )}
            <div className="w-full flex justify-between mt-4">
              <ItemsPerPageSelector
                limit={videosLimit}
                setLimit={setVideosLimit}
              />
              <Pagination
                page={videosPage}
                setPage={setVideosPage}
                limit={videosLimit}
                currentData={videos}
              />
            </div>
          </div>
        </div>
      </div>
      <div className=" col-start-4 ">
        {/* <div className="pb-16 border-b border-[#E2E8F0]">
          <ProfileCard />
        </div> */}

        <div className="">
          <div className="flex items-center justify-between">
            <h1 className="text-slate-900 font-semibold text-xl">Ads</h1>
            <ItemsPerPageSelector
              limit={videosLimit}
              setLimit={setVideosLimit}
            />
          </div>
          {adsLoading ? (
            <Loader text="Loading ads" />
          ) : ads?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 w-full mt-3">
              {ads?.map((_: any, index: number) => (
                <React.Fragment key={index}>
                  <MediaCard type={"ADS"} media={_} />
                </React.Fragment>
              ))}
            </div>
          ) : (
            <NoItems
              headerText="No Ads"
              subtext="There are no ads matching the specific filter. Try adjusting the filters to find videos."
            />
          )}
        </div>
        <Pagination
          page={videosPage}
          setPage={setVideosPage}
          limit={videosLimit}
          currentData={videos}
        />
      </div>
    </div>
  );
}

export default MediaHomeTemplate;
