"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const numberOfHearts = 25;

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const generateHeartStyles = (index: number) => {
    return {
      "--heart-radius": `${index}vw`,
      "--heart-float-duration": `${index * 4}s`,
      "--heart-sway-duration": `${index * 0.5}s`,
      "--heart-float-delay": `${index * 0.1}s`,
      "--heart-sway-delay": `${index * 0.1}s`,
      "--heart-sway-type":
        index % 2 === 0 ? "sway-left-to-right" : "sway-right-to-left",
    };
  };

  const handleClick = () => {
    setLoading(true);
    if (session) {
      router.push("/stream");
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <main className="h-[90.3vh] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="hearts h-[90.3vh]">
        {Array.from({ length: numberOfHearts }, (_, index) => (
          <div
            key={index}
            className="heart"
            style={generateHeartStyles(index + 1) as React.CSSProperties}
            aria-label="Heart"
          >
            ❤
          </div>
        ))}
      </div>
      <button
        onClick={handleClick}
        className="absolute z-50 border-2 border-pink-400 h-48 w-48 rounded-full bg-white text-pink-600 font-bold uppercase shadow-2xl shadow-pink-300 flex items-center justify-center"
      >
        {loading ? (
          <div className="animate-spin rounded-full border-t-4 border-pink-600 border-solid h-6 w-6" />
        ) : (
          "Start"
        )}
      </button>
    </main>
  );
}
