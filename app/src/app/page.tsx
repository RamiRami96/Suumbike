import Link from "next/link";

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

export default function Page() {
  return (
    <main className="h-[90.3vh] flex flex-col items-center justify-center relative overflow-hidden">
      <h1 className="text-center text-white font-black mt-12 relative z-50 drop-shadow-[0_1.2px_1.2px_rgba(219,39,119,0.8)]">MEET<span className="text-xs md:text-sm text-pink-600 px-1">❤</span>CHAT<span className="text-xs md:text-sm text-pink-600 px-1">❤</span>LOVE<span className="text-xs md:text-sm text-pink-600 px-1">❤</span></h1>
      <div className="hearts h-[90.3vh]">
        {Array.from({ length: 25 }, (_, index) => (
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
      <Link
        href="/stream"
        className="absolute z-50 border-2 border-pink-400 h-48 w-48 rounded-full bg-white text-pink-600 font-bold uppercase shadow-2xl shadow-pink-300 flex items-center justify-center opacity-70 hover:opacity-90 active:opacity-90 transition-opacity"
      >
        Start
      </Link>
    </main>
  );
}
