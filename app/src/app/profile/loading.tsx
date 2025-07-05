import { Fragment } from "react";
import { Skeleton } from "@/modules/profile/components/skeleton";

export default function Loading() {
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col items-center mt-14 min-w-[320px] w-full sm:w-4/6 ">
        <div className="flex justify-start items-center mb-8">
          <div className="flex items-center">
            <div className="w-[132px] h-[132px] rounded-full bg-pink-600 animate-pulse"></div>
            <div className="flex flex-col ml-6">
              <div className="h-[36px] w-36 bg-pink-600 animate-pulse"></div>
              <div className="h-[40px] w-36 mt-2 bg-pink-600 animate-pulse"></div>
              <div className="h-[40px] w-36 mt-2 bg-pink-600 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="bg-dark-purple rounded-lg overflow-hidden min-w-[320px] ">
          <div className="flex justify-between animate-pulse bg-pink-600 text-white h-[44px]"></div>
          <div className="h-[45vh] md:h-[50vh] overflow-y-auto px-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <Fragment key={index}>
                <Skeleton />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
