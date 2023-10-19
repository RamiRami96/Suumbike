
export default function Loading() {
  return (
    <div className="relative h-[90vh] flex justify-center mt-50">
      <div className="absolute z-10 top-12 left-3 md:hidden w-20 h-[29.6px] bg-gray-300 animate-pulse rounded-2xl"></div>
      <div className="absolute z-10 top-10 right-3 md:hidden w-[106px] h-[80px] bg-gray-300 animate-pulse rounded-2xl"></div>
      <div className="absolute z-10 bg-white bottom-0 w-50 h-24 flex justify-center md:justify-between items-center w-11/12 md:w-5/6 shadow-inner rounded-tl-2xl rounded-tr-2xl pl-5 pr-5">
        <div className="hidden md:block w-20 h-[29.6px] bg-gray-300 animate-pulse rounded-2xl"></div>
        <div className="inline-flex">
          <div className="rounded-l-md h-[39.2px] w-24 bg-gray-300 animate-pulse"></div>
          <div className="h-[39.2px] w-24 bg-gray-300 animate-pulse"></div>
          <div className="rounded-r-md h-[39.2px] w-24 bg-gray-300 animate-pulse"></div>
        </div>
        <div className="hidden md:block w-[106px] h-[80px] bg-gray-300 animate-pulse rounded-2xl"></div>
      </div>
    </div>
  );
}
