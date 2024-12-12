import React from "react";
import MediaCard from "../_components/MediaCard";
import ProfileCard from "../_components/ProfileCard";

function MediaHomeTemplate() {
  // Implement the first media homepage template here

  // any special components can live in _components folder under home
  return (
    <div className="pb-20 grid grid-cols-4 gap-7">
      <div className="col-start-1 col-span-3 ">
        <div className="">
          <div className="w-full">
            <h1 className="text-[#475569] font-semibold text-xl">Blog</h1>
            <div className="grid grid-cols-3 gap-4 w-full mt-3">
              {Array.from({ length: 4 }).map((_: any, index: number) => (
                <React.Fragment key={index}>
                  <MediaCard showDate/>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="mt-8 mb-4">
            <h1 className="text-[#475569] font-semibold text-xl">News</h1>
            <div className="grid grid-cols-3 gap-4 w-full mt-3">
              {Array.from({ length: 1 }).map((_: any, index: number) => (
                <React.Fragment key={index}>
                  <MediaCard />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className=" col-start-4 ">
        <div className="pb-8 border-b border-[#E2E8F0]">

        <ProfileCard />
        </div>
        <div className="mt-8">
          <h1 className="text-slate-900 font-semibold text-xl">Ads</h1>
          <div className="grid grid-cols-1 gap-4 w-full mt-3">
              {Array.from({ length: 1 }).map((_: any, index: number) => (
                <React.Fragment key={index}>
                  <MediaCard />
                </React.Fragment>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}

export default MediaHomeTemplate;
