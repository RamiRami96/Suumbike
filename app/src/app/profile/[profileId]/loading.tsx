export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-pink-600 animate-pulse h-[43.2px] w-[153.88px] rounded-lg"></div>
      <div className="mt-10 flex flex-col items-center">
        <div className="relative w-[300px] h-[300px] bg-pink-600 animate-pulse rounded-t-3xl"></div>
        <div className="mt-4 w-[300px] p-4 rounded-b-xl border-2 border-pink-600 animate-pulse">
          <div className="bg-pink-600 animate-pulse h-[40px] w-[268px] mb-4"></div>
          <div className="bg-pink-600 animate-pulse h-[24px] w-[268px] mb-1"></div>
          <div className="bg-pink-600 animate-pulse h-[24px] w-[268px]"></div>
        </div>
      </div>
    </div>
  );
}
