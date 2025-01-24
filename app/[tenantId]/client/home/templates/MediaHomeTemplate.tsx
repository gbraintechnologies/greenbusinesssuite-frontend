"use client";
import React from "react";
import MediaCard from "../_components/MediaCard";
// import ProfileCard from "../_components/ProfileCard";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import Loader from "@/components/Loader/Loader";
import NoItems from "@/components/NoItems/NoItems";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import { AiFillFileExclamation } from "react-icons/ai";
import { TbCameraExclamation } from "react-icons/tb";
import clsx from "clsx";
import useUser from "@/hooks/useUser";
import ProfileCompleteness from "../../settings/business-profile/_components/ProfileCompleteness";
import ProfileCard from "../_components/ProfileCard";

function MediaHomeTemplate({ search }: { search: string }) {
  const { user } = useUser();

  // page states for blogs
  const [blogsPage, setBlogsPage] = React.useState(0);

  // limit states for blogs
  const [blogsLimit, setBlogsLimit] = React.useState(8);

  // page states for videos
  const [videosPage, setVideosPage] = React.useState(0);

  // limit states for videos
  const [videosLimit, setVideosLimit] = React.useState(8);

  // page states for ads
  const [adsPage, setAdsPage] = React.useState(0);

  // limit states for ads
  const [adsLimit, setAdsLimit] = React.useState(4);

  const { data: blogs, isLoading: blogsLoading } = useQuery({
    queryKey: ["blogs", blogsPage, blogsLimit],
    queryFn: services.getMediaByType("BLOGS", blogsPage, blogsLimit),
    select: (data) => data.content.filter((blog: any) => blog.isActive),
    enabled: !Boolean(search),
  });

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ["videos", videosPage, videosLimit],
    queryFn: services.getMediaByType("VIDEOS", videosPage, videosLimit),
    select: (data) => data.content.filter((video: any) => video.isActive),
    enabled: !Boolean(search),
  });

  const { data: ads, isLoading: adsLoading } = useQuery({
    queryKey: ["ads", adsPage, adsLimit],
    queryFn: services.getMediaByType("ADS", adsPage, adsLimit),
    select: (data) => data.content.filter((ad: any) => ad.isActive),
    enabled: !Boolean(search),
  });

  const { data: filteredMedia, isLoading: filteredMediaLoading } = useQuery({
    queryKey: ["filteredMedia", search],
    queryFn: services.getFilteredMedia(search),
    enabled: Boolean(search),
    select: (data) => data.filter((media: any) => media.isActive),
  });

  const [blogData, setBlogData] = React.useState([]);

  const [videoData, setVideoData] = React.useState([]);

  const [adData, setAdData] = React.useState([]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["business profile", user?.id],
    queryFn: services.getBusinessProfileOfUser(user?.id),
    enabled: Boolean(user?.id),
  });

  // set blog data, video data and ad data states based on search term and media data
  React.useEffect(() => {
    // select filtered media based on search term
    if (search) {
      // filter media based on media type
      const filteredBlogs = filteredMedia?.filter(
        (item: any) => item.mediaType === "BLOGS"
      );
      const filteredVideos = filteredMedia?.filter(
        (item: any) => item.mediaType === "VIDEOS"
      );
      const filteredAds = filteredMedia?.filter(
        (item: any) => item.mediaType === "ADS"
      );

      setBlogData(filteredBlogs);
      setVideoData(filteredVideos);
      setAdData(filteredAds);
    } else {
      // set blog data, video data and ad data based on media data
      blogs && setBlogData(blogs);
      videos && setVideoData(videos);
      ads && setAdData(ads);
    }
  }, [blogs, videos, ads, search, filteredMedia]);

  return (
    <div className="pb-20 grid grid-cols-4 gap-7">
      <div className="col-start-1 col-span-3 ">
        <div className="">
          {/* BLOGS */}
          <div
            className={clsx(
              blogData?.length < 1 &&
                !(blogsLoading || filteredMediaLoading || search)
                ? "hidden"
                : "block mb-8",
              `w-full`
            )}
          >
            {blogData && Boolean(blogData?.length) && (
              <h1 className="text-[#475569] font-semibold text-xl">News</h1>
            )}
            {blogsLoading || filteredMediaLoading ? (
              // <Loader text="Loading blogs" />
              <></>
            ) : blogData?.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 w-full mt-3">
                {blogData?.map((_: any, index: number) => (
                  <React.Fragment key={index}>
                    <MediaCard type={"BLOGS"} media={_} />
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <NoItems
                icon={<AiFillFileExclamation size={30} />}
                headerText="No Blogs"
                subtext="There are no blogs matching the specific filter. Try adjusting the filters to find blogs."
              />
            )}
            {!Boolean(search) && (
              <div className="w-full flex justify-between mt-4">
                {/* <ItemsPerPageSelector
                  limit={blogsLimit}
                  setLimit={setBlogsLimit}
                /> */}
                {(blogsPage > 0 || blogs?.length > 7) && (
                  <Pagination
                    page={blogsPage}
                    setPage={setBlogsPage}
                    limit={blogsLimit}
                    currentData={blogData}
                  />
                )}
              </div>
            )}
          </div>
          {/* VIDEOS */}
          <div
            className={clsx(
              videoData?.length < 1 &&
                !(videosLoading || filteredMediaLoading || search)
                ? "hidden"
                : "block",
              ``
            )}
          >
            {videoData && Boolean(videoData?.length) && (
              <div className="flex justify-between items-center">
                <h1 className="text-[#475569] font-semibold text-xl">Videos</h1>
              </div>
            )}
            {videosLoading || filteredMediaLoading ? (
              // <Loader text="Loading videos" />
              <></>
            ) : videoData?.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 w-full mt-3">
                {videoData?.map((_: any, index: number) => (
                  <React.Fragment key={index}>
                    <MediaCard type={"VIDEOS"} media={_} />
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <NoItems
                headerText="No Videos"
                subtext="There are no videos matching the specific filter. Try adjusting the filters to find videos."
                icon={<TbCameraExclamation size={30} />}
              />
            )}
            {!Boolean(search) && (
              <div className="w-full flex justify-between mt-4">
                {/* <ItemsPerPageSelector
                  limit={videosLimit}
                  setLimit={setVideosLimit}
                /> */}
                {(videosPage > 0 || videos?.length > 7) && (
                  <Pagination
                    page={videosPage}
                    setPage={setVideosPage}
                    limit={videosLimit}
                    currentData={videoData}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-start-4 ">
        <div className="pb-16 border-b border-[#E2E8F0]">
          <ProfileCard profile={profile} />
        </div>
        {/* ADS */}

        <div
          className={clsx(
            adData?.length < 1 &&
              !(adsLoading || filteredMediaLoading || search)
              ? "hidden"
              : "block"
          )}
        >
          <div className="flex items-center justify-between">
            {adData && !!adData?.length && (
              <h1 className="text-[#475569] font-semibold text-xl">Ads</h1>
            )}
            {!Boolean(search) && (
              <Pagination
                page={adsPage}
                setPage={setAdsPage}
                limit={adsLimit}
                currentData={adData}
                variant="no-text"
              />
            )}
          </div>
          {adsLoading || filteredMediaLoading ? (
            // <Loader text="Loading ads" />
            <></>
          ) : adData?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 w-full mt-3">
              {adData?.map((_: any, index: number) => (
                <React.Fragment key={index}>
                  <MediaCard type={"ADS"} media={_} />
                </React.Fragment>
              ))}
            </div>
          ) : (
            <NoItems
              icon={<AiFillFileExclamation size={30} />}
              headerText="No Ads"
              subtext="There are no ads matching the specific filter. Try adjusting the filters to find ads."
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaHomeTemplate;
