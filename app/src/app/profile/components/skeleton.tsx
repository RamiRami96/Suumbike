export function Skeleton() {
  return (
    <div className="flex justify-between items-center animate-pulse">
      <div className="w-[60px] sm:w-[140px] md:w-[200px]pl-2 py-3 sm:pl-6 flex align-center">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
      </div>
      <div className="w-[100px] sm:w-[140px] md:w-[200px] px-2 py-3 sm:px-6 flex align-">
        <div className="w-24 sm:w-24 md:w-48 h-10 bg-gray-300"></div>
      </div>
      <div className="w-[100px] sm:w-[140px] md:w-[200px] px-2 py-3 sm:px-6 flex align-center">
        <div className="w-14 sm:w-24 md:w-48 h-10 bg-gray-300"></div>
      </div>
      <div className="w-[60px] sm:w-[140px] md:w-[250px] py-3 pr-4 sm:pr-6 flex align-center">
        <div className="w-14 sm:w-24 md:w-48 h-10 bg-gray-300"></div>
      </div>
    </div>
  );
}
