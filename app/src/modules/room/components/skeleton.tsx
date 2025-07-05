export function Skeleton() {
  return (
    <div className="relative h-[90vh] flex justify-center mt-50">
      <div className="absolute z-10 bg-[linear-gradient(180deg,_#140133f2_-29.17%,_#160229fa_91.67%)] bottom-0 w-50 h-24 flex justify-center md:justify-between items-center w-11/12 md:w-5/6 shadow-inner rounded-tl-2xl rounded-tr-2xl pl-5 pr-5">
        <div className="hidden md:block w-20 h-[29.6px] bg-[linear-gradient(180deg,_#140133f2_-29.17%,_#160229fa_91.67%)] animate-pulse rounded-2xl"></div>
        <div className="flex justify-center">
          <div className="rounded-l-md h-[39.2px] w-24 bg-[linear-gradient(180deg,_#140133f2_-29.17%,_#160229fa_91.67%)] animate-pulse"></div>
          <div className="rounded-r-md h-[39.2px] w-24 bg-[linear-gradient(180deg,_#140133f2_-29.17%,_#160229fa_91.67%)] animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
