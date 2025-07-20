import React from "react";

export function Spinner() {
  return (
    <div className="flex justify-center items-center z-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-600"></div>
    </div>
  );
}
